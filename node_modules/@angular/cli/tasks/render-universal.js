"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const require_project_module_1 = require("../utilities/require-project-module");
const path_1 = require("path");
const fs = require('fs');
const Task = require('../ember-cli/lib/models/task');
exports.default = Task.extend({
    run: function (options) {
        require('zone.js/dist/zone-node');
        const renderModuleFactory = require_project_module_1.requireProjectModule(this.project.root, '@angular/platform-server').renderModuleFactory;
        // Get the main bundle from the server build's output directory.
        const serverDir = fs.readdirSync(options.serverOutDir);
        const serverMainBundle = serverDir
            .filter((file) => /main\.(?:[a-zA-Z0-9]{20}\.)?bundle\.js/.test(file))[0];
        const serverBundlePath = path_1.join(options.serverOutDir, serverMainBundle);
        const AppServerModuleNgFactory = require(serverBundlePath).AppServerModuleNgFactory;
        const index = fs.readFileSync(options.inputIndexPath, 'utf8');
        // Render to HTML and overwrite the client index file.
        return renderModuleFactory(AppServerModuleNgFactory, { document: index, url: options.route })
            .then((html) => fs.writeFileSync(options.outputIndexPath, html));
    }
});
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/tasks/render-universal.js.map