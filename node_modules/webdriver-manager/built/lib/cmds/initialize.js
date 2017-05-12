"use strict";
var child_process = require('child_process');
var fs = require('fs');
var glob = require('glob');
var ini = require('ini');
var os = require('os');
var path = require('path');
var q = require('q');
var noop = function () { };
// Make a function which configures a child process to automatically respond
// to a certain question
function respondFactory(question, answer) {
    return function (child) {
        child.stdin.setDefaultEncoding('utf-8');
        child.stdout.on('data', function (data) {
            if (data != null) {
                if (data.toString().indexOf(question) != -1) {
                    child.stdin.write(answer + '\n');
                }
            }
        });
    };
}
// Run a command on the android SDK
function runAndroidSDKCommand(sdkPath, cmd, args, spawnOptions, config_fun) {
    var child = child_process.spawn(path.join(sdkPath, 'tools', 'android'), [cmd].concat(args), spawnOptions);
    if (config_fun) {
        config_fun(child);
    }
    ;
    var deferred = q.defer();
    child.on('exit', function (code) {
        if (deferred != null) {
            if (code) {
                deferred.reject(code);
            }
            else {
                deferred.resolve();
            }
            deferred = null;
        }
    });
    child.on('error', function (err) {
        if (deferred != null) {
            deferred.reject(err);
            deferred = null;
        }
    });
    return deferred.promise;
}
// Download updates via the android SDK
function downloadAndroidUpdates(sdkPath, targets, search_all, auto_accept) {
    return runAndroidSDKCommand(sdkPath, 'update', ['sdk', '-u'].concat(search_all ? ['-a'] : []).concat(['-t', targets.join(',')]), { stdio: auto_accept ? 'pipe' : 'inherit' }, auto_accept ? respondFactory('Do you accept the license', 'y') : noop);
}
// Setup hardware acceleration for x86-64 emulation
function setupHardwareAcceleration(sdkPath) {
    // TODO(sjelin): check that the BIOS option is set properly on linux
    if (os.type() == 'Darwin') {
        console.log('Enabling hardware acceleration (requires root access)');
        child_process.spawnSync('sudo', [path.join(sdkPath, 'extras', 'intel', 'Hardware_Accelerated_Execution_Manager', 'silent_install.sh')], { stdio: 'inherit' });
    }
    else if (os.type() == 'Windows_NT') {
        console.log('Enabling hardware acceleration (requires admin access)');
        child_process.spawnSync('runas', [
            '/noprofile', '/user:Administrator',
            path.join(sdkPath, 'extras', 'intel', 'Hardware_Accelerated_Execution_Manager', 'silent_install.bat')
        ], { stdio: 'inherit' });
    }
}
// Get a list of all the SDK download targets for a given set of APIs and ABIs
function getAndroidSDKTargets(apiLevels, abis) {
    return apiLevels
        .map(function (level) {
        return 'android-' + level;
    })
        .concat(abis.reduce(function (targets, abi) {
        var abiParts = abi.split('/');
        var deviceType = 'default';
        var architecture;
        if (abiParts.length == 1) {
            architecture = abiParts[0];
        }
        else {
            deviceType = abiParts[0];
            architecture = abiParts[1];
        }
        if (deviceType.toUpperCase() == 'DEFAULT') {
            deviceType = 'android';
        }
        return targets.concat(apiLevels.map(function (level) {
            return 'sys-img-' + architecture + '-' + deviceType + '-' + level;
        }));
    }, []));
}
// All the information about an android virtual device
var AVDDescriptor = (function () {
    function AVDDescriptor(api, deviceType, architecture) {
        this.api = api;
        this.deviceType = deviceType;
        this.architecture = architecture;
        this.abi = (deviceType.toUpperCase() == 'DEFAULT' ? '' : deviceType + '/') + architecture;
        this.name = [api, deviceType, architecture].join('-');
    }
    AVDDescriptor.prototype.avdName = function (version) {
        return this.name + '-v' + version + '-wd-manager';
    };
    return AVDDescriptor;
}());
// Gets the descriptors for all AVDs which are possible to make given the
// SDKs which were downloaded
function getAVDDescriptors(sdkPath) {
    var deferred = q.defer();
    glob(path.join(sdkPath, 'system-images', '*', '*', '*'), function (err, files) {
        if (err) {
            deferred.reject(err);
        }
        else {
            deferred.resolve(files.map(function (file) {
                var info = file.split(path.sep).slice(-3);
                return new AVDDescriptor(info[0], info[1], info[2]);
            }));
        }
    });
    return deferred.promise;
}
function sequentialForEach(array, func) {
    var ret = q(null);
    array.forEach(function (x) {
        ret = ret.then(function () {
            return func(x);
        });
    });
    return ret;
}
// Configures the hardware.ini file for a system image of a new AVD
function configureAVDHardware(sdkPath, desc) {
    var file = path.join(sdkPath, 'system-images', desc.api, desc.deviceType, desc.architecture, 'hardware.ini');
    return q.nfcall(fs.stat, file)
        .then(function (stats) {
        return q.nfcall(fs.readFile, file);
    }, function (err) {
        return q('');
    })
        .then(function (contents) {
        var config = ini.parse(contents.toString());
        config['hw.keyboard'] = 'yes';
        config['hw.battery'] = 'yes';
        config['hw.ramSize'] = 1024;
        return q.nfcall(fs.writeFile, file, ini.stringify(config));
    });
}
// Make an android virtual device
function makeAVD(sdkPath, desc, version) {
    return runAndroidSDKCommand(sdkPath, 'delete', ['avd', '--name', desc.avdName(version)], {})
        .then(noop, noop)
        .then(function () {
        return runAndroidSDKCommand(sdkPath, 'create', ['avd', '--name', desc.avdName(version), '--target', desc.api, '--abi', desc.abi], { stdio: 'pipe' }, respondFactory('Do you wish to create a custom hardware profile', 'no'));
    });
}
// Initialize the android SDK
function android(sdkPath, apiLevels, abis, acceptLicenses, version, logger) {
    var avdDescriptors;
    var tools = ['platform-tool', 'tool'];
    if ((os.type() == 'Darwin') || (os.type() == 'Windows_NT')) {
        tools.push('extra-intel-Hardware_Accelerated_Execution_Manager');
    }
    logger.info('android-sdk: Downloading additional SDK updates');
    downloadAndroidUpdates(sdkPath, tools, false, acceptLicenses)
        .then(function () {
        return setupHardwareAcceleration(sdkPath);
    })
        .then(function () {
        logger.info('android-sdk: Downloading more additional SDK updates ' +
            '(this may take a while)');
        return downloadAndroidUpdates(sdkPath, ['build-tools-24.0.0'].concat(getAndroidSDKTargets(apiLevels, abis)), true, acceptLicenses);
    })
        .then(function () {
        return getAVDDescriptors(sdkPath);
    })
        .then(function (descriptors) {
        avdDescriptors = descriptors;
        logger.info('android-sdk: Configuring virtual device hardware');
        return sequentialForEach(avdDescriptors, function (descriptor) {
            return configureAVDHardware(sdkPath, descriptor);
        });
    })
        .then(function () {
        return sequentialForEach(avdDescriptors, function (descriptor) {
            logger.info('android-sdk: Setting up virtual device "' + descriptor.name + '"');
            return makeAVD(sdkPath, descriptor, version);
        });
    })
        .then(function () {
        return q.nfcall(fs.writeFile, path.join(sdkPath, 'available_avds.json'), JSON.stringify(avdDescriptors.map(function (descriptor) {
            return descriptor.name;
        })));
    })
        .then(function () {
        logger.info('android-sdk: Initialization complete');
    })
        .done();
}
exports.android = android;
;
function iOS(logger) {
    if (os.type() != 'Darwin') {
        throw new Error('Must be on a Mac to simulate iOS devices.');
    }
    try {
        fs.statSync('/Applications/Xcode.app');
    }
    catch (e) {
        logger.warn('You must install the xcode commandline tools!');
    }
}
exports.iOS = iOS;
//# sourceMappingURL=initialize.js.map