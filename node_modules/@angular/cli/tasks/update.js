"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Task = require('../ember-cli/lib/models/task');
const schematic_run_1 = require("./schematic-run");
exports.UpdateTask = Task.extend({
    run: function (schematic, options) {
        const [collectionName, schematicName] = schematic.split(':');
        const schematicRunTask = new schematic_run_1.default({
            ui: this.ui,
            project: this.project
        });
        const schematicRunOptions = {
            taskOptions: {
                dryRun: options.dryRun,
                version: options.next ? 'next' : undefined
            },
            workingDir: this.project.root,
            collectionName,
            schematicName
        };
        return schematicRunTask.run(schematicRunOptions);
    }
});
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/tasks/update.js.map