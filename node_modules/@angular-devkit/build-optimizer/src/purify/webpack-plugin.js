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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay1wbHVnaW4uanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvYnVpbGRfb3B0aW1pemVyL3NyYy9wdXJpZnkvd2VicGFjay1wbHVnaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSxxREFBZ0Q7QUFDaEQscUNBQThDO0FBTzlDO0lBQ0UsZ0JBQWdCLENBQUM7SUFDVixLQUFLLENBQUMsUUFBMEI7UUFDckMsa0NBQWtDO1FBQ2xDLFFBQVEsQ0FBQyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsV0FBZ0IsRUFBRSxFQUFFO1lBQ2xELFdBQVcsQ0FBQyxNQUFNLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxNQUFlLEVBQUUsUUFBb0IsRUFBRSxFQUFFO2dCQUNwRixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBWSxFQUFFLEVBQUU7b0JBQzlCLEtBQUssQ0FBQyxLQUFLO3lCQUNSLE1BQU0sQ0FBQyxDQUFDLFFBQWdCLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7eUJBQ3RELE9BQU8sQ0FBQyxDQUFDLFFBQWdCLEVBQUUsRUFBRTt3QkFDNUIsTUFBTSxPQUFPLEdBQUcsMkJBQWtCLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO3dCQUUxRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZCLE1BQU0sYUFBYSxHQUFHLElBQUksK0JBQWEsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDOzRCQUNoRixPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUU7Z0NBQ3pCLGFBQWEsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7NEJBQ25ELENBQUMsQ0FBQyxDQUFDOzRCQUNILFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsYUFBYSxDQUFDO3dCQUMvQyxDQUFDO29CQUNILENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUMsQ0FBQyxDQUFDO2dCQUNILFFBQVEsRUFBRSxDQUFDO1lBQ2IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQXpCRCxvQ0F5QkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgKiBhcyB3ZWJwYWNrIGZyb20gJ3dlYnBhY2snO1xuaW1wb3J0IHsgUmVwbGFjZVNvdXJjZSB9IGZyb20gJ3dlYnBhY2stc291cmNlcyc7XG5pbXBvcnQgeyBwdXJpZnlSZXBsYWNlbWVudHMgfSBmcm9tICcuL3B1cmlmeSc7XG5cblxuaW50ZXJmYWNlIENodW5rIHtcbiAgZmlsZXM6IHN0cmluZ1tdO1xufVxuXG5leHBvcnQgY2xhc3MgUHVyaWZ5UGx1Z2luIHtcbiAgY29uc3RydWN0b3IoKSB7IH1cbiAgcHVibGljIGFwcGx5KGNvbXBpbGVyOiB3ZWJwYWNrLkNvbXBpbGVyKTogdm9pZCB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIGNvbXBpbGVyLnBsdWdpbignY29tcGlsYXRpb24nLCAoY29tcGlsYXRpb246IGFueSkgPT4ge1xuICAgICAgY29tcGlsYXRpb24ucGx1Z2luKCdvcHRpbWl6ZS1jaHVuay1hc3NldHMnLCAoY2h1bmtzOiBDaHVua1tdLCBjYWxsYmFjazogKCkgPT4gdm9pZCkgPT4ge1xuICAgICAgICBjaHVua3MuZm9yRWFjaCgoY2h1bms6IENodW5rKSA9PiB7XG4gICAgICAgICAgY2h1bmsuZmlsZXNcbiAgICAgICAgICAgIC5maWx0ZXIoKGZpbGVOYW1lOiBzdHJpbmcpID0+IGZpbGVOYW1lLmVuZHNXaXRoKCcuanMnKSlcbiAgICAgICAgICAgIC5mb3JFYWNoKChmaWxlTmFtZTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IGluc2VydHMgPSBwdXJpZnlSZXBsYWNlbWVudHMoY29tcGlsYXRpb24uYXNzZXRzW2ZpbGVOYW1lXS5zb3VyY2UoKSk7XG5cbiAgICAgICAgICAgICAgaWYgKGluc2VydHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHJlcGxhY2VTb3VyY2UgPSBuZXcgUmVwbGFjZVNvdXJjZShjb21waWxhdGlvbi5hc3NldHNbZmlsZU5hbWVdLCBmaWxlTmFtZSk7XG4gICAgICAgICAgICAgICAgaW5zZXJ0cy5mb3JFYWNoKChpbnNlcnQpID0+IHtcbiAgICAgICAgICAgICAgICAgIHJlcGxhY2VTb3VyY2UuaW5zZXJ0KGluc2VydC5wb3MsIGluc2VydC5jb250ZW50KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb21waWxhdGlvbi5hc3NldHNbZmlsZU5hbWVdID0gcmVwbGFjZVNvdXJjZTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==