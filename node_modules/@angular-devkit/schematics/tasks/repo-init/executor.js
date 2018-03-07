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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhlY3V0b3IuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MvcmVwby1pbml0L2V4ZWN1dG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FBNEM7QUFDNUMsaURBQW9EO0FBQ3BELDZCQUE2QjtBQVE3QixtQkFDRSxpQkFBMEQsRUFBRTtJQUU1RCxNQUFNLGFBQWEsR0FBRyxjQUFjLENBQUMsYUFBYSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUVwRSxNQUFNLENBQUMsQ0FBTyxPQUF5QyxFQUFFLE9BQXlCLEVBQUUsRUFBRTtRQUNwRixNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3RDLE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7UUFFeEMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFjLEVBQUUsaUJBQTJCLEVBQUUsRUFBRTtZQUM5RCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUM7WUFDOUIsTUFBTSxXQUFXLEdBQUcsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztZQUNsRSxNQUFNLFlBQVksR0FBaUI7Z0JBQ2pDLEtBQUssRUFBRyxDQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsWUFBWSxFQUFFLFdBQVcsQ0FBRTtnQkFDcEQsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxnQkFBZ0IsSUFBSSxFQUFFLENBQUM7Z0JBQzdELEdBQUcsRUFBRTtvQkFDSCxlQUFlLEVBQUUsVUFBVTtvQkFDM0Isa0JBQWtCLEVBQUUsVUFBVTtvQkFDOUIsZ0JBQWdCLEVBQUUsV0FBVztvQkFDN0IsbUJBQW1CLEVBQUUsV0FBVztpQkFDakM7YUFDRixDQUFDO1lBRUYsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFPLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUMzQyxxQkFBSyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsWUFBWSxDQUFDO3FCQUM3QixFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBWSxFQUFFLEVBQUU7b0JBQzVCLEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNmLE9BQU8sRUFBRSxDQUFDO29CQUNaLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNmLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztRQUVGLE1BQU0sVUFBVSxHQUFHLE1BQU0sT0FBTyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7YUFDNUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDaEIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELE1BQU0sVUFBVSxHQUFHLE1BQU0sT0FBTyxDQUFDLENBQUMsV0FBVyxFQUFFLHVCQUF1QixDQUFDLEVBQUUsSUFBSSxDQUFDO2FBQzNFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNmLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQUksQ0FBQyxPQUFPLENBQUE7OztPQUcvQixDQUFDLENBQUM7WUFFSCxNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsOERBQThEO1FBQzlELDRDQUE0QztRQUM1QyxxRUFBcUU7UUFDckUsSUFBSSxDQUFDO1lBQ0gsTUFBTSxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLE1BQU0sT0FBTyxDQUFDLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFNUIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLElBQUksZ0JBQWdCLENBQUM7Z0JBRXBELE1BQU0sT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLE9BQU8sT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQy9DLENBQUM7WUFFRCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQ3ZELENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxJQUFELENBQUMsQ0FBQSxDQUFDO0lBQ1osQ0FBQyxDQUFBLENBQUM7QUFDSixDQUFDO0FBckVELDRCQXFFQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IHRhZ3MgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQgeyBTcGF3bk9wdGlvbnMsIHNwYXduIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgU2NoZW1hdGljQ29udGV4dCwgVGFza0V4ZWN1dG9yIH0gZnJvbSAnLi4vLi4vc3JjJztcbmltcG9ydCB7XG4gIFJlcG9zaXRvcnlJbml0aWFsaXplclRhc2tGYWN0b3J5T3B0aW9ucyxcbiAgUmVwb3NpdG9yeUluaXRpYWxpemVyVGFza09wdGlvbnMsXG59IGZyb20gJy4vb3B0aW9ucyc7XG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oXG4gIGZhY3RvcnlPcHRpb25zOiBSZXBvc2l0b3J5SW5pdGlhbGl6ZXJUYXNrRmFjdG9yeU9wdGlvbnMgPSB7fSxcbik6IFRhc2tFeGVjdXRvcjxSZXBvc2l0b3J5SW5pdGlhbGl6ZXJUYXNrT3B0aW9ucz4ge1xuICBjb25zdCByb290RGlyZWN0b3J5ID0gZmFjdG9yeU9wdGlvbnMucm9vdERpcmVjdG9yeSB8fCBwcm9jZXNzLmN3ZCgpO1xuXG4gIHJldHVybiBhc3luYyAob3B0aW9uczogUmVwb3NpdG9yeUluaXRpYWxpemVyVGFza09wdGlvbnMsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCBhdXRob3JOYW1lID0gb3B0aW9ucy5hdXRob3JOYW1lO1xuICAgIGNvbnN0IGF1dGhvckVtYWlsID0gb3B0aW9ucy5hdXRob3JFbWFpbDtcblxuICAgIGNvbnN0IGV4ZWN1dGUgPSAoYXJnczogc3RyaW5nW10sIGlnbm9yZUVycm9yU3RyZWFtPzogYm9vbGVhbikgPT4ge1xuICAgICAgY29uc3Qgb3V0cHV0U3RyZWFtID0gJ2lnbm9yZSc7XG4gICAgICBjb25zdCBlcnJvclN0cmVhbSA9IGlnbm9yZUVycm9yU3RyZWFtID8gJ2lnbm9yZScgOiBwcm9jZXNzLnN0ZGVycjtcbiAgICAgIGNvbnN0IHNwYXduT3B0aW9uczogU3Bhd25PcHRpb25zID0ge1xuICAgICAgICBzdGRpbzogIFsgcHJvY2Vzcy5zdGRpbiwgb3V0cHV0U3RyZWFtLCBlcnJvclN0cmVhbSBdLFxuICAgICAgICBzaGVsbDogdHJ1ZSxcbiAgICAgICAgY3dkOiBwYXRoLmpvaW4ocm9vdERpcmVjdG9yeSwgb3B0aW9ucy53b3JraW5nRGlyZWN0b3J5IHx8ICcnKSxcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgR0lUX0FVVEhPUl9OQU1FOiBhdXRob3JOYW1lLFxuICAgICAgICAgIEdJVF9DT01NSVRURVJfTkFNRTogYXV0aG9yTmFtZSxcbiAgICAgICAgICBHSVRfQVVUSE9SX0VNQUlMOiBhdXRob3JFbWFpbCxcbiAgICAgICAgICBHSVRfQ09NTUlUVEVSX0VNQUlMOiBhdXRob3JFbWFpbCxcbiAgICAgICAgfSxcbiAgICAgIH07XG5cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIHNwYXduKCdnaXQnLCBhcmdzLCBzcGF3bk9wdGlvbnMpXG4gICAgICAgICAgLm9uKCdjbG9zZScsIChjb2RlOiBudW1iZXIpID0+IHtcbiAgICAgICAgICAgIGlmIChjb2RlID09PSAwKSB7XG4gICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlamVjdChjb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgY29uc3QgaGFzQ29tbWFuZCA9IGF3YWl0IGV4ZWN1dGUoWyctLXZlcnNpb24nXSlcbiAgICAgIC50aGVuKCgpID0+IHRydWUsICgpID0+IGZhbHNlKTtcbiAgICBpZiAoIWhhc0NvbW1hbmQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBpbnNpZGVSZXBvID0gYXdhaXQgZXhlY3V0ZShbJ3Jldi1wYXJzZScsICctLWlzLWluc2lkZS13b3JrLXRyZWUnXSwgdHJ1ZSlcbiAgICAgIC50aGVuKCgpID0+IHRydWUsICgpID0+IGZhbHNlKTtcbiAgICBpZiAoaW5zaWRlUmVwbykge1xuICAgICAgY29udGV4dC5sb2dnZXIuaW5mbyh0YWdzLm9uZUxpbmVgXG4gICAgICAgIERpcmVjdG9yeSBpcyBhbHJlYWR5IHVuZGVyIHZlcnNpb24gY29udHJvbC5cbiAgICAgICAgU2tpcHBpbmcgaW5pdGlhbGl6YXRpb24gb2YgZ2l0LlxuICAgICAgYCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBpZiBnaXQgaXMgbm90IGZvdW5kIG9yIGFuIGVycm9yIHdhcyB0aHJvd24gZHVyaW5nIHRoZSBgZ2l0YFxuICAgIC8vIGluaXQgcHJvY2VzcyBqdXN0IHN3YWxsb3cgYW55IGVycm9ycyBoZXJlXG4gICAgLy8gTk9URTogVGhpcyB3aWxsIGJlIHJlbW92ZWQgb25jZSB0YXNrIGVycm9yIGhhbmRsaW5nIGlzIGltcGxlbWVudGVkXG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGV4ZWN1dGUoWydpbml0J10pO1xuICAgICAgYXdhaXQgZXhlY3V0ZShbJ2FkZCcsICcuJ10pO1xuXG4gICAgICBpZiAob3B0aW9ucy5jb21taXQpIHtcbiAgICAgICAgY29uc3QgbWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZSB8fCAnaW5pdGlhbCBjb21taXQnO1xuXG4gICAgICAgIGF3YWl0IGV4ZWN1dGUoWydjb21taXQnLCBgLW0gXCIke21lc3NhZ2V9XCJgXSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubG9nZ2VyLmluZm8oJ1N1Y2Nlc3NmdWxseSBpbml0aWFsaXplZCBnaXQuJyk7XG4gICAgfSBjYXRjaCB7fVxuICB9O1xufVxuIl19