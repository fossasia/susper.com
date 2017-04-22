
Error.stackTraceLimit = 0;
// Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

__karma__.loaded = function () { };

var specs = Object.keys(window.__karma__.files)
    .filter(isSpecFile)

System.config({
    transpiler: 'typescript',
    baseURL: '/base',
    paths: {
        'npm:': 'node_modules/'
    },
    map: {
        '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
        '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
        '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
        '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
        '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
        '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
        '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',
        '@angular/forms/testing': 'npm:@angular/forms/bundles/forms-testing.umd.js',
    }
});

System.import('systemjs.config.js')
    .then(initTestBed)
    .then(initTesting);

function isSpecFile(path) {
    return /\.spec\.(.*\.)?ts$/.test(path);
}

function initTestBed() {
    return Promise.all([
        System.import('@angular/core/testing'),
        System.import('@angular/platform-browser-dynamic/testing')
    ])
        .then(function (providers) {
            var coreTesting = providers[0];
            var browserTesting = providers[1];

            coreTesting.TestBed.initTestEnvironment(
                browserTesting.BrowserDynamicTestingModule,
                browserTesting.platformBrowserDynamicTesting());
        });
}

// Import all spec files and start karma
function initTesting() {
    return Promise.all(
        specs.map(function (moduleName) {
            return System.import(moduleName);
        })
    )
        .then(__karma__.start, null, function (error) { __karma__.error(error.stack || error); });
}