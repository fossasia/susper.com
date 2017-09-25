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
                        const replaceSource = new webpack_sources_1.ReplaceSource(compilation.assets[fileName], fileName);
                        replacements.forEach((replacement) => {
                            replaceSource.replace(replacement.start, replacement.end, replacement.content);
                        });
                        compilation.assets[fileName] = replaceSource;
                    });
                });
                callback();
            });
        });
    }
}
exports.PurifyPlugin = PurifyPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay1wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfb3B0aW1pemVyL3NyYy9wdXJpZnkvd2VicGFjay1wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSxxREFBZ0Q7QUFDaEQscUNBQThDO0FBTzlDO0lBQ0UsZ0JBQWdCLENBQUM7SUFDVixLQUFLLENBQUMsUUFBMEI7UUFDckMsa0NBQWtDO1FBQ2xDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsV0FBZ0I7WUFDOUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDLE1BQWUsRUFBRSxRQUFvQjtnQkFDaEYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQVk7b0JBQzFCLEtBQUssQ0FBQyxLQUFLO3lCQUNSLE1BQU0sQ0FBQyxDQUFDLFFBQWdCLEtBQUssUUFBUSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzt5QkFDdEQsT0FBTyxDQUFDLENBQUMsUUFBZ0I7d0JBQ3hCLE1BQU0sWUFBWSxHQUFHLDJCQUFrQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzt3QkFDL0UsTUFBTSxhQUFhLEdBQUcsSUFBSSwrQkFBYSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7d0JBQ2hGLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXOzRCQUMvQixhQUFhLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7d0JBQ2pGLENBQUMsQ0FBQyxDQUFDO3dCQUNILFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsYUFBYSxDQUFDO29CQUMvQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUMsQ0FBQztnQkFDSCxRQUFRLEVBQUUsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF0QkQsb0NBc0JDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgd2VicGFjayBmcm9tICd3ZWJwYWNrJztcbmltcG9ydCB7IFJlcGxhY2VTb3VyY2UgfSBmcm9tICd3ZWJwYWNrLXNvdXJjZXMnO1xuaW1wb3J0IHsgcHVyaWZ5UmVwbGFjZW1lbnRzIH0gZnJvbSAnLi9wdXJpZnknO1xuXG5cbmludGVyZmFjZSBDaHVuayB7XG4gIGZpbGVzOiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFB1cmlmeVBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIHB1YmxpYyBhcHBseShjb21waWxlcjogd2VicGFjay5Db21waWxlcik6IHZvaWQge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBjb21waWxlci5wbHVnaW4oJ2NvbXBpbGF0aW9uJywgKGNvbXBpbGF0aW9uOiBhbnkpID0+IHtcbiAgICAgIGNvbXBpbGF0aW9uLnBsdWdpbignb3B0aW1pemUtY2h1bmstYXNzZXRzJywgKGNodW5rczogQ2h1bmtbXSwgY2FsbGJhY2s6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgY2h1bmtzLmZvckVhY2goKGNodW5rOiBDaHVuaykgPT4ge1xuICAgICAgICAgIGNodW5rLmZpbGVzXG4gICAgICAgICAgICAuZmlsdGVyKChmaWxlTmFtZTogc3RyaW5nKSA9PiBmaWxlTmFtZS5lbmRzV2l0aCgnLmpzJykpXG4gICAgICAgICAgICAuZm9yRWFjaCgoZmlsZU5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICBjb25zdCByZXBsYWNlbWVudHMgPSBwdXJpZnlSZXBsYWNlbWVudHMoY29tcGlsYXRpb24uYXNzZXRzW2ZpbGVOYW1lXS5zb3VyY2UoKSk7XG4gICAgICAgICAgICAgIGNvbnN0IHJlcGxhY2VTb3VyY2UgPSBuZXcgUmVwbGFjZVNvdXJjZShjb21waWxhdGlvbi5hc3NldHNbZmlsZU5hbWVdLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgIHJlcGxhY2VtZW50cy5mb3JFYWNoKChyZXBsYWNlbWVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlcGxhY2VTb3VyY2UucmVwbGFjZShyZXBsYWNlbWVudC5zdGFydCwgcmVwbGFjZW1lbnQuZW5kLCByZXBsYWNlbWVudC5jb250ZW50KTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIGNvbXBpbGF0aW9uLmFzc2V0c1tmaWxlTmFtZV0gPSByZXBsYWNlU291cmNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==