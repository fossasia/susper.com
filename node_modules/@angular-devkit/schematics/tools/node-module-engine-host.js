"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core = require("@angular-devkit/core/node");
const tools_1 = require("@angular-devkit/schematics/tools");
const path_1 = require("path");
const export_ref_1 = require("./export-ref");
const file_system_engine_host_base_1 = require("./file-system-engine-host-base");
const file_system_utility_1 = require("./file-system-utility");
/**
 * A simple EngineHost that uses NodeModules to resolve collections.
 */
class NodeModulesEngineHost extends file_system_engine_host_base_1.FileSystemEngineHostBase {
    constructor() { super(); }
    _resolvePackageJson(name, basedir = process.cwd()) {
        return core.resolve(name, {
            basedir,
            checkLocal: true,
            checkGlobal: true,
            resolvePackageJson: true,
        });
    }
    _resolvePath(name, basedir = process.cwd()) {
        // Allow relative / absolute paths.
        if (name.startsWith('.') || name.startsWith('/')) {
            return path_1.resolve(basedir, name);
        }
        else {
            return core.resolve(name, {
                basedir,
                checkLocal: true,
                checkGlobal: true,
            });
        }
    }
    _resolveCollectionPath(name) {
        let packageJsonPath = this._resolvePackageJson(name, process.cwd());
        // If it's a file, use it as is. Otherwise append package.json to it.
        if (!core.fs.isFile(packageJsonPath)) {
            packageJsonPath = path_1.join(packageJsonPath, 'package.json');
        }
        try {
            const pkgJsonSchematics = require(packageJsonPath)['schematics'];
            if (pkgJsonSchematics) {
                const resolvedPath = this._resolvePath(pkgJsonSchematics, path_1.dirname(packageJsonPath));
                file_system_utility_1.readJsonFile(resolvedPath);
                return resolvedPath;
            }
        }
        catch (e) {
        }
        throw new tools_1.CollectionCannotBeResolvedException(name);
    }
    _resolveReferenceString(refString, parentPath) {
        const ref = new export_ref_1.ExportStringRef(refString, parentPath);
        if (!ref.ref) {
            return null;
        }
        return { ref: ref.ref, path: ref.module };
    }
    _transformCollectionDescription(name, desc) {
        if (!desc.schematics || typeof desc.schematics != 'object') {
            throw new tools_1.CollectionMissingSchematicsMapException(name);
        }
        return Object.assign({}, desc, { name });
    }
    _transformSchematicDescription(name, _collection, desc) {
        if (!desc.factoryFn || !desc.path || !desc.description) {
            throw new tools_1.SchematicMissingFieldsException(name);
        }
        return desc;
    }
}
exports.NodeModulesEngineHost = NodeModulesEngineHost;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS1tb2R1bGUtZW5naW5lLWhvc3QuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy90b29scy9ub2RlLW1vZHVsZS1lbmdpbmUtaG9zdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGtEQUFrRDtBQUVsRCw0REFJMEM7QUFDMUMsK0JBQTZEO0FBSzdELDZDQUErQztBQUMvQyxpRkFBMEU7QUFDMUUsK0RBQXFEO0FBR3JEOztHQUVHO0FBQ0gsMkJBQW1DLFNBQVEsdURBQXdCO0lBQ2pFLGdCQUFnQixLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFaEIsbUJBQW1CLENBQUMsSUFBWSxFQUFFLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFFO1FBQ2pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRTtZQUN4QixPQUFPO1lBQ1AsVUFBVSxFQUFFLElBQUk7WUFDaEIsV0FBVyxFQUFFLElBQUk7WUFDakIsa0JBQWtCLEVBQUUsSUFBSTtTQUN6QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRVMsWUFBWSxDQUFDLElBQVksRUFBRSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRTtRQUMxRCxtQ0FBbUM7UUFDbkMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqRCxNQUFNLENBQUMsY0FBVyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNwQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUU7Z0JBQ3hCLE9BQU87Z0JBQ1AsVUFBVSxFQUFFLElBQUk7Z0JBQ2hCLFdBQVcsRUFBRSxJQUFJO2FBQ2xCLENBQUMsQ0FBQztRQUNMLENBQUM7SUFDSCxDQUFDO0lBRVMsc0JBQXNCLENBQUMsSUFBWTtRQUMzQyxJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLHFFQUFxRTtRQUNyRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNyQyxlQUFlLEdBQUcsV0FBSSxDQUFDLGVBQWUsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBRUQsSUFBSSxDQUFDO1lBQ0gsTUFBTSxpQkFBaUIsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDakUsRUFBRSxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLGNBQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO2dCQUNwRixrQ0FBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUUzQixNQUFNLENBQUMsWUFBWSxDQUFDO1lBQ3RCLENBQUM7UUFDSCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNiLENBQUM7UUFDRCxNQUFNLElBQUksMkNBQW1DLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVTLHVCQUF1QixDQUFDLFNBQWlCLEVBQUUsVUFBa0I7UUFDckUsTUFBTSxHQUFHLEdBQUcsSUFBSSw0QkFBZSxDQUFrQixTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDeEUsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUM1QyxDQUFDO0lBRVMsK0JBQStCLENBQ3ZDLElBQVksRUFDWixJQUF1QztRQUV2QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDM0QsTUFBTSxJQUFJLCtDQUF1QyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFELENBQUM7UUFFRCxNQUFNLENBQUMsa0JBQ0YsSUFBSSxJQUNQLElBQUksR0FDdUIsQ0FBQztJQUNoQyxDQUFDO0lBRVMsOEJBQThCLENBQ3RDLElBQVksRUFDWixXQUFxQyxFQUNyQyxJQUFzQztRQUV0QyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDdkQsTUFBTSxJQUFJLHVDQUErQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFFRCxNQUFNLENBQUMsSUFBK0IsQ0FBQztJQUN6QyxDQUFDO0NBQ0Y7QUEvRUQsc0RBK0VDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgY29yZSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZS9ub2RlJztcbmltcG9ydCB7IFJ1bGVGYWN0b3J5IH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgQ29sbGVjdGlvbkNhbm5vdEJlUmVzb2x2ZWRFeGNlcHRpb24sXG4gIENvbGxlY3Rpb25NaXNzaW5nU2NoZW1hdGljc01hcEV4Y2VwdGlvbixcbiAgU2NoZW1hdGljTWlzc2luZ0ZpZWxkc0V4Y2VwdGlvbixcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdG9vbHMnO1xuaW1wb3J0IHsgZGlybmFtZSwgam9pbiwgcmVzb2x2ZSBhcyByZXNvbHZlUGF0aCB9IGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtcbiAgRmlsZVN5c3RlbUNvbGxlY3Rpb25EZXNjLFxuICBGaWxlU3lzdGVtU2NoZW1hdGljRGVzYyxcbn0gZnJvbSAnLi9kZXNjcmlwdGlvbic7XG5pbXBvcnQgeyBFeHBvcnRTdHJpbmdSZWYgfSBmcm9tICcuL2V4cG9ydC1yZWYnO1xuaW1wb3J0IHsgRmlsZVN5c3RlbUVuZ2luZUhvc3RCYXNlIH0gZnJvbSAnLi9maWxlLXN5c3RlbS1lbmdpbmUtaG9zdC1iYXNlJztcbmltcG9ydCB7IHJlYWRKc29uRmlsZSB9IGZyb20gJy4vZmlsZS1zeXN0ZW0tdXRpbGl0eSc7XG5cblxuLyoqXG4gKiBBIHNpbXBsZSBFbmdpbmVIb3N0IHRoYXQgdXNlcyBOb2RlTW9kdWxlcyB0byByZXNvbHZlIGNvbGxlY3Rpb25zLlxuICovXG5leHBvcnQgY2xhc3MgTm9kZU1vZHVsZXNFbmdpbmVIb3N0IGV4dGVuZHMgRmlsZVN5c3RlbUVuZ2luZUhvc3RCYXNlIHtcbiAgY29uc3RydWN0b3IoKSB7IHN1cGVyKCk7IH1cblxuICBwcm90ZWN0ZWQgX3Jlc29sdmVQYWNrYWdlSnNvbihuYW1lOiBzdHJpbmcsIGJhc2VkaXIgPSBwcm9jZXNzLmN3ZCgpKSB7XG4gICAgcmV0dXJuIGNvcmUucmVzb2x2ZShuYW1lLCB7XG4gICAgICBiYXNlZGlyLFxuICAgICAgY2hlY2tMb2NhbDogdHJ1ZSxcbiAgICAgIGNoZWNrR2xvYmFsOiB0cnVlLFxuICAgICAgcmVzb2x2ZVBhY2thZ2VKc29uOiB0cnVlLFxuICAgIH0pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9yZXNvbHZlUGF0aChuYW1lOiBzdHJpbmcsIGJhc2VkaXIgPSBwcm9jZXNzLmN3ZCgpKSB7XG4gICAgLy8gQWxsb3cgcmVsYXRpdmUgLyBhYnNvbHV0ZSBwYXRocy5cbiAgICBpZiAobmFtZS5zdGFydHNXaXRoKCcuJykgfHwgbmFtZS5zdGFydHNXaXRoKCcvJykpIHtcbiAgICAgIHJldHVybiByZXNvbHZlUGF0aChiYXNlZGlyLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvcmUucmVzb2x2ZShuYW1lLCB7XG4gICAgICAgIGJhc2VkaXIsXG4gICAgICAgIGNoZWNrTG9jYWw6IHRydWUsXG4gICAgICAgIGNoZWNrR2xvYmFsOiB0cnVlLFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9yZXNvbHZlQ29sbGVjdGlvblBhdGgobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBsZXQgcGFja2FnZUpzb25QYXRoID0gdGhpcy5fcmVzb2x2ZVBhY2thZ2VKc29uKG5hbWUsIHByb2Nlc3MuY3dkKCkpO1xuICAgIC8vIElmIGl0J3MgYSBmaWxlLCB1c2UgaXQgYXMgaXMuIE90aGVyd2lzZSBhcHBlbmQgcGFja2FnZS5qc29uIHRvIGl0LlxuICAgIGlmICghY29yZS5mcy5pc0ZpbGUocGFja2FnZUpzb25QYXRoKSkge1xuICAgICAgcGFja2FnZUpzb25QYXRoID0gam9pbihwYWNrYWdlSnNvblBhdGgsICdwYWNrYWdlLmpzb24nKTtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcGtnSnNvblNjaGVtYXRpY3MgPSByZXF1aXJlKHBhY2thZ2VKc29uUGF0aClbJ3NjaGVtYXRpY3MnXTtcbiAgICAgIGlmIChwa2dKc29uU2NoZW1hdGljcykge1xuICAgICAgICBjb25zdCByZXNvbHZlZFBhdGggPSB0aGlzLl9yZXNvbHZlUGF0aChwa2dKc29uU2NoZW1hdGljcywgZGlybmFtZShwYWNrYWdlSnNvblBhdGgpKTtcbiAgICAgICAgcmVhZEpzb25GaWxlKHJlc29sdmVkUGF0aCk7XG5cbiAgICAgICAgcmV0dXJuIHJlc29sdmVkUGF0aDtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuICAgIHRocm93IG5ldyBDb2xsZWN0aW9uQ2Fubm90QmVSZXNvbHZlZEV4Y2VwdGlvbihuYW1lKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfcmVzb2x2ZVJlZmVyZW5jZVN0cmluZyhyZWZTdHJpbmc6IHN0cmluZywgcGFyZW50UGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3QgcmVmID0gbmV3IEV4cG9ydFN0cmluZ1JlZjxSdWxlRmFjdG9yeTx7fT4+KHJlZlN0cmluZywgcGFyZW50UGF0aCk7XG4gICAgaWYgKCFyZWYucmVmKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4geyByZWY6IHJlZi5yZWYsIHBhdGg6IHJlZi5tb2R1bGUgfTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfdHJhbnNmb3JtQ29sbGVjdGlvbkRlc2NyaXB0aW9uKFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBkZXNjOiBQYXJ0aWFsPEZpbGVTeXN0ZW1Db2xsZWN0aW9uRGVzYz4sXG4gICk6IEZpbGVTeXN0ZW1Db2xsZWN0aW9uRGVzYyB7XG4gICAgaWYgKCFkZXNjLnNjaGVtYXRpY3MgfHwgdHlwZW9mIGRlc2Muc2NoZW1hdGljcyAhPSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IENvbGxlY3Rpb25NaXNzaW5nU2NoZW1hdGljc01hcEV4Y2VwdGlvbihuYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4uZGVzYyxcbiAgICAgIG5hbWUsXG4gICAgfSBhcyBGaWxlU3lzdGVtQ29sbGVjdGlvbkRlc2M7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3RyYW5zZm9ybVNjaGVtYXRpY0Rlc2NyaXB0aW9uKFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBfY29sbGVjdGlvbjogRmlsZVN5c3RlbUNvbGxlY3Rpb25EZXNjLFxuICAgIGRlc2M6IFBhcnRpYWw8RmlsZVN5c3RlbVNjaGVtYXRpY0Rlc2M+LFxuICApOiBGaWxlU3lzdGVtU2NoZW1hdGljRGVzYyB7XG4gICAgaWYgKCFkZXNjLmZhY3RvcnlGbiB8fCAhZGVzYy5wYXRoIHx8ICFkZXNjLmRlc2NyaXB0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgU2NoZW1hdGljTWlzc2luZ0ZpZWxkc0V4Y2VwdGlvbihuYW1lKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGVzYyBhcyBGaWxlU3lzdGVtU2NoZW1hdGljRGVzYztcbiAgfVxufVxuIl19