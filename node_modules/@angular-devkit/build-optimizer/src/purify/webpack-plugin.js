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
                        const inserts = purify_1.purifyReplacements(compilation.assets[fileName].source());
                        if (inserts.length > 0) {
                            const replaceSource = new webpack_sources_1.ReplaceSource(compilation.assets[fileName], fileName);
                            inserts.forEach((insert) => {
                                replaceSource.insert(insert.pos, insert.content);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay1wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2J1aWxkX29wdGltaXplci9zcmMvcHVyaWZ5L3dlYnBhY2stcGx1Z2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBU0EscURBQWdEO0FBQ2hELHFDQUE4QztBQU85QztJQUNFLGdCQUFnQixDQUFDO0lBQ1YsS0FBSyxDQUFDLFFBQTBCO1FBQ3JDLGtDQUFrQztRQUNsQyxRQUFRLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxDQUFDLFdBQWdCLEVBQUUsRUFBRTtZQUNsRCxXQUFXLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUMsTUFBZSxFQUFFLFFBQW9CLEVBQUUsRUFBRTtnQkFDcEYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQVksRUFBRSxFQUFFO29CQUM5QixLQUFLLENBQUMsS0FBSzt5QkFDUixNQUFNLENBQUMsQ0FBQyxRQUFnQixFQUFFLEVBQUUsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO3lCQUN0RCxPQUFPLENBQUMsQ0FBQyxRQUFnQixFQUFFLEVBQUU7d0JBQzVCLE1BQU0sT0FBTyxHQUFHLDJCQUFrQixDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzt3QkFFMUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN2QixNQUFNLGFBQWEsR0FBRyxJQUFJLCtCQUFhLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQzs0QkFDaEYsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dDQUN6QixhQUFhLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDOzRCQUNuRCxDQUFDLENBQUMsQ0FBQzs0QkFDSCxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLGFBQWEsQ0FBQzt3QkFDL0MsQ0FBQztvQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUMsQ0FBQztnQkFDSCxRQUFRLEVBQUUsQ0FBQztZQUNiLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUF6QkQsb0NBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWltcGxpY2l0LWRlcGVuZGVuY2llc1xuaW1wb3J0ICogYXMgd2VicGFjayBmcm9tICd3ZWJwYWNrJztcbmltcG9ydCB7IFJlcGxhY2VTb3VyY2UgfSBmcm9tICd3ZWJwYWNrLXNvdXJjZXMnO1xuaW1wb3J0IHsgcHVyaWZ5UmVwbGFjZW1lbnRzIH0gZnJvbSAnLi9wdXJpZnknO1xuXG5cbmludGVyZmFjZSBDaHVuayB7XG4gIGZpbGVzOiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFB1cmlmeVBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIHB1YmxpYyBhcHBseShjb21waWxlcjogd2VicGFjay5Db21waWxlcik6IHZvaWQge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBjb21waWxlci5wbHVnaW4oJ2NvbXBpbGF0aW9uJywgKGNvbXBpbGF0aW9uOiBhbnkpID0+IHtcbiAgICAgIGNvbXBpbGF0aW9uLnBsdWdpbignb3B0aW1pemUtY2h1bmstYXNzZXRzJywgKGNodW5rczogQ2h1bmtbXSwgY2FsbGJhY2s6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgY2h1bmtzLmZvckVhY2goKGNodW5rOiBDaHVuaykgPT4ge1xuICAgICAgICAgIGNodW5rLmZpbGVzXG4gICAgICAgICAgICAuZmlsdGVyKChmaWxlTmFtZTogc3RyaW5nKSA9PiBmaWxlTmFtZS5lbmRzV2l0aCgnLmpzJykpXG4gICAgICAgICAgICAuZm9yRWFjaCgoZmlsZU5hbWU6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBpbnNlcnRzID0gcHVyaWZ5UmVwbGFjZW1lbnRzKGNvbXBpbGF0aW9uLmFzc2V0c1tmaWxlTmFtZV0uc291cmNlKCkpO1xuXG4gICAgICAgICAgICAgIGlmIChpbnNlcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXBsYWNlU291cmNlID0gbmV3IFJlcGxhY2VTb3VyY2UoY29tcGlsYXRpb24uYXNzZXRzW2ZpbGVOYW1lXSwgZmlsZU5hbWUpO1xuICAgICAgICAgICAgICAgIGluc2VydHMuZm9yRWFjaCgoaW5zZXJ0KSA9PiB7XG4gICAgICAgICAgICAgICAgICByZXBsYWNlU291cmNlLmluc2VydChpbnNlcnQucG9zLCBpbnNlcnQuY29udGVudCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29tcGlsYXRpb24uYXNzZXRzW2ZpbGVOYW1lXSA9IHJlcGxhY2VTb3VyY2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG4iXX0=