"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
function default_1(factoryOptions = {}) {
    const rootDirectory = factoryOptions.rootDirectory || process.cwd();
    return (options, context) => __awaiter(this, void 0, void 0, function* () {
        const authorName = options.authorName;
        const authorEmail = options.authorEmail;
        const execute = (args, ignoreErrorStream) => {
            const outputStream = 'ignore';
            const errorStream = ignoreErrorStream ? 'ignore' : process.stderr;
            const spawnOptions = {
                stdio: [process.stdin, outputStream, errorStream],
                shell: true,
                cwd: path.join(rootDirectory, options.workingDirectory || ''),
                env: {
                    GIT_AUTHOR_NAME: authorName,
                    GIT_COMMITTER_NAME: authorName,
                    GIT_AUTHOR_EMAIL: authorEmail,
                    GIT_COMMITTER_EMAIL: authorEmail,
                },
            };
            return new Promise((resolve, reject) => {
                child_process_1.spawn('git', args, spawnOptions)
                    .on('close', (code) => {
                    if (code === 0) {
                        resolve();
                    }
                    else {
                        reject(code);
                    }
                });
            });
        };
        const hasCommand = yield execute(['--version'])
            .then(() => true, () => false);
        if (!hasCommand) {
            return;
        }
        const insideRepo = yield execute(['rev-parse', '--is-inside-work-tree'], true)
            .then(() => true, () => false);
        if (insideRepo) {
            context.logger.info(core_1.tags.oneLine `
        Directory is already under version control.
        Skipping initialization of git.
      `);
            return;
        }
        // if git is not found or an error was thrown during the `git`
        // init process just swallow any errors here
        // NOTE: This will be removed once task error handling is implemented
        try {
            yield execute(['init']);
            yield execute(['add', '.']);
            if (options.commit) {
                const message = options.message || 'initial commit';
                yield execute(['commit', `-m "${message}"`]);
            }
            context.logger.info('Successfully initialized git.');
        }
        catch (_a) { }
    });
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0b3IuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy90YXNrcy9yZXBvLWluaXQvZXhlY3V0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQUE0QztBQUU1QyxpREFBb0Q7QUFDcEQsNkJBQTZCO0FBTzdCLG1CQUNFLGlCQUEwRCxFQUFFO0lBRTVELE1BQU0sYUFBYSxHQUFHLGNBQWMsQ0FBQyxhQUFhLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBRXBFLE1BQU0sQ0FBQyxDQUFPLE9BQXlDLEVBQUUsT0FBeUIsRUFBRSxFQUFFO1FBQ3BGLE1BQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7UUFDdEMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQztRQUV4QyxNQUFNLE9BQU8sR0FBRyxDQUFDLElBQWMsRUFBRSxpQkFBMkIsRUFBRSxFQUFFO1lBQzlELE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQztZQUM5QixNQUFNLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO1lBQ2xFLE1BQU0sWUFBWSxHQUFpQjtnQkFDakMsS0FBSyxFQUFHLENBQUUsT0FBTyxDQUFDLEtBQUssRUFBRSxZQUFZLEVBQUUsV0FBVyxDQUFFO2dCQUNwRCxLQUFLLEVBQUUsSUFBSTtnQkFDWCxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDLGdCQUFnQixJQUFJLEVBQUUsQ0FBQztnQkFDN0QsR0FBRyxFQUFFO29CQUNILGVBQWUsRUFBRSxVQUFVO29CQUMzQixrQkFBa0IsRUFBRSxVQUFVO29CQUM5QixnQkFBZ0IsRUFBRSxXQUFXO29CQUM3QixtQkFBbUIsRUFBRSxXQUFXO2lCQUNqQzthQUNGLENBQUM7WUFFRixNQUFNLENBQUMsSUFBSSxPQUFPLENBQU8sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQzNDLHFCQUFLLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxZQUFZLENBQUM7cUJBQzdCLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBRTtvQkFDNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQ2YsT0FBTyxFQUFFLENBQUM7b0JBQ1osQ0FBQztvQkFBQyxJQUFJLENBQUMsQ0FBQzt3QkFDTixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ2YsQ0FBQztnQkFDTCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBRUYsTUFBTSxVQUFVLEdBQUcsTUFBTSxPQUFPLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUM1QyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNoQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsTUFBTSxVQUFVLEdBQUcsTUFBTSxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUUsdUJBQXVCLENBQUMsRUFBRSxJQUFJLENBQUM7YUFDM0UsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ2YsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBSSxDQUFDLE9BQU8sQ0FBQTs7O09BRy9CLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCw4REFBOEQ7UUFDOUQsNENBQTRDO1FBQzVDLHFFQUFxRTtRQUNyRSxJQUFJLENBQUM7WUFDSCxNQUFNLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDeEIsTUFBTSxPQUFPLENBQUMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUU1QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQztnQkFFcEQsTUFBTSxPQUFPLENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDL0MsQ0FBQztZQUVELE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUM7UUFDdkQsQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLElBQUQsQ0FBQyxDQUFBLENBQUM7SUFDWixDQUFDLENBQUEsQ0FBQztBQUNKLENBQUM7QUFyRUQsNEJBcUVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgdGFncyB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IFNjaGVtYXRpY0NvbnRleHQsIFRhc2tFeGVjdXRvciB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7IFNwYXduT3B0aW9ucywgc3Bhd24gfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge1xuICBSZXBvc2l0b3J5SW5pdGlhbGl6ZXJUYXNrRmFjdG9yeU9wdGlvbnMsXG4gIFJlcG9zaXRvcnlJbml0aWFsaXplclRhc2tPcHRpb25zLFxufSBmcm9tICcuL29wdGlvbnMnO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKFxuICBmYWN0b3J5T3B0aW9uczogUmVwb3NpdG9yeUluaXRpYWxpemVyVGFza0ZhY3RvcnlPcHRpb25zID0ge30sXG4pOiBUYXNrRXhlY3V0b3I8UmVwb3NpdG9yeUluaXRpYWxpemVyVGFza09wdGlvbnM+IHtcbiAgY29uc3Qgcm9vdERpcmVjdG9yeSA9IGZhY3RvcnlPcHRpb25zLnJvb3REaXJlY3RvcnkgfHwgcHJvY2Vzcy5jd2QoKTtcblxuICByZXR1cm4gYXN5bmMgKG9wdGlvbnM6IFJlcG9zaXRvcnlJbml0aWFsaXplclRhc2tPcHRpb25zLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3QgYXV0aG9yTmFtZSA9IG9wdGlvbnMuYXV0aG9yTmFtZTtcbiAgICBjb25zdCBhdXRob3JFbWFpbCA9IG9wdGlvbnMuYXV0aG9yRW1haWw7XG5cbiAgICBjb25zdCBleGVjdXRlID0gKGFyZ3M6IHN0cmluZ1tdLCBpZ25vcmVFcnJvclN0cmVhbT86IGJvb2xlYW4pID0+IHtcbiAgICAgIGNvbnN0IG91dHB1dFN0cmVhbSA9ICdpZ25vcmUnO1xuICAgICAgY29uc3QgZXJyb3JTdHJlYW0gPSBpZ25vcmVFcnJvclN0cmVhbSA/ICdpZ25vcmUnIDogcHJvY2Vzcy5zdGRlcnI7XG4gICAgICBjb25zdCBzcGF3bk9wdGlvbnM6IFNwYXduT3B0aW9ucyA9IHtcbiAgICAgICAgc3RkaW86ICBbIHByb2Nlc3Muc3RkaW4sIG91dHB1dFN0cmVhbSwgZXJyb3JTdHJlYW0gXSxcbiAgICAgICAgc2hlbGw6IHRydWUsXG4gICAgICAgIGN3ZDogcGF0aC5qb2luKHJvb3REaXJlY3RvcnksIG9wdGlvbnMud29ya2luZ0RpcmVjdG9yeSB8fCAnJyksXG4gICAgICAgIGVudjoge1xuICAgICAgICAgIEdJVF9BVVRIT1JfTkFNRTogYXV0aG9yTmFtZSxcbiAgICAgICAgICBHSVRfQ09NTUlUVEVSX05BTUU6IGF1dGhvck5hbWUsXG4gICAgICAgICAgR0lUX0FVVEhPUl9FTUFJTDogYXV0aG9yRW1haWwsXG4gICAgICAgICAgR0lUX0NPTU1JVFRFUl9FTUFJTDogYXV0aG9yRW1haWwsXG4gICAgICAgIH0sXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBzcGF3bignZ2l0JywgYXJncywgc3Bhd25PcHRpb25zKVxuICAgICAgICAgIC5vbignY2xvc2UnLCAoY29kZTogbnVtYmVyKSA9PiB7XG4gICAgICAgICAgICBpZiAoY29kZSA9PT0gMCkge1xuICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWplY3QoY29kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGhhc0NvbW1hbmQgPSBhd2FpdCBleGVjdXRlKFsnLS12ZXJzaW9uJ10pXG4gICAgICAudGhlbigoKSA9PiB0cnVlLCAoKSA9PiBmYWxzZSk7XG4gICAgaWYgKCFoYXNDb21tYW5kKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaW5zaWRlUmVwbyA9IGF3YWl0IGV4ZWN1dGUoWydyZXYtcGFyc2UnLCAnLS1pcy1pbnNpZGUtd29yay10cmVlJ10sIHRydWUpXG4gICAgICAudGhlbigoKSA9PiB0cnVlLCAoKSA9PiBmYWxzZSk7XG4gICAgaWYgKGluc2lkZVJlcG8pIHtcbiAgICAgIGNvbnRleHQubG9nZ2VyLmluZm8odGFncy5vbmVMaW5lYFxuICAgICAgICBEaXJlY3RvcnkgaXMgYWxyZWFkeSB1bmRlciB2ZXJzaW9uIGNvbnRyb2wuXG4gICAgICAgIFNraXBwaW5nIGluaXRpYWxpemF0aW9uIG9mIGdpdC5cbiAgICAgIGApO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gaWYgZ2l0IGlzIG5vdCBmb3VuZCBvciBhbiBlcnJvciB3YXMgdGhyb3duIGR1cmluZyB0aGUgYGdpdGBcbiAgICAvLyBpbml0IHByb2Nlc3MganVzdCBzd2FsbG93IGFueSBlcnJvcnMgaGVyZVxuICAgIC8vIE5PVEU6IFRoaXMgd2lsbCBiZSByZW1vdmVkIG9uY2UgdGFzayBlcnJvciBoYW5kbGluZyBpcyBpbXBsZW1lbnRlZFxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBleGVjdXRlKFsnaW5pdCddKTtcbiAgICAgIGF3YWl0IGV4ZWN1dGUoWydhZGQnLCAnLiddKTtcblxuICAgICAgaWYgKG9wdGlvbnMuY29tbWl0KSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgJ2luaXRpYWwgY29tbWl0JztcblxuICAgICAgICBhd2FpdCBleGVjdXRlKFsnY29tbWl0JywgYC1tIFwiJHttZXNzYWdlfVwiYF0pO1xuICAgICAgfVxuXG4gICAgICBjb250ZXh0LmxvZ2dlci5pbmZvKCdTdWNjZXNzZnVsbHkgaW5pdGlhbGl6ZWQgZ2l0LicpO1xuICAgIH0gY2F0Y2gge31cbiAgfTtcbn1cbiJdfQ==