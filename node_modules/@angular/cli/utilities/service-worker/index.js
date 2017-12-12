"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_tags_1 = require("common-tags");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const semver = require("semver");
exports.NEW_SW_VERSION = '5.0.0-rc.0';
class CliFilesystem {
    constructor(base) {
        this.base = base;
    }
    list(_path) {
        return Promise.resolve(this.syncList(_path));
    }
    syncList(_path) {
        const dir = this.canonical(_path);
        const entries = fs.readdirSync(dir).map((entry) => ({ entry, stats: fs.statSync(path.posix.join(dir, entry)) }));
        const files = entries.filter((entry) => !entry.stats.isDirectory())
            .map((entry) => path.posix.join(_path, entry.entry));
        return entries.filter((entry) => entry.stats.isDirectory())
            .map((entry) => path.posix.join(_path, entry.entry))
            .reduce((list, subdir) => list.concat(this.syncList(subdir)), files);
    }
    read(_path) {
        const file = this.canonical(_path);
        return Promise.resolve(fs.readFileSync(file).toString());
    }
    hash(_path) {
        const sha1 = crypto.createHash('sha1');
        const file = this.canonical(_path);
        const contents = fs.readFileSync(file);
        sha1.update(contents);
        return Promise.resolve(sha1.digest('hex'));
    }
    write(_path, contents) {
        const file = this.canonical(_path);
        fs.writeFileSync(file, contents);
        return Promise.resolve();
    }
    canonical(_path) { return path.posix.join(this.base, _path); }
}
function usesServiceWorker(projectRoot) {
    const nodeModules = path.resolve(projectRoot, 'node_modules');
    const swModule = path.resolve(nodeModules, '@angular/service-worker');
    if (!fs.existsSync(swModule)) {
        return false;
    }
    const swPackageJson = fs.readFileSync(`${swModule}/package.json`).toString();
    const swVersion = JSON.parse(swPackageJson)['version'];
    return semver.gte(swVersion, exports.NEW_SW_VERSION);
}
exports.usesServiceWorker = usesServiceWorker;
function augmentAppWithServiceWorker(projectRoot, appRoot, outputPath, baseHref) {
    const nodeModules = path.resolve(projectRoot, 'node_modules');
    const swModule = path.resolve(nodeModules, '@angular/service-worker');
    // Path to the worker script itself.
    const workerPath = path.resolve(swModule, 'ngsw-worker.js');
    const configPath = path.resolve(appRoot, 'ngsw-config.json');
    if (!fs.existsSync(configPath)) {
        throw new Error(common_tags_1.oneLine `Error: Expected to find an ngsw-config.json configuration
      file in the ${appRoot} folder. Either provide one or disable Service Worker
      in .angular-cli.json.`);
    }
    const config = fs.readFileSync(configPath, 'utf8');
    const Generator = require('@angular/service-worker/config').Generator;
    const gen = new Generator(new CliFilesystem(outputPath), baseHref);
    return gen
        .process(JSON.parse(config))
        .then((output) => {
        const manifest = JSON.stringify(output, null, 2);
        fs.writeFileSync(path.resolve(outputPath, 'ngsw.json'), manifest);
        // Copy worker script to dist directory.
        const workerCode = fs.readFileSync(workerPath);
        fs.writeFileSync(path.resolve(outputPath, 'ngsw-worker.js'), workerCode);
    });
}
exports.augmentAppWithServiceWorker = augmentAppWithServiceWorker;
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/utilities/service-worker/index.js.map