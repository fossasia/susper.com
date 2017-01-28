"use strict";
var files_1 = require('../../lib/files');
describe('downloader', function () {
    var fileUrlHttp = 'http://foobar.com';
    var fileUrlHttps = 'https://foobar.com';
    var argProxy = 'http://foobar.arg';
    var envNoProxy = 'http://foobar.com';
    var envHttpProxy = 'http://foobar.env';
    var envHttpsProxy = 'https://foobar.env';
    it('should return undefined when proxy arg is not used', function () {
        var proxy = files_1.Downloader.resolveProxy_(fileUrlHttp);
        expect(proxy).toBeUndefined();
    });
    describe('proxy arg', function () {
        var opt_proxy = 'http://bar.foo';
        it('should return the proxy arg', function () {
            var proxy = files_1.Downloader.resolveProxy_(fileUrlHttp, opt_proxy);
            expect(proxy).toBe(opt_proxy);
        });
        it('should always return the proxy arg with env var set', function () {
            process.env.HTTP_PROXY = envHttpProxy;
            process.env.HTTPS_PROXY = envHttpsProxy;
            process.env.NO_PROXY = envNoProxy;
            var proxy = files_1.Downloader.resolveProxy_(fileUrlHttp, opt_proxy);
            expect(proxy).toBe(opt_proxy);
        });
    });
    describe('environment varialbes', function () {
        beforeEach(function () {
            delete process.env.HTTP_PROXY;
            delete process.env.http_proxy;
            delete process.env.HTTPS_PROXY;
            delete process.env.https_proxy;
            delete process.env.NO_PROXY;
            delete process.env.no_proxy;
        });
        it('should return the HTTP env variable', function () {
            process.env.HTTP_PROXY = envHttpProxy;
            var proxy = files_1.Downloader.resolveProxy_(fileUrlHttp);
            expect(proxy).toBe(envHttpProxy);
        });
        it('should return the http env variable', function () {
            process.env.http_proxy = envHttpProxy;
            var proxy = files_1.Downloader.resolveProxy_(fileUrlHttp);
            expect(proxy).toBe(envHttpProxy);
        });
        it('should return the HTTPS env variable for https protocol', function () {
            process.env.HTTPS_PROXY = envHttpsProxy;
            var proxy = files_1.Downloader.resolveProxy_(fileUrlHttps);
            expect(proxy).toBe(envHttpsProxy);
        });
        it('should return the https env variable for https protocol', function () {
            process.env.https_proxy = envHttpsProxy;
            var proxy = files_1.Downloader.resolveProxy_(fileUrlHttps);
            expect(proxy).toBe(envHttpsProxy);
        });
        it('should return the HTTP env variable for https protocol', function () {
            process.env.HTTP_PROXY = envHttpProxy;
            var proxy = files_1.Downloader.resolveProxy_(fileUrlHttps);
            expect(proxy).toBe(envHttpProxy);
        });
        it('should return the https env variable for https protocol', function () {
            process.env.http_proxy = envHttpProxy;
            var proxy = files_1.Downloader.resolveProxy_(fileUrlHttps);
            expect(proxy).toBe(envHttpProxy);
        });
        describe('NO_PROXY environment variable', function () {
            beforeEach(function () {
                delete process.env.NO_PROXY;
                delete process.env.no_proxy;
            });
            it('should return null when the NO_PROXY matches the fileUrl', function () {
                process.env.NO_PROXY = envNoProxy;
                var proxy = files_1.Downloader.resolveProxy_(fileUrlHttp);
                expect(proxy).toBeUndefined();
            });
            it('should return null when the no_proxy matches the fileUrl', function () {
                process.env.no_proxy = envNoProxy;
                var proxy = files_1.Downloader.resolveProxy_(fileUrlHttp);
                expect(proxy).toBeUndefined();
            });
        });
    });
});
//# sourceMappingURL=downloader_spec.js.map