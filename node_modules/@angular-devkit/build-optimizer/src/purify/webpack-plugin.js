"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_sources_1 = require("webpack-sources");
const purify_1 = require("./purify");
class PurifyPlugin {
    constructor() { }
    apply(compiler) {
        // tslint:disable-next-line:no-any
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
                chunks.forEach((chunk) => {
                    chunk.files
                        .filter((fileName) => fileName.endsWith('.js'))
                        .forEach((fileName) => {
                        const replacements = purify_1.purifyReplacements(compilation.assets[fileName].source());
                        if (replacements.length > 0) {
                            const replaceSource = new webpack_sources_1.ReplaceSource(compilation.assets[fileName], fileName);
                            replacements.forEach((replacement) => {
                                replaceSource.replace(replacement.start, replacement.end, replacement.content);
                            });
                            compilation.assets[fileName] = replaceSource;
                        }
                    });
                });
                callback();
            });
        });
    }
}
exports.PurifyPlugin = PurifyPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay1wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfb3B0aW1pemVyL3NyYy9wdXJpZnkvd2VicGFjay1wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSxxREFBZ0Q7QUFDaEQscUNBQThDO0FBTzlDO0lBQ0UsZ0JBQWdCLENBQUM7SUFDVixLQUFLLENBQUMsUUFBMEI7UUFDckMsa0NBQWtDO1FBQ2xDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsV0FBZ0I7WUFDOUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLE1BQWUsRUFBRSxRQUFvQjtnQkFDaEYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQVk7b0JBQzFCLEtBQUssQ0FBQyxLQUFLO3lCQUNSLE1BQU0sQ0FBQyxDQUFDLFFBQWdCLEtBQUssUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzt5QkFDdEQsT0FBTyxDQUFDLENBQUMsUUFBZ0I7d0JBQ3hCLE1BQU0sWUFBWSxHQUFHLDJCQUFrQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzt3QkFFL0UsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUM1QixNQUFNLGFBQWEsR0FBRyxJQUFJLCtCQUFhLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzs0QkFDaEYsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFdBQVc7Z0NBQy9CLGFBQWEsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs0QkFDakYsQ0FBQyxDQUFDLENBQUM7NEJBQ0gsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxhQUFhLENBQUM7d0JBQy9DLENBQUM7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsUUFBUSxFQUFFLENBQUM7WUFDYixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBekJELG9DQXlCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAqIGFzIHdlYnBhY2sgZnJvbSAnd2VicGFjayc7XG5pbXBvcnQgeyBSZXBsYWNlU291cmNlIH0gZnJvbSAnd2VicGFjay1zb3VyY2VzJztcbmltcG9ydCB7IHB1cmlmeVJlcGxhY2VtZW50cyB9IGZyb20gJy4vcHVyaWZ5JztcblxuXG5pbnRlcmZhY2UgQ2h1bmsge1xuICBmaWxlczogc3RyaW5nW107XG59XG5cbmV4cG9ydCBjbGFzcyBQdXJpZnlQbHVnaW4ge1xuICBjb25zdHJ1Y3RvcigpIHsgfVxuICBwdWJsaWMgYXBwbHkoY29tcGlsZXI6IHdlYnBhY2suQ29tcGlsZXIpOiB2b2lkIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tYW55XG4gICAgY29tcGlsZXIucGx1Z2luKCdjb21waWxhdGlvbicsIChjb21waWxhdGlvbjogYW55KSA9PiB7XG4gICAgICBjb21waWxhdGlvbi5wbHVnaW4oJ29wdGltaXplLWNodW5rLWFzc2V0cycsIChjaHVua3M6IENodW5rW10sIGNhbGxiYWNrOiAoKSA9PiB2b2lkKSA9PiB7XG4gICAgICAgIGNodW5rcy5mb3JFYWNoKChjaHVuazogQ2h1bmspID0+IHtcbiAgICAgICAgICBjaHVuay5maWxlc1xuICAgICAgICAgICAgLmZpbHRlcigoZmlsZU5hbWU6IHN0cmluZykgPT4gZmlsZU5hbWUuZW5kc1dpdGgoJy5qcycpKVxuICAgICAgICAgICAgLmZvckVhY2goKGZpbGVOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgcmVwbGFjZW1lbnRzID0gcHVyaWZ5UmVwbGFjZW1lbnRzKGNvbXBpbGF0aW9uLmFzc2V0c1tmaWxlTmFtZV0uc291cmNlKCkpO1xuXG4gICAgICAgICAgICAgIGlmIChyZXBsYWNlbWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcGxhY2VTb3VyY2UgPSBuZXcgUmVwbGFjZVNvdXJjZShjb21waWxhdGlvbi5hc3NldHNbZmlsZU5hbWVdLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgcmVwbGFjZW1lbnRzLmZvckVhY2goKHJlcGxhY2VtZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICByZXBsYWNlU291cmNlLnJlcGxhY2UocmVwbGFjZW1lbnQuc3RhcnQsIHJlcGxhY2VtZW50LmVuZCwgcmVwbGFjZW1lbnQuY29udGVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29tcGlsYXRpb24uYXNzZXRzW2ZpbGVOYW1lXSA9IHJlcGxhY2VTb3VyY2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=