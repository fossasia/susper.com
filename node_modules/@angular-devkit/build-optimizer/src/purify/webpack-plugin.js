"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const purify_1 = require("./purify");
class PurifyPlugin {
    constructor() { }
    apply(compiler) {
        // tslint:disable-next-line:no-any
        compiler.plugin('compilation', (compilation) => {
            compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
                chunks.forEach((chunk) => {
                    chunk.files
                        .filter((fileName) => fileName.endsWith('.bundle.js'))
                        .forEach((fileName) => {
                        const purifiedSource = purify_1.purify(compilation.assets[fileName].source());
                        compilation.assets[fileName]._cachedSource = purifiedSource;
                        compilation.assets[fileName]._source.source = () => purifiedSource;
                    });
                });
                callback();
            });
        });
    }
}
exports.PurifyPlugin = PurifyPlugin;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay1wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfb3B0aW1pemVyL3NyYy9wdXJpZnkvd2VicGFjay1wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSxxQ0FBa0M7QUFPbEM7SUFDRSxnQkFBZ0IsQ0FBQztJQUNWLEtBQUssQ0FBQyxRQUEwQjtRQUNyQyxrQ0FBa0M7UUFDbEMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsQ0FBQyxXQUFnQjtZQUM5QyxXQUFXLENBQUMsTUFBTSxDQUFDLHVCQUF1QixFQUFFLENBQUMsTUFBZSxFQUFFLFFBQW9CO2dCQUNoRixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBWTtvQkFDMUIsS0FBSyxDQUFDLEtBQUs7eUJBQ1IsTUFBTSxDQUFDLENBQUMsUUFBZ0IsS0FBSyxRQUFRLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO3lCQUM3RCxPQUFPLENBQUMsQ0FBQyxRQUFnQjt3QkFDeEIsTUFBTSxjQUFjLEdBQUcsZUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQzt3QkFDckUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxhQUFhLEdBQUcsY0FBYyxDQUFDO3dCQUM1RCxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsTUFBTSxjQUFjLENBQUM7b0JBQ3JFLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUMsQ0FBQyxDQUFDO2dCQUNILFFBQVEsRUFBRSxDQUFDO1lBQ2IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQW5CRCxvQ0FtQkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB3ZWJwYWNrIGZyb20gJ3dlYnBhY2snO1xuaW1wb3J0IHsgcHVyaWZ5IH0gZnJvbSAnLi9wdXJpZnknO1xuXG5cbmludGVyZmFjZSBDaHVuayB7XG4gIGZpbGVzOiBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IGNsYXNzIFB1cmlmeVBsdWdpbiB7XG4gIGNvbnN0cnVjdG9yKCkgeyB9XG4gIHB1YmxpYyBhcHBseShjb21waWxlcjogd2VicGFjay5Db21waWxlcik6IHZvaWQge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1hbnlcbiAgICBjb21waWxlci5wbHVnaW4oJ2NvbXBpbGF0aW9uJywgKGNvbXBpbGF0aW9uOiBhbnkpID0+IHtcbiAgICAgIGNvbXBpbGF0aW9uLnBsdWdpbignb3B0aW1pemUtY2h1bmstYXNzZXRzJywgKGNodW5rczogQ2h1bmtbXSwgY2FsbGJhY2s6ICgpID0+IHZvaWQpID0+IHtcbiAgICAgICAgY2h1bmtzLmZvckVhY2goKGNodW5rOiBDaHVuaykgPT4ge1xuICAgICAgICAgIGNodW5rLmZpbGVzXG4gICAgICAgICAgICAuZmlsdGVyKChmaWxlTmFtZTogc3RyaW5nKSA9PiBmaWxlTmFtZS5lbmRzV2l0aCgnLmJ1bmRsZS5qcycpKVxuICAgICAgICAgICAgLmZvckVhY2goKGZpbGVOYW1lOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgcHVyaWZpZWRTb3VyY2UgPSBwdXJpZnkoY29tcGlsYXRpb24uYXNzZXRzW2ZpbGVOYW1lXS5zb3VyY2UoKSk7XG4gICAgICAgICAgICAgIGNvbXBpbGF0aW9uLmFzc2V0c1tmaWxlTmFtZV0uX2NhY2hlZFNvdXJjZSA9IHB1cmlmaWVkU291cmNlO1xuICAgICAgICAgICAgICBjb21waWxhdGlvbi5hc3NldHNbZmlsZU5hbWVdLl9zb3VyY2Uuc291cmNlID0gKCkgPT4gcHVyaWZpZWRTb3VyY2U7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG4iXX0=