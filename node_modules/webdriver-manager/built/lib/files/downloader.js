"use strict";
var fs = require('fs');
var os = require('os');
var path = require('path');
var q = require('q');
var request = require('request');
var url = require('url');
var cli_1 = require('../cli');
var logger = new cli_1.Logger('downloader');
/**
 * The file downloader.
 */
var Downloader = (function () {
    function Downloader() {
    }
    /**
     * Download the binary file.
     * @param binary The binary of interest.
     * @param outputDir The directory where files are downloaded and stored.
     * @param opt_proxy The proxy for downloading files.
     * @param opt_ignoreSSL To ignore SSL.
     * @param opt_callback Callback method to be executed after the file is downloaded.
     */
    Downloader.downloadBinary = function (binary, outputDir, opt_proxy, opt_ignoreSSL, opt_callback) {
        logger.info(binary.name + ': downloading version ' + binary.version());
        var url = binary.url(os.type(), os.arch());
        if (!url) {
            logger.error(binary.name + ' v' + binary.version() + ' is not available for your system.');
            return;
        }
        Downloader.httpGetFile_(url, binary.filename(os.type(), os.arch()), outputDir, opt_proxy, opt_ignoreSSL, function (filePath) {
            if (opt_callback) {
                opt_callback(binary, outputDir, filePath);
            }
        });
    };
    /**
     * Resolves proxy based on values set
     * @param fileUrl The url to download the file.
     * @param opt_proxy The proxy to connect to to download files.
     * @return Either undefined or the proxy.
     */
    Downloader.resolveProxy_ = function (fileUrl, opt_proxy) {
        var protocol = url.parse(fileUrl).protocol;
        var hostname = url.parse(fileUrl).hostname;
        if (opt_proxy) {
            return opt_proxy;
        }
        else {
            // If the NO_PROXY environment variable exists and matches the host name,
            // to ignore the resolve proxy.
            // the checks to see if it exists and equal to empty string is to help with testing
            var noProxy = process.env.NO_PROXY || process.env.no_proxy;
            if (noProxy) {
                // array of hostnames/domain names listed in the NO_PROXY environment variable
                var noProxyTokens = noProxy.split(',');
                // check if the fileUrl hostname part does not end with one of the
                // NO_PROXY environment variable's hostnames/domain names
                for (var _i = 0, noProxyTokens_1 = noProxyTokens; _i < noProxyTokens_1.length; _i++) {
                    var noProxyToken = noProxyTokens_1[_i];
                    if (hostname.indexOf(noProxyToken) !== -1) {
                        return undefined;
                    }
                }
            }
            // If the HTTPS_PROXY and HTTP_PROXY environment variable is set, use that as the proxy
            if (protocol === 'https:') {
                return process.env.HTTPS_PROXY || process.env.https_proxy || process.env.HTTP_PROXY ||
                    process.env.http_proxy;
            }
            else if (protocol === 'http:') {
                return process.env.HTTP_PROXY || process.env.http_proxy;
            }
        }
        return null;
    };
    Downloader.httpHeadContentLength = function (fileUrl, opt_proxy, opt_ignoreSSL) {
        var deferred = q.defer();
        if (opt_ignoreSSL) {
            logger.info('ignoring SSL certificate');
        }
        var options = {
            method: 'HEAD',
            url: fileUrl,
            strictSSL: !opt_ignoreSSL,
            rejectUnauthorized: !opt_ignoreSSL,
            proxy: Downloader.resolveProxy_(fileUrl, opt_proxy)
        };
        var contentLength = 0;
        request(options).on('response', function (response) {
            contentLength = response.headers['content-length'];
            deferred.resolve(contentLength);
        });
        return deferred.promise;
    };
    /**
     * Ceates the GET request for the file name.
     * @param fileUrl The url to download the file.
     * @param fileName The name of the file to download.
     * @param opt_proxy The proxy to connect to to download files.
     * @param opt_ignoreSSL To ignore SSL.
     */
    Downloader.httpGetFile_ = function (fileUrl, fileName, outputDir, opt_proxy, opt_ignoreSSL, callback) {
        logger.info('curl -o ' + outputDir + '/' + fileName + ' ' + fileUrl);
        var filePath = path.join(outputDir, fileName);
        var file = fs.createWriteStream(filePath);
        var contentLength = 0;
        var options = {
            url: fileUrl,
            // default Linux can be anywhere from 20-120 seconds
            // increasing this arbitrarily to 4 minutes
            timeout: 240000
        };
        if (opt_ignoreSSL) {
            logger.info('ignoring SSL certificate');
            options.strictSSL = !opt_ignoreSSL;
            options.rejectUnauthorized = !opt_ignoreSSL;
        }
        if (opt_proxy) {
            options.proxy = Downloader.resolveProxy_(fileUrl, opt_proxy);
            if (options.url.indexOf('https://') === 0) {
                options.url = options.url.replace('https://', 'http://');
            }
        }
        request(options)
            .on('response', function (response) {
            if (response.statusCode !== 200) {
                fs.unlinkSync(filePath);
                logger.error('Error: Got code ' + response.statusCode + ' from ' + fileUrl);
            }
            contentLength = response.headers['content-length'];
        })
            .on('error', function (error) {
            if (error.code === 'ETIMEDOUT') {
                logger.error('Connection timeout downloading: ' + fileUrl);
                logger.error('Default timeout is 4 minutes.');
            }
            else if (error.connect) {
                logger.error('Could not connect to the server to download: ' + fileUrl);
            }
            logger.error(error);
            fs.unlinkSync(filePath);
        })
            .pipe(file);
        file.on('close', function () {
            fs.stat(filePath, function (err, stats) {
                if (err) {
                    logger.error('Error: Got error ' + err + ' from ' + fileUrl);
                    return;
                }
                if (stats.size != contentLength) {
                    logger.error('Error: corrupt download for ' + fileName +
                        '. Please re-run webdriver-manager update');
                    fs.unlinkSync(filePath);
                    return;
                }
                if (callback) {
                    callback(filePath);
                }
            });
        });
    };
    return Downloader;
}());
exports.Downloader = Downloader;
//# sourceMappingURL=downloader.js.map