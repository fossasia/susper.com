"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
const http = require("http");
const ReplaySubject_1 = require("rxjs/ReplaySubject");
const empty_1 = require("rxjs/observable/empty");
const from_1 = require("rxjs/observable/from");
const of_1 = require("rxjs/observable/of");
const operators_1 = require("rxjs/operators");
const semver = require("semver");
const semverIntersect = require('semver-intersect');
const kPackageJsonDependencyFields = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
];
const npmPackageJsonCache = new Map();
function _getVersionFromNpmPackage(json, version, loose) {
    const distTags = json['dist-tags'];
    if (distTags && distTags[version]) {
        return (loose ? '~' : '') + distTags[version];
    }
    else {
        if (!semver.validRange(version)) {
            throw new schematics_1.SchematicsException(`Invalid range or version: "${version}".`);
        }
        if (semver.valid(version) && loose) {
            version = '~' + version;
        }
        const packageVersions = Object.keys(json['versions']);
        const maybeMatch = semver.maxSatisfying(packageVersions, version);
        if (!maybeMatch) {
            throw new schematics_1.SchematicsException(`Version "${version}" has no satisfying version for package ${json['name']}`);
        }
        const maybeOperator = version.match(/^[~^]/);
        if (version == '*') {
            return maybeMatch;
        }
        else if (maybeOperator) {
            return maybeOperator[0] + maybeMatch;
        }
        else {
            return (loose ? '~' : '') + maybeMatch;
        }
    }
}
/**
 * Get the NPM repository's package.json for a package. This is p
 * @param {string} packageName The package name to fetch.
 * @param {LoggerApi} logger A logger instance to log debug information.
 * @returns {Observable<JsonObject>} An observable that will put the pacakge.json content.
 * @private
 */
function _getNpmPackageJson(packageName, logger) {
    const url = `http://registry.npmjs.org/${packageName.replace(/\//g, '%2F')}`;
    logger.debug(`Getting package.json from ${JSON.stringify(packageName)}...`);
    let maybeRequest = npmPackageJsonCache.get(url);
    if (!maybeRequest) {
        const subject = new ReplaySubject_1.ReplaySubject(1);
        const request = http.request(url, response => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    subject.next(json);
                    subject.complete();
                }
                catch (err) {
                    subject.error(err);
                }
            });
            response.on('error', err => subject.error(err));
        });
        request.end();
        maybeRequest = subject.asObservable();
        npmPackageJsonCache.set(url, maybeRequest);
    }
    return maybeRequest;
}
/**
 * Recursively get versions of packages to update to, along with peer dependencies. Only recurse
 * peer dependencies and only update versions of packages that are in the original package.json.
 * @param {JsonObject} packageJson The original package.json to update.
 * @param {{[p: string]: string}} packages
 * @param {{[p: string]: string}} allVersions
 * @param {LoggerApi} logger
 * @param {boolean} loose
 * @returns {Observable<void>}
 * @private
 */
