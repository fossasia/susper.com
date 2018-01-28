"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const Task = require('../ember-cli/lib/models/task');
const { cyan, green, grey } = chalk_1.default;
const hiddenOptions = [
    'name',
    'path',
    'source-dir',
    'app-root'
];
exports.default = Task.extend({
    run: function ({ schematicName, collectionName, nonSchematicOptions }) {
        const SchematicGetOptionsTask = require('./schematic-get-options').default;
        const getOptionsTask = new SchematicGetOptionsTask({
            ui: this.ui,
            project: this.project
        });
        return Promise.all([getOptionsTask.run({
                schematicName: schematicName,
                collectionName: collectionName,
            }), nonSchematicOptions])
            .then(([availableOptions, nonSchematicOptions]) => {
            const output = [];
            [...(nonSchematicOptions || []), ...availableOptions || []]
                .filter(opt => hiddenOptions.indexOf(opt.name) === -1)
                .forEach(opt => {
                let text = cyan(`    --${opt.name}`);
                if (opt.schematicType) {
                    text += cyan(` (${opt.schematicType})`);
                }
                if (opt.schematicDefault) {
                    text += cyan(` (Default: ${opt.schematicDefault})`);
                }
                if (opt.description) {
                    text += ` ${opt.description}`;
                }
                output.push(text);
                if (opt.aliases && opt.aliases.length > 0) {
                    const aliasText = opt.aliases.reduce((acc, curr) => {
                        return acc + ` -${curr}`;
                    }, '');
                    output.push(grey(`      aliases: ${aliasText}`));
                }
            });
            if (availableOptions === null) {
                output.push(green('This schematic accept additional options, but did not provide '
                    + 'documentation.'));
            }
            return output;
        });
    }
});
//# sourceMappingURL=/users/hansl/sources/hansl/angular-cli/tasks/schematic-get-help-output.js.map