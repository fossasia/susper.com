"use strict";
var binaries_1 = require('../../lib/binaries');
var files_1 = require('../../lib/files');
var config_1 = require('../../lib/config');
var gecko_driver_1 = require('../../lib/binaries/gecko_driver');
describe('file manager', function () {
    describe('setting up for windows', function () {
        var osType = 'Windows_NT';
        it('should find correct binaries', function () {
            expect(files_1.FileManager.checkOS_(osType, binaries_1.ChromeDriver)).toBe(true);
            expect(files_1.FileManager.checkOS_(osType, binaries_1.IEDriver)).toBe(true);
            expect(files_1.FileManager.checkOS_(osType, binaries_1.StandAlone)).toBe(true);
            expect(files_1.FileManager.checkOS_(osType, binaries_1.AndroidSDK)).toBe(true);
            expect(files_1.FileManager.checkOS_(osType, binaries_1.Appium)).toBe(true);
        });
        it('should return the binary array', function () {
            var binaries = files_1.FileManager.compileBinaries_(osType);
            expect(binaries[binaries_1.StandAlone.id].name).toBe((new binaries_1.StandAlone()).name);
            expect(binaries[binaries_1.ChromeDriver.id].name).toBe((new binaries_1.ChromeDriver()).name);
            expect(binaries[binaries_1.IEDriver.id].name).toBe((new binaries_1.IEDriver()).name);
            expect(binaries[binaries_1.AndroidSDK.id].name).toBe((new binaries_1.AndroidSDK()).name);
            expect(binaries[binaries_1.Appium.id].name).toBe((new binaries_1.Appium()).name);
        });
    });
    describe('setting up for linux', function () {
        var osType = 'Linux';
        it('should find correct binaries', function () {
            expect(files_1.FileManager.checkOS_(osType, binaries_1.ChromeDriver)).toBe(true);
            expect(files_1.FileManager.checkOS_(osType, binaries_1.IEDriver)).toBe(false);
            expect(files_1.FileManager.checkOS_(osType, binaries_1.StandAlone)).toBe(true);
            expect(files_1.FileManager.checkOS_(osType, binaries_1.AndroidSDK)).toBe(true);
            expect(files_1.FileManager.checkOS_(osType, binaries_1.Appium)).toBe(true);
        });
        it('should return the binary array', function () {
            var binaries = files_1.FileManager.compileBinaries_(osType);
            expect(binaries[binaries_1.StandAlone.id].name).toBe((new binaries_1.StandAlone()).name);
            expect(binaries[binaries_1.ChromeDriver.id].name).toBe((new binaries_1.ChromeDriver()).name);
            expect(binaries[binaries_1.AndroidSDK.id].name).toBe((new binaries_1.AndroidSDK()).name);
            expect(binaries[binaries_1.Appium.id].name).toBe((new binaries_1.Appium()).name);
            expect(binaries[binaries_1.IEDriver.id]).toBeUndefined();
        });
    });
    describe('setting up for mac', function () {
        var osType = 'Darwin';
        it('should find correct binaries', function () {
            expect(files_1.FileManager.checkOS_(osType, binaries_1.ChromeDriver)).toBe(true);
            expect(files_1.FileManager.checkOS_(osType, binaries_1.IEDriver)).toBe(false);
            expect(files_1.FileManager.checkOS_(osType, binaries_1.StandAlone)).toBe(true);
            expect(files_1.FileManager.checkOS_(osType, binaries_1.AndroidSDK)).toBe(true);
            expect(files_1.FileManager.checkOS_(osType, binaries_1.Appium)).toBe(true);
        });
        it('should return the binary array', function () {
            var binaries = files_1.FileManager.compileBinaries_(osType);
            expect(binaries[binaries_1.StandAlone.id].name).toBe((new binaries_1.StandAlone()).name);
            expect(binaries[binaries_1.ChromeDriver.id].name).toBe((new binaries_1.ChromeDriver()).name);
            expect(binaries[binaries_1.IEDriver.id]).toBeUndefined();
            expect(binaries[binaries_1.AndroidSDK.id].name).toBe((new binaries_1.AndroidSDK()).name);
            expect(binaries[binaries_1.Appium.id].name).toBe((new binaries_1.Appium()).name);
        });
    });
    describe('downloaded version checks', function () {
        var existingFiles;
        var selenium = new binaries_1.StandAlone();
        var chrome = new binaries_1.ChromeDriver();
        var android = new binaries_1.AndroidSDK();
        var appium = new binaries_1.Appium();
        var ie = new binaries_1.IEDriver();
        var ostype;
        var arch;
        function setup(osType) {
            ostype = osType;
            arch = 'x64';
            existingFiles = [
                selenium.prefix() + '2.51.0' + selenium.executableSuffix(),
                selenium.prefix() + '2.52.0' + selenium.executableSuffix()];
            existingFiles.push(chrome.prefix() + '2.20' + chrome.suffix(ostype, arch));
            existingFiles.push(chrome.prefix() + '2.20' + chrome.executableSuffix(ostype));
            existingFiles.push(chrome.prefix() + '2.21' + chrome.suffix(ostype, arch));
            existingFiles.push(chrome.prefix() + '2.21' + chrome.executableSuffix(ostype));
            existingFiles.push(android.prefix() + '24.1.0' + android.suffix(ostype));
            existingFiles.push(android.prefix() + '24.1.0' + android.executableSuffix());
            existingFiles.push(android.prefix() + '24.1.1' + android.suffix(ostype));
            existingFiles.push(android.prefix() + '24.1.1' + android.executableSuffix());
            existingFiles.push(appium.prefix() + '1.5.3' + appium.suffix(ostype));
            if (ostype == 'Windows_NT') {
                existingFiles.push(ie.prefix() + '_Win32_2.51.0' + ie.suffix());
                existingFiles.push(ie.prefix() + '_Win32_2.51.0' + ie.executableSuffix(ostype));
                existingFiles.push(ie.prefix() + '_x64_2.51.0' + ie.suffix());
                existingFiles.push(ie.prefix() + '_x64_2.51.0' + ie.executableSuffix(ostype));
                existingFiles.push(ie.prefix() + '_Win32_2.52.0' + ie.suffix());
                existingFiles.push(ie.prefix() + '_Win32_2.52.0' + ie.executableSuffix(ostype));
                existingFiles.push(ie.prefix() + '_x64_2.52.0' + ie.suffix());
                existingFiles.push(ie.prefix() + '_x64_2.52.0' + ie.executableSuffix(ostype));
            }
        }
        describe('versions for selenium', function () {
            it('should find the correct version for windows', function () {
                setup('Windows_NT');
                var downloaded = files_1.FileManager.downloadedVersions_(selenium, ostype, arch, existingFiles);
                expect(downloaded.versions.length).toBe(2);
                expect(downloaded.versions[0]).toBe('2.51.0');
                expect(downloaded.versions[1]).toBe('2.52.0');
            });
            it('should find the correct version for mac', function () {
                setup('Darwin');
                var downloaded = files_1.FileManager.downloadedVersions_(selenium, ostype, arch, existingFiles);
                expect(downloaded.versions.length).toBe(2);
                expect(downloaded.versions[0]).toBe('2.51.0');
                expect(downloaded.versions[1]).toBe('2.52.0');
            });
            it('should find the correct version for mac', function () {
                setup('Linux');
                var downloaded = files_1.FileManager.downloadedVersions_(selenium, ostype, arch, existingFiles);
                expect(downloaded.versions.length).toBe(2);
                expect(downloaded.versions[0]).toBe('2.51.0');
                expect(downloaded.versions[1]).toBe('2.52.0');
            });
        });
        describe('versions for chrome', function () {
            it('should find the correct version for windows', function () {
                setup('Windows_NT');
                var downloaded = files_1.FileManager.downloadedVersions_(chrome, ostype, arch, existingFiles);
                expect(downloaded.versions.length).toBe(2);
                expect(downloaded.versions[0]).toBe('2.20');
                expect(downloaded.versions[1]).toBe('2.21');
            });
            it('should find the correct version for mac', function () {
                setup('Darwin');
                var downloaded = files_1.FileManager.downloadedVersions_(chrome, ostype, arch, existingFiles);
                expect(downloaded.versions.length).toBe(2);
                expect(downloaded.versions[0]).toBe('2.20');
                expect(downloaded.versions[1]).toBe('2.21');
            });
            it('should find the correct version for linux', function () {
                setup('Linux');
                var downloaded = files_1.FileManager.downloadedVersions_(chrome, ostype, arch, existingFiles);
                expect(downloaded.versions.length).toBe(2);
                expect(downloaded.versions[0]).toBe('2.20');
                expect(downloaded.versions[1]).toBe('2.21');
            });
        });
        describe('versions for android', function () {
            it('should find the correct version for windows', function () {
                setup('Windows_NT');
                var downloaded = files_1.FileManager.downloadedVersions_(android, ostype, arch, existingFiles);
                expect(downloaded.versions.length).toBe(2);
                expect(downloaded.versions[0]).toBe('24.1.0');
                expect(downloaded.versions[1]).toBe('24.1.1');
            });
            it('should find the correct version for mac', function () {
                setup('Darwin');
                var downloaded = files_1.FileManager.downloadedVersions_(android, ostype, arch, existingFiles);
                expect(downloaded.versions.length).toBe(2);
                expect(downloaded.versions[0]).toBe('24.1.0');
                expect(downloaded.versions[1]).toBe('24.1.1');
            });
            it('should find the correct version for linux', function () {
                setup('Linux');
                var downloaded = files_1.FileManager.downloadedVersions_(android, ostype, arch, existingFiles);
                expect(downloaded.versions.length).toBe(2);
                expect(downloaded.versions[0]).toBe('24.1.0');
                expect(downloaded.versions[1]).toBe('24.1.1');
            });
        });
        describe('versions for appium', function () {
            it('should find the correct version for windows', function () {
                setup('Windows_NT');
                var downloaded = files_1.FileManager.downloadedVersions_(appium, ostype, arch, existingFiles);
                expect(downloaded.versions.length).toBe(1);
                expect(downloaded.versions[0]).toBe('1.5.3');
            });
            it('should find the correct version for mac', function () {
                setup('Darwin');
                var downloaded = files_1.FileManager.downloadedVersions_(appium, ostype, arch, existingFiles);
                expect(downloaded.versions.length).toBe(1);
                expect(downloaded.versions[0]).toBe('1.5.3');
            });
            it('should find the correct version for linux', function () {
                setup('Linux');
                var downloaded = files_1.FileManager.downloadedVersions_(appium, ostype, arch, existingFiles);
                expect(downloaded.versions.length).toBe(1);
                expect(downloaded.versions[0]).toBe('1.5.3');
            });
        });
        describe('versions for ie on windows', function () {
            it('should find the correct version for windows', function () {
                setup('Windows_NT');
                var downloaded = files_1.FileManager.downloadedVersions_(ie, ostype, arch, existingFiles);
                expect(downloaded.versions.length).toBe(4);
                expect(downloaded.versions[0]).toBe('Win32_2.51.0');
                expect(downloaded.versions[1]).toBe('x64_2.51.0');
                expect(downloaded.versions[2]).toBe('Win32_2.52.0');
                expect(downloaded.versions[3]).toBe('x64_2.52.0');
            });
        });
    });
    describe('configuring the CDN location', function () {
        describe('when no custom CDN is specified', function () {
            var defaults = config_1.Config.cdnUrls();
            var binaries = files_1.FileManager.compileBinaries_('Windows_NT');
            it('should use the default configuration for Android SDK', function () {
                expect(binaries[binaries_1.AndroidSDK.id].cdn).toEqual(defaults[binaries_1.AndroidSDK.id]);
            });
            it('should use the default configuration for Appium', function () {
                expect(binaries[binaries_1.Appium.id].cdn).toEqual(defaults[binaries_1.Appium.id]);
            });
            it('should use the default configuration for Chrome Driver', function () {
                expect(binaries[binaries_1.ChromeDriver.id].cdn).toEqual(defaults[binaries_1.ChromeDriver.id]);
            });
            it('should use the default configuration for Gecko Driver', function () {
                expect(binaries[gecko_driver_1.GeckoDriver.id].cdn).toEqual(defaults[gecko_driver_1.GeckoDriver.id]);
            });
            it('should use the default configuration for IE Driver', function () {
                expect(binaries[binaries_1.IEDriver.id].cdn).toEqual(defaults[binaries_1.IEDriver.id]);
            });
            it('should use the default configuration for Selenium Standalone', function () {
                expect(binaries[binaries_1.StandAlone.id].cdn).toEqual(defaults['selenium']);
            });
        });
        describe('when custom CDN is specified', function () {
            it('should configure the CDN for each binary', function () {
                var customCDN = 'https://my.corporate.cdn/';
                var binaries = files_1.FileManager.compileBinaries_('Windows_NT', customCDN);
                forEachOf(binaries, function (binary) { return expect(binary.cdn).toEqual(customCDN, binary.name); });
            });
        });
        function forEachOf(binaries, fn) {
            for (var key in binaries) {
                fn(binaries[key]);
            }
        }
    });
});
//# sourceMappingURL=fileManager_spec.js.map