function _getRecursiveVersions(packageJson, packages, allVersions, logger, loose) {
    return from_1.from(kPackageJsonDependencyFields).pipe(operators_1.mergeMap(field => {
        const deps = packageJson[field];
        if (deps) {
            return from_1.from(Object.keys(deps)
                .map(depName => depName in deps ? [depName, deps[depName]] : null)
                .filter(x => !!x));
        }
        else {
            return empty_1.empty();
        }
    }), operators_1.mergeMap(([depName, depVersion]) => {
        if (!packages[depName] || packages[depName] === depVersion) {
            return empty_1.empty();
        }
        if (allVersions[depName] && semver.intersects(allVersions[depName], depVersion)) {
            allVersions[depName] = semverIntersect.intersect(allVersions[depName], depVersion);
            return empty_1.empty();
        }
        return _getNpmPackageJson(depName, logger).pipe(operators_1.map(json => [packages[depName], depName, depVersion, json]));
    }), operators_1.mergeMap(([version, depName, depVersion, npmPackageJson]) => {
        const updateVersion = _getVersionFromNpmPackage(npmPackageJson, version, loose);
        const npmPackageVersions = Object.keys(npmPackageJson['versions']);
        const match = semver.maxSatisfying(npmPackageVersions, updateVersion);
        if (!match) {
            return empty_1.empty();
        }
        if (semver.lt(semverIntersect.parseRange(updateVersion).version, semverIntersect.parseRange(depVersion).version)) {
            throw new schematics_1.SchematicsException(`Cannot downgrade package ${JSON.stringify(depName)} from version "${depVersion}" to "${updateVersion}".`);
        }
        const innerNpmPackageJson = npmPackageJson['versions'][match];
        const dependencies = {};
        const deps = innerNpmPackageJson['peerDependencies'];
        if (deps) {
            for (const depName of Object.keys(deps)) {
                dependencies[depName] = deps[depName];
            }
        }
        logger.debug(`Recording update for ${JSON.stringify(depName)} to version ${updateVersion}.`);
        if (allVersions[depName]) {
            if (!semver.intersects(allVersions[depName], updateVersion)) {
                throw new schematics_1.SchematicsException('Cannot update safely because packages have conflicting dependencies. Package '
                    + `${depName} would need to match both versions "${updateVersion}" and `
                    + `"${allVersions[depName]}, which are not compatible.`);
            }
            allVersions[depName] = semverIntersect.intersect(allVersions[depName], updateVersion);
        }
        else {
            allVersions[depName] = updateVersion;
        }
        return _getRecursiveVersions(packageJson, dependencies, allVersions, logger, loose);
    }));
}
/**
 * Use a Rule which can return an observable, but do not actually modify the Tree.
 * This rules perform an HTTP request to get the npm registry package.json, then resolve the
 * version from the options, and replace the version in the options by an actual version.
 * @param supportedPackages A list of packages to update (at the same version).
 * @param maybeVersion A version to update those packages to.
 * @param loose Whether to use loose version operators (instead of specific versions).
 * @private
 */
function updatePackageJson(supportedPackages, maybeVersion = 'latest', loose = false) {
    const version = maybeVersion ? maybeVersion : 'latest';
    // This will be updated as we read the NPM repository.
    const allVersions = {};
    return schematics_1.chain([
        (tree, context) => {
            const packageJsonContent = tree.read('/package.json');
            if (!packageJsonContent) {
                throw new schematics_1.SchematicsException('Could not find package.json.');
            }
            const packageJson = JSON.parse(packageJsonContent.toString());
            const packages = {};
            for (const name of supportedPackages) {
                packages[name] = version;
            }
            return _getRecursiveVersions(packageJson, packages, allVersions, context.logger, loose).pipe(operators_1.ignoreElements(), operators_1.concat(of_1.of(tree)), operators_1.map(_ => tree));
        },
        (tree) => {
            const packageJsonContent = tree.read('/package.json');
            if (!packageJsonContent) {
                throw new schematics_1.SchematicsException('Could not find package.json.');
            }
            const packageJson = JSON.parse(packageJsonContent.toString());
            for (const field of kPackageJsonDependencyFields) {
                const deps = packageJson[field];
                if (!deps) {
                    continue;
                }
                for (const depName of Object.keys(packageJson[field])) {
                    if (allVersions[depName]) {
                        packageJson[field][depName] = allVersions[depName];
                    }
                }
            }
            tree.overwrite('/package.json', JSON.stringify(packageJson, null, 2) + '\n');
            return tree;
        },
        (_tree, context) => {
            context.addTask(new tasks_1.NodePackageInstallTask());
        },
    ]);
}
exports.updatePackageJson = updatePackageJson;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnBtLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9zY2hlbWF0aWNzL3BhY2thZ2VfdXBkYXRlL3V0aWxpdHkvbnBtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUEsMkRBTW9DO0FBQ3BDLDREQUEwRTtBQUMxRSw2QkFBNkI7QUFFN0Isc0RBQW1EO0FBQ25ELGlEQUE4QztBQUM5QywrQ0FBOEQ7QUFDOUQsMkNBQXdEO0FBQ3hELDhDQUF1RTtBQUN2RSxpQ0FBaUM7QUFFakMsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFFcEQsTUFBTSw0QkFBNEIsR0FBRztJQUNuQyxjQUFjO0lBQ2QsaUJBQWlCO0lBQ2pCLGtCQUFrQjtJQUNsQixzQkFBc0I7Q0FDdkIsQ0FBQztBQUdGLE1BQU0sbUJBQW1CLEdBQUcsSUFBSSxHQUFHLEVBQWtDLENBQUM7QUFFdEUsbUNBQW1DLElBQWdCLEVBQUUsT0FBZSxFQUFFLEtBQWM7SUFDbEYsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBZSxDQUFDO0lBQ2pELEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFXLENBQUM7SUFDMUQsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxNQUFNLElBQUksZ0NBQW1CLENBQUMsOEJBQThCLE9BQU8sSUFBSSxDQUFDLENBQUM7UUFDM0UsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUks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QUFlLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBRTdFLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBQ0QsQ0FBQyxLQUFXLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1lBQ3pDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSw4QkFBc0IsRUFBRSxDQUFDLENBQUM7UUFDaEQsQ0FBQztLQUNGLENBQUMsQ0FBQztBQUNMLENBQUM7QUF2REQsOENBdURDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgSnNvbk9iamVjdCwgbG9nZ2luZyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7XG4gIFJ1bGUsXG4gIFNjaGVtYXRpY0NvbnRleHQsXG4gIFNjaGVtYXRpY3NFeGNlcHRpb24sXG4gIFRyZWUsXG4gIGNoYWluLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgeyBOb2RlUGFja2FnZUluc3RhbGxUYXNrIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0ICogYXMgaHR0cCBmcm9tICdodHRwJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xuaW1wb3J0IHsgUmVwbGF5U3ViamVjdCB9IGZyb20gJ3J4anMvUmVwbGF5U3ViamVjdCc7XG5pbXBvcnQgeyBlbXB0eSB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9lbXB0eSc7XG5pbXBvcnQgeyBmcm9tIGFzIG9ic2VydmFibGVGcm9tIH0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL2Zyb20nO1xuaW1wb3J0IHsgb2YgYXMgb2JzZXJ2YWJsZU9mIH0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL29mJztcbmltcG9ydCB7IGNvbmNhdCwgaWdub3JlRWxlbWVudHMsIG1hcCwgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgKiBhcyBzZW12ZXIgZnJvbSAnc2VtdmVyJztcblxuY29uc3Qgc2VtdmVySW50ZXJzZWN0ID0gcmVxdWlyZSgnc2VtdmVyLWludGVyc2VjdCcpO1xuXG5jb25zdCBrUGFja2FnZUpzb25EZXBlbmRlbmN5RmllbGRzID0gW1xuICAnZGVwZW5kZW5jaWVzJyxcbiAgJ2RldkRlcGVuZGVuY2llcycsXG4gICdwZWVyRGVwZW5kZW5jaWVzJyxcbiAgJ29wdGlvbmFsRGVwZW5kZW5jaWVzJyxcbl07XG5cblxuY29uc3QgbnBtUGFja2FnZUpzb25DYWNoZSA9IG5ldyBNYXA8c3RyaW5nLCBPYnNlcnZhYmxlPEpzb25PYmplY3Q+PigpO1xuXG5mdW5jdGlvbiBfZ2V0VmVyc2lvbkZyb21OcG1QYWNrYWdlKGpzb246IEpzb25PYmplY3QsIHZlcnNpb246IHN0cmluZywgbG9vc2U6IGJvb2xlYW4pOiBzdHJpbmcge1xuICBjb25zdCBkaXN0VGFncyA9IGpzb25bJ2Rpc3QtdGFncyddIGFzIEpzb25PYmplY3Q7XG4gIGlmIChkaXN0VGFncyAmJiBkaXN0VGFnc1t2ZXJzaW9uXSkge1xuICAgIHJldHVybiAobG9vc2UgPyAnficgOiAnJykgKyBkaXN0VGFnc1t2ZXJzaW9uXSBhcyBzdHJpbmc7XG4gIH0gZWxzZSB7XG4gICAgaWYgKCFzZW12ZXIudmFsaWRSYW5nZSh2ZXJzaW9uKSkge1xuICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYEludmFsaWQgcmFuZ2Ugb3IgdmVyc2lvbjogXCIke3ZlcnNpb259XCIuYCk7XG4gICAgfVxuICAgIGlmIChzZW12ZXIudmFsaWQodmVyc2lvbikgJiYgbG9vc2UpIHtcbiAgICAgIHZlcnNpb24gPSAnficgKyB2ZXJzaW9uO1xuICAgIH1cblxuICAgIGNvbnN0IHBhY2thZ2VWZXJzaW9ucyA9IE9iamVjdC5rZXlzKGpzb25bJ3ZlcnNpb25zJ10gYXMgSnNvbk9iamVjdCk7XG4gICAgY29uc3QgbWF5YmVNYXRjaCA9IHNlbXZlci5tYXhTYXRpc2Z5aW5nKHBhY2thZ2VWZXJzaW9ucywgdmVyc2lvbik7XG5cbiAgICBpZiAoIW1heWJlTWF0Y2gpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKFxuICAgICAgICBgVmVyc2lvbiBcIiR7dmVyc2lvbn1cIiBoYXMgbm8gc2F0aXNmeWluZyB2ZXJzaW9uIGZvciBwYWNrYWdlICR7anNvblsnbmFtZSddfWAsXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IG1heWJlT3BlcmF0b3IgPSB2ZXJzaW9uLm1hdGNoKC9eW35eXS8pO1xuICAgIGlmICh2ZXJzaW9uID09ICcqJykge1xuICAgICAgcmV0dXJuIG1heWJlTWF0Y2g7XG4gICAgfSBlbHNlIGlmIChtYXliZU9wZXJhdG9yKSB7XG4gICAgICByZXR1cm4gbWF5YmVPcGVyYXRvclswXSArIG1heWJlTWF0Y2g7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAobG9vc2UgPyAnficgOiAnJykgKyBtYXliZU1hdGNoO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIEdldCB0aGUgTlBNIHJlcG9zaXRvcnkncyBwYWNrYWdlLmpzb24gZm9yIGEgcGFja2FnZS4gVGhpcyBpcyBwXG4gKiBAcGFyYW0ge3N0cmluZ30gcGFja2FnZU5hbWUgVGhlIHBhY2thZ2UgbmFtZSB0byBmZXRjaC5cbiAqIEBwYXJhbSB7TG9nZ2VyQXBpfSBsb2dnZXIgQSBsb2dnZXIgaW5zdGFuY2UgdG8gbG9nIGRlYnVnIGluZm9ybWF0aW9uLlxuICogQHJldHVybnMge09ic2VydmFibGU8SnNvbk9iamVjdD59IEFuIG9ic2VydmFibGUgdGhhdCB3aWxsIHB1dCB0aGUgcGFjYWtnZS5qc29uIGNvbnRlbnQuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfZ2V0TnBtUGFja2FnZUpzb24oXG4gIHBhY2thZ2VOYW1lOiBzdHJpbmcsXG4gIGxvZ2dlcjogbG9nZ2luZy5Mb2dnZXJBcGksXG4pOiBPYnNlcnZhYmxlPEpzb25PYmplY3Q+IHtcbiAgY29uc3QgdXJsID0gYGh0dHA6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvJHtwYWNrYWdlTmFtZS5yZXBsYWNlKC9cXC8vZywgJyUyRicpfWA7XG4gIGxvZ2dlci5kZWJ1ZyhgR2V0dGluZyBwYWNrYWdlLmpzb24gZnJvbSAke0pTT04uc3RyaW5naWZ5KHBhY2thZ2VOYW1lKX0uLi5gKTtcblxuICBsZXQgbWF5YmVSZXF1ZXN0ID0gbnBtUGFja2FnZUpzb25DYWNoZS5nZXQodXJsKTtcbiAgaWYgKCFtYXliZVJlcXVlc3QpIHtcbiAgICBjb25zdCBzdWJqZWN0ID0gbmV3IFJlcGxheVN1YmplY3Q8SnNvbk9iamVjdD4oMSk7XG5cbiAgICBjb25zdCByZXF1ZXN0ID0gaHR0cC5yZXF1ZXN0KHVybCwgcmVzcG9uc2UgPT4ge1xuICAgICAgbGV0IGRhdGEgPSAnJztcbiAgICAgIHJlc3BvbnNlLm9uKCdkYXRhJywgY2h1bmsgPT4gZGF0YSArPSBjaHVuayk7XG4gICAgICByZXNwb25zZS5vbignZW5kJywgKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKGRhdGEpO1xuICAgICAgICAgIHN1YmplY3QubmV4dChqc29uIGFzIEpzb25PYmplY3QpO1xuICAgICAgICAgIHN1YmplY3QuY29tcGxldGUoKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJlc3BvbnNlLm9uKCdlcnJvcicsIGVyciA9PiBzdWJqZWN0LmVycm9yKGVycikpO1xuICAgIH0pO1xuICAgIHJlcXVlc3QuZW5kKCk7XG5cbiAgICBtYXliZVJlcXVlc3QgPSBzdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICAgIG5wbVBhY2thZ2VKc29uQ2FjaGUuc2V0KHVybCwgbWF5YmVSZXF1ZXN0KTtcbiAgfVxuXG4gIHJldHVybiBtYXliZVJlcXVlc3Q7XG59XG5cbi8qKlxuICogUmVjdXJzaXZlbHkgZ2V0IHZlcnNpb25zIG9mIHBhY2thZ2VzIHRvIHVwZGF0ZSB0bywgYWxvbmcgd2l0aCBwZWVyIGRlcGVuZGVuY2llcy4gT25seSByZWN1cnNlXG4gKiBwZWVyIGRlcGVuZGVuY2llcyBhbmQgb25seSB1cGRhdGUgdmVyc2lvbnMgb2YgcGFja2FnZXMgdGhhdCBhcmUgaW4gdGhlIG9yaWdpbmFsIHBhY2thZ2UuanNvbi5cbiAqIEBwYXJhbSB7SnNvbk9iamVjdH0gcGFja2FnZUpzb24gVGhlIG9yaWdpbmFsIHBhY2thZ2UuanNvbiB0byB1cGRhdGUuXG4gKiBAcGFyYW0ge3tbcDogc3RyaW5nXTogc3RyaW5nfX0gcGFja2FnZXNcbiAqIEBwYXJhbSB7e1twOiBzdHJpbmddOiBzdHJpbmd9fSBhbGxWZXJzaW9uc1xuICogQHBhcmFtIHtMb2dnZXJBcGl9IGxvZ2dlclxuICogQHBhcmFtIHtib29sZWFufSBsb29zZVxuICogQHJldHVybnMge09ic2VydmFibGU8dm9pZD59XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfZ2V0UmVjdXJzaXZlVmVyc2lvbnMoXG4gIHBhY2thZ2VKc29uOiBKc29uT2JqZWN0LFxuICBwYWNrYWdlczogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0sXG4gIGFsbFZlcnNpb25zOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfSxcbiAgbG9nZ2VyOiBsb2dnaW5nLkxvZ2dlckFwaSxcbiAgbG9vc2U6IGJvb2xlYW4sXG4pOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgcmV0dXJuIG9ic2VydmFibGVGcm9tKGtQYWNrYWdlSnNvbkRlcGVuZGVuY3lGaWVsZHMpLnBpcGUoXG4gICAgbWVyZ2VNYXAoZmllbGQgPT4ge1xuICAgICAgY29uc3QgZGVwcyA9IHBhY2thZ2VKc29uW2ZpZWxkXSBhcyBKc29uT2JqZWN0O1xuICAgICAgaWYgKGRlcHMpIHtcbiAgICAgICAgcmV0dXJuIG9ic2VydmFibGVGcm9tKFxuICAgICAgICAgIE9iamVjdC5rZXlzKGRlcHMpXG4gICAgICAgICAgICAubWFwKGRlcE5hbWUgPT4gZGVwTmFtZSBpbiBkZXBzID8gW2RlcE5hbWUsIGRlcHNbZGVwTmFtZV1dIDogbnVsbClcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiAhIXgpLFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5KCk7XG4gICAgICB9XG4gICAgfSksXG4gICAgbWVyZ2VNYXAoKFtkZXBOYW1lLCBkZXBWZXJzaW9uXTogW3N0cmluZywgc3RyaW5nXSkgPT4ge1xuICAgICAgaWYgKCFwYWNrYWdlc1tkZXBOYW1lXSB8fCBwYWNrYWdlc1tkZXBOYW1lXSA9PT0gZGVwVmVyc2lvbikge1xuICAgICAgICByZXR1cm4gZW1wdHkoKTtcbiAgICAgIH1cbiAgICAgIGlmIChhbGxWZXJzaW9uc1tkZXBOYW1lXSAmJiBzZW12ZXIuaW50ZXJzZWN0cyhhbGxWZXJzaW9uc1tkZXBOYW1lXSwgZGVwVmVyc2lvbikpIHtcbiAgICAgICAgYWxsVmVyc2lvbnNbZGVwTmFtZV0gPSBzZW12ZXJJbnRlcnNlY3QuaW50ZXJzZWN0KGFsbFZlcnNpb25zW2RlcE5hbWVdLCBkZXBWZXJzaW9uKTtcblxuICAgICAgICByZXR1cm4gZW1wdHkoKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9nZXROcG1QYWNrYWdlSnNvbihkZXBOYW1lLCBsb2dnZXIpLnBpcGUoXG4gICAgICAgIG1hcChqc29uID0+IFtwYWNrYWdlc1tkZXBOYW1lXSwgZGVwTmFtZSwgZGVwVmVyc2lvbiwganNvbl0pLFxuICAgICAgKTtcbiAgICB9KSxcbiAgICBtZXJnZU1hcCgoW3ZlcnNpb24sIGRlcE5hbWUsIGRlcFZlcnNpb24sIG5wbVBhY2thZ2VKc29uXSkgPT4ge1xuICAgICAgY29uc3QgdXBkYXRlVmVyc2lvbiA9IF9nZXRWZXJzaW9uRnJvbU5wbVBhY2thZ2UobnBtUGFja2FnZUpzb24sIHZlcnNpb24sIGxvb3NlKTtcbiAgICAgIGNvbnN0IG5wbVBhY2thZ2VWZXJzaW9ucyA9IE9iamVjdC5rZXlzKG5wbVBhY2thZ2VKc29uWyd2ZXJzaW9ucyddIGFzIEpzb25PYmplY3QpO1xuICAgICAgY29uc3QgbWF0Y2ggPSBzZW12ZXIubWF4U2F0aXNmeWluZyhucG1QYWNrYWdlVmVyc2lvbnMsIHVwZGF0ZVZlcnNpb24pO1xuICAgICAgaWYgKCFtYXRjaCkge1xuICAgICAgICByZXR1cm4gZW1wdHkoKTtcbiAgICAgIH1cbiAgICAgIGlmIChzZW12ZXIubHQoXG4gICAgICAgIHNlbXZlckludGVyc2VjdC5wYXJzZVJhbmdlKHVwZGF0ZVZlcnNpb24pLnZlcnNpb24sXG4gICAgICAgIHNlbXZlckludGVyc2VjdC5wYXJzZVJhbmdlKGRlcFZlcnNpb24pLnZlcnNpb24pXG4gICAgICApIHtcbiAgICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oYENhbm5vdCBkb3duZ3JhZGUgcGFja2FnZSAke1xuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KGRlcE5hbWUpfSBmcm9tIHZlcnNpb24gXCIke2RlcFZlcnNpb259XCIgdG8gXCIke3VwZGF0ZVZlcnNpb259XCIuYCxcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW5uZXJOcG1QYWNrYWdlSnNvbiA9IChucG1QYWNrYWdlSnNvblsndmVyc2lvbnMnXSBhcyBKc29uT2JqZWN0KVttYXRjaF0gYXMgSnNvbk9iamVjdDtcbiAgICAgIGNvbnN0IGRlcGVuZGVuY2llczogeyBbbmFtZTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcblxuICAgICAgY29uc3QgZGVwcyA9IGlubmVyTnBtUGFja2FnZUpzb25bJ3BlZXJEZXBlbmRlbmNpZXMnXSBhcyBKc29uT2JqZWN0O1xuICAgICAgaWYgKGRlcHMpIHtcbiAgICAgICAgZm9yIChjb25zdCBkZXBOYW1lIG9mIE9iamVjdC5rZXlzKGRlcHMpKSB7XG4gICAgICAgICAgZGVwZW5kZW5jaWVzW2RlcE5hbWVdID0gZGVwc1tkZXBOYW1lXSBhcyBzdHJpbmc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbG9nZ2VyLmRlYnVnKGBSZWNvcmRpbmcgdXBkYXRlIGZvciAke0pTT04uc3RyaW5naWZ5KGRlcE5hbWUpfSB0byB2ZXJzaW9uICR7dXBkYXRlVmVyc2lvbn0uYCk7XG5cbiAgICAgIGlmIChhbGxWZXJzaW9uc1tkZXBOYW1lXSkge1xuICAgICAgICBpZiAoIXNlbXZlci5pbnRlcnNlY3RzKGFsbFZlcnNpb25zW2RlcE5hbWVdLCB1cGRhdGVWZXJzaW9uKSkge1xuICAgICAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKFxuICAgICAgICAgICAgJ0Nhbm5vdCB1cGRhdGUgc2FmZWx5IGJlY2F1c2UgcGFja2FnZXMgaGF2ZSBjb25mbGljdGluZyBkZXBlbmRlbmNpZXMuIFBhY2thZ2UgJ1xuICAgICAgICAgICAgKyBgJHtkZXBOYW1lfSB3b3VsZCBuZWVkIHRvIG1hdGNoIGJvdGggdmVyc2lvbnMgXCIke3VwZGF0ZVZlcnNpb259XCIgYW5kIGBcbiAgICAgICAgICAgICsgYFwiJHthbGxWZXJzaW9uc1tkZXBOYW1lXX0sIHdoaWNoIGFyZSBub3QgY29tcGF0aWJsZS5gLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgICAgICBhbGxWZXJzaW9uc1tkZXBOYW1lXSA9IHNlbXZlckludGVyc2VjdC5pbnRlcnNlY3QoYWxsVmVyc2lvbnNbZGVwTmFtZV0sIHVwZGF0ZVZlcnNpb24pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWxsVmVyc2lvbnNbZGVwTmFtZV0gPSB1cGRhdGVWZXJzaW9uO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX2dldFJlY3Vyc2l2ZVZlcnNpb25zKFxuICAgICAgICBwYWNrYWdlSnNvbixcbiAgICAgICAgZGVwZW5kZW5jaWVzLFxuICAgICAgICBhbGxWZXJzaW9ucyxcbiAgICAgICAgbG9nZ2VyLFxuICAgICAgICBsb29zZSxcbiAgICAgICk7XG4gICAgfSksXG4gICk7XG59XG5cbi8qKlxuICogVXNlIGEgUnVsZSB3aGljaCBjYW4gcmV0dXJuIGFuIG9ic2VydmFibGUsIGJ1dCBkbyBub3QgYWN0dWFsbHkgbW9kaWZ5IHRoZSBUcmVlLlxuICogVGhpcyBydWxlcyBwZXJmb3JtIGFuIEhUVFAgcmVxdWVzdCB0byBnZXQgdGhlIG5wbSByZWdpc3RyeSBwYWNrYWdlLmpzb24sIHRoZW4gcmVzb2x2ZSB0aGVcbiAqIHZlcnNpb24gZnJvbSB0aGUgb3B0aW9ucywgYW5kIHJlcGxhY2UgdGhlIHZlcnNpb24gaW4gdGhlIG9wdGlvbnMgYnkgYW4gYWN0dWFsIHZlcnNpb24uXG4gKiBAcGFyYW0gc3VwcG9ydGVkUGFja2FnZXMgQSBsaXN0IG9mIHBhY2thZ2VzIHRvIHVwZGF0ZSAoYXQgdGhlIHNhbWUgdmVyc2lvbikuXG4gKiBAcGFyYW0gbWF5YmVWZXJzaW9uIEEgdmVyc2lvbiB0byB1cGRhdGUgdGhvc2UgcGFja2FnZXMgdG8uXG4gKiBAcGFyYW0gbG9vc2UgV2hldGhlciB0byB1c2UgbG9vc2UgdmVyc2lvbiBvcGVyYXRvcnMgKGluc3RlYWQgb2Ygc3BlY2lmaWMgdmVyc2lvbnMpLlxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVBhY2thZ2VKc29uKFxuICBzdXBwb3J0ZWRQYWNrYWdlczogc3RyaW5nW10sXG4gIG1heWJlVmVyc2lvbiA9ICdsYXRlc3QnLFxuICBsb29zZSA9IGZhbHNlLFxuKTogUnVsZSB7XG4gIGNvbnN0IHZlcnNpb24gPSBtYXliZVZlcnNpb24gPyBtYXliZVZlcnNpb24gOiAnbGF0ZXN0JztcbiAgLy8gVGhpcyB3aWxsIGJlIHVwZGF0ZWQgYXMgd2UgcmVhZCB0aGUgTlBNIHJlcG9zaXRvcnkuXG4gIGNvbnN0IGFsbFZlcnNpb25zOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbiAgcmV0dXJuIGNoYWluKFtcbiAgICAodHJlZTogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCk6IE9ic2VydmFibGU8VHJlZT4gPT4ge1xuICAgICAgY29uc3QgcGFja2FnZUpzb25Db250ZW50ID0gdHJlZS5yZWFkKCcvcGFja2FnZS5qc29uJyk7XG4gICAgICBpZiAoIXBhY2thZ2VKc29uQ29udGVudCkge1xuICAgICAgICB0aHJvdyBuZXcgU2NoZW1hdGljc0V4Y2VwdGlvbignQ291bGQgbm90IGZpbmQgcGFja2FnZS5qc29uLicpO1xuICAgICAgfVxuICAgICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHBhY2thZ2VKc29uQ29udGVudC50b1N0cmluZygpKTtcbiAgICAgIGNvbnN0IHBhY2thZ2VzOiB7IFtuYW1lOiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICAgICAgZm9yIChjb25zdCBuYW1lIG9mIHN1cHBvcnRlZFBhY2thZ2VzKSB7XG4gICAgICAgIHBhY2thZ2VzW25hbWVdID0gdmVyc2lvbjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF9nZXRSZWN1cnNpdmVWZXJzaW9ucyhwYWNrYWdlSnNvbiwgcGFja2FnZXMsIGFsbFZlcnNpb25zLCBjb250ZXh0LmxvZ2dlciwgbG9vc2UpLnBpcGUoXG4gICAgICAgIGlnbm9yZUVsZW1lbnRzKCksXG4gICAgICAgIGNvbmNhdChvYnNlcnZhYmxlT2YodHJlZSkpLFxuICAgICAgICBtYXAoXyA9PiB0cmVlKSwgIC8vIEp1c3QgdG8gZ2V0IHRoZSBUeXBlU2NyaXB0IHR5cGVzeXN0ZW0gZml4ZWQuXG4gICAgICApO1xuICAgIH0sXG4gICAgKHRyZWU6IFRyZWUpID0+IHtcbiAgICAgIGNvbnN0IHBhY2thZ2VKc29uQ29udGVudCA9IHRyZWUucmVhZCgnL3BhY2thZ2UuanNvbicpO1xuICAgICAgaWYgKCFwYWNrYWdlSnNvbkNvbnRlbnQpIHtcbiAgICAgICAgdGhyb3cgbmV3IFNjaGVtYXRpY3NFeGNlcHRpb24oJ0NvdWxkIG5vdCBmaW5kIHBhY2thZ2UuanNvbi4nKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShwYWNrYWdlSnNvbkNvbnRlbnQudG9TdHJpbmcoKSk7XG5cbiAgICAgIGZvciAoY29uc3QgZmllbGQgb2Yga1BhY2thZ2VKc29uRGVwZW5kZW5jeUZpZWxkcykge1xuICAgICAgICBjb25zdCBkZXBzID0gcGFja2FnZUpzb25bZmllbGRdO1xuICAgICAgICBpZiAoIWRlcHMpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAoY29uc3QgZGVwTmFtZSBvZiBPYmplY3Qua2V5cyhwYWNrYWdlSnNvbltmaWVsZF0pKSB7XG4gICAgICAgICAgaWYgKGFsbFZlcnNpb25zW2RlcE5hbWVdKSB7XG4gICAgICAgICAgICBwYWNrYWdlSnNvbltmaWVsZF1bZGVwTmFtZV0gPSBhbGxWZXJzaW9uc1tkZXBOYW1lXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdHJlZS5vdmVyd3JpdGUoJy9wYWNrYWdlLmpzb24nLCBKU09OLnN0cmluZ2lmeShwYWNrYWdlSnNvbiwgbnVsbCwgMikgKyAnXFxuJyk7XG5cbiAgICAgIHJldHVybiB0cmVlO1xuICAgIH0sXG4gICAgKF90cmVlOiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgICBjb250ZXh0LmFkZFRhc2sobmV3IE5vZGVQYWNrYWdlSW5zdGFsbFRhc2soKSk7XG4gICAgfSxcbiAgXSk7XG59XG4iXX0=