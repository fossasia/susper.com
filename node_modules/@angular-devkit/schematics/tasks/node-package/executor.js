"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const child_process_1 = require("child_process");
const path = require("path");
const Observable_1 = require("rxjs/Observable");
const packageManagers = {
    'npm': {
        quietArgument: '--quiet',
    },
    'cnpm': {},
    'yarn': {
        quietArgument: '--silent',
    },
};
class UnknownPackageManagerException extends core_1.BaseException {
    constructor(name) {
        super(`Unknown package manager "${name}".`);
    }
}
exports.UnknownPackageManagerException = UnknownPackageManagerException;
function default_1(factoryOptions = {}) {
    const packageManagerName = factoryOptions.packageManager || 'npm';
    const packageManagerProfile = packageManagers[packageManagerName];
    if (!packageManagerProfile) {
        throw new UnknownPackageManagerException(packageManagerName);
    }
    const rootDirectory = factoryOptions.rootDirectory || process.cwd();
    return (options) => {
        const outputStream = process.stdout;
        const errorStream = process.stderr;
        const spawnOptions = {
            stdio: [process.stdin, outputStream, errorStream],
            shell: true,
            cwd: path.join(rootDirectory, options.workingDirectory || ''),
        };
        const args = [options.command];
        if (options.packageName) {
            args.push(options.packageName);
        }
        if (options.quiet && packageManagerProfile.quietArgument) {
            args.push(packageManagerProfile.quietArgument);
        }
        return new Observable_1.Observable(obs => {
            child_process_1.spawn(packageManagerName, args, spawnOptions)
                .on('close', (code) => {
                if (code === 0) {
                    obs.next();
                    obs.complete();
                }
                else {
                    const message = 'Package install failed, see above.';
                    obs.error(new Error(message));
                }
            });
        });
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0b3IuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy90YXNrcy9ub2RlLXBhY2thZ2UvZXhlY3V0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FBcUQ7QUFFckQsaURBQW9EO0FBQ3BELDZCQUE2QjtBQUM3QixnREFBNkM7QUFPN0MsTUFBTSxlQUFlLEdBQThDO0lBQ2pFLEtBQUssRUFBRTtRQUNMLGFBQWEsRUFBRSxTQUFTO0tBQ3pCO0lBQ0QsTUFBTSxFQUFFLEVBQUc7SUFDWCxNQUFNLEVBQUU7UUFDTixhQUFhLEVBQUUsVUFBVTtLQUMxQjtDQUNGLENBQUM7QUFFRixvQ0FBNEMsU0FBUSxvQkFBYTtJQUMvRCxZQUFZLElBQVk7UUFDdEIsS0FBSyxDQUFDLDRCQUE0QixJQUFJLElBQUksQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDRjtBQUpELHdFQUlDO0FBRUQsbUJBQ0UsaUJBQWdELEVBQUU7SUFFbEQsTUFBTSxrQkFBa0IsR0FBRyxjQUFjLENBQUMsY0FBYyxJQUFJLEtBQUssQ0FBQztJQUNsRSxNQUFNLHFCQUFxQixHQUFHLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2xFLEVBQUUsQ0FBQyxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sSUFBSSw4QkFBOEIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsYUFBYSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUVwRSxNQUFNLENBQUMsQ0FBQyxPQUErQixFQUFFLEVBQUU7UUFDekMsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUNwQyxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ25DLE1BQU0sWUFBWSxHQUFpQjtZQUNqQyxLQUFLLEVBQUcsQ0FBRSxPQUFPLENBQUMsS0FBSyxFQUFFLFlBQVksRUFBRSxXQUFXLENBQUU7WUFDcEQsS0FBSyxFQUFFLElBQUk7WUFDWCxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixJQUFJLEVBQUUsQ0FBQztTQUM5RCxDQUFDO1FBQ0YsTUFBTSxJQUFJLEdBQUcsQ0FBRSxPQUFPLENBQUMsT0FBTyxDQUFFLENBQUM7UUFFakMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDakMsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUkscUJBQXFCLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2pELENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSx1QkFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLHFCQUFLLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQztpQkFDMUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLElBQVksRUFBRSxFQUFFO2dCQUM1QixFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDZixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ1gsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNqQixDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNOLE1BQU0sT0FBTyxHQUFHLG9DQUFvQyxDQUFDO29CQUNyRCxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQTNDRCw0QkEyQ0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBCYXNlRXhjZXB0aW9uIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgVGFza0V4ZWN1dG9yIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHsgU3Bhd25PcHRpb25zLCBzcGF3biB9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzL09ic2VydmFibGUnO1xuaW1wb3J0IHsgTm9kZVBhY2thZ2VUYXNrRmFjdG9yeU9wdGlvbnMsIE5vZGVQYWNrYWdlVGFza09wdGlvbnMgfSBmcm9tICcuL29wdGlvbnMnO1xuXG50eXBlIFBhY2thZ2VNYW5hZ2VyUHJvZmlsZSA9IHtcbiAgcXVpZXRBcmd1bWVudD86IHN0cmluZztcbn07XG5cbmNvbnN0IHBhY2thZ2VNYW5hZ2VyczogeyBbbmFtZTogc3RyaW5nXTogUGFja2FnZU1hbmFnZXJQcm9maWxlIH0gPSB7XG4gICducG0nOiB7XG4gICAgcXVpZXRBcmd1bWVudDogJy0tcXVpZXQnLFxuICB9LFxuICAnY25wbSc6IHsgfSxcbiAgJ3lhcm4nOiB7XG4gICAgcXVpZXRBcmd1bWVudDogJy0tc2lsZW50JyxcbiAgfSxcbn07XG5cbmV4cG9ydCBjbGFzcyBVbmtub3duUGFja2FnZU1hbmFnZXJFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XG4gICAgc3VwZXIoYFVua25vd24gcGFja2FnZSBtYW5hZ2VyIFwiJHtuYW1lfVwiLmApO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKFxuICBmYWN0b3J5T3B0aW9uczogTm9kZVBhY2thZ2VUYXNrRmFjdG9yeU9wdGlvbnMgPSB7fSxcbik6IFRhc2tFeGVjdXRvcjxOb2RlUGFja2FnZVRhc2tPcHRpb25zPiB7XG4gIGNvbnN0IHBhY2thZ2VNYW5hZ2VyTmFtZSA9IGZhY3RvcnlPcHRpb25zLnBhY2thZ2VNYW5hZ2VyIHx8ICducG0nO1xuICBjb25zdCBwYWNrYWdlTWFuYWdlclByb2ZpbGUgPSBwYWNrYWdlTWFuYWdlcnNbcGFja2FnZU1hbmFnZXJOYW1lXTtcbiAgaWYgKCFwYWNrYWdlTWFuYWdlclByb2ZpbGUpIHtcbiAgICB0aHJvdyBuZXcgVW5rbm93blBhY2thZ2VNYW5hZ2VyRXhjZXB0aW9uKHBhY2thZ2VNYW5hZ2VyTmFtZSk7XG4gIH1cblxuICBjb25zdCByb290RGlyZWN0b3J5ID0gZmFjdG9yeU9wdGlvbnMucm9vdERpcmVjdG9yeSB8fCBwcm9jZXNzLmN3ZCgpO1xuXG4gIHJldHVybiAob3B0aW9uczogTm9kZVBhY2thZ2VUYXNrT3B0aW9ucykgPT4ge1xuICAgIGNvbnN0IG91dHB1dFN0cmVhbSA9IHByb2Nlc3Muc3Rkb3V0O1xuICAgIGNvbnN0IGVycm9yU3RyZWFtID0gcHJvY2Vzcy5zdGRlcnI7XG4gICAgY29uc3Qgc3Bhd25PcHRpb25zOiBTcGF3bk9wdGlvbnMgPSB7XG4gICAgICBzdGRpbzogIFsgcHJvY2Vzcy5zdGRpbiwgb3V0cHV0U3RyZWFtLCBlcnJvclN0cmVhbSBdLFxuICAgICAgc2hlbGw6IHRydWUsXG4gICAgICBjd2Q6IHBhdGguam9pbihyb290RGlyZWN0b3J5LCBvcHRpb25zLndvcmtpbmdEaXJlY3RvcnkgfHwgJycpLFxuICAgIH07XG4gICAgY29uc3QgYXJncyA9IFsgb3B0aW9ucy5jb21tYW5kIF07XG5cbiAgICBpZiAob3B0aW9ucy5wYWNrYWdlTmFtZSkge1xuICAgICAgYXJncy5wdXNoKG9wdGlvbnMucGFja2FnZU5hbWUpO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLnF1aWV0ICYmIHBhY2thZ2VNYW5hZ2VyUHJvZmlsZS5xdWlldEFyZ3VtZW50KSB7XG4gICAgICBhcmdzLnB1c2gocGFja2FnZU1hbmFnZXJQcm9maWxlLnF1aWV0QXJndW1lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShvYnMgPT4ge1xuICAgICAgc3Bhd24ocGFja2FnZU1hbmFnZXJOYW1lLCBhcmdzLCBzcGF3bk9wdGlvbnMpXG4gICAgICAgIC5vbignY2xvc2UnLCAoY29kZTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgaWYgKGNvZGUgPT09IDApIHtcbiAgICAgICAgICAgIG9icy5uZXh0KCk7XG4gICAgICAgICAgICBvYnMuY29tcGxldGUoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbWVzc2FnZSA9ICdQYWNrYWdlIGluc3RhbGwgZmFpbGVkLCBzZWUgYWJvdmUuJztcbiAgICAgICAgICAgIG9icy5lcnJvcihuZXcgRXJyb3IobWVzc2FnZSkpO1xuICAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gIH07XG59XG4iXX0=