"use strict";
var denodeify = require('denodeify');
var Task = require('../ember-cli/lib/models/task');
var SilentError = require('silent-error');
var child_process_1 = require('child_process');
var https = require('https');
var common_tags_1 = require('common-tags');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Task.extend({
    run: function (commandOptions) {
        var ui = this.ui;
        var promise;
        // declared here so that tests can stub exec
        var execPromise = denodeify(child_process_1.exec);
        if (/.+/.test(commandOptions.ghToken) && /\w+/.test(commandOptions.ghUsername)) {
            promise = Promise.resolve({
                ghToken: commandOptions.ghToken,
                ghUsername: commandOptions.ghUsername
            });
        }
        else {
            ui.writeLine();
            ui.writeLine((_a = ["\n        In order to deploy this project via GitHub Pages, we must first create a repository for it.\n      "], _a.raw = ["\n        In order to deploy this project via GitHub Pages, we must first create a repository for it.\n      "], common_tags_1.oneLine(_a)));
            ui.writeLine((_b = ["\n        It's safer to use a token than to use a password so you will need to create one\n      "], _b.raw = ["\n        It\\'s safer to use a token than to use a password so you will need to create one\n      "], common_tags_1.oneLine(_b)));
            ui.writeLine('Go to the following page and click "Generate new token".');
            ui.writeLine('https://github.com/settings/tokens\n');
            ui.writeLine('Choose "public_repo" as scope and then click "Generate token".\n');
            promise = ui.prompt([
                {
                    name: 'ghToken',
                    type: 'input',
                    message: (_c = ["\n            Please enter GitHub token you just created\n            (used only once to create the repo):\n          "], _c.raw = ["\n            Please enter GitHub token you just created\n            (used only once to create the repo):\n          "], common_tags_1.oneLine(_c)),
                    validate: function (token) {
                        return /.+/.test(token);
                    }
                }, {
                    name: 'ghUsername',
                    type: 'input',
                    message: 'and your GitHub user name:',
                    validate: function (userName) {
                        return /\w+/.test(userName);
                    }
                }]);
        }
        return promise
            .then(function (answers) {
            return new Promise(function (resolve, reject) {
                var postData = JSON.stringify({
                    'name': commandOptions.projectName
                });
                var req = https.request({
                    hostname: 'api.github.com',
                    port: 443,
                    path: '/user/repos',
                    method: 'POST',
                    headers: {
                        'Authorization': "token " + answers.ghToken,
                        'Content-Type': 'application/json',
                        'Content-Length': postData.length,
                        'User-Agent': 'angular-cli-github-pages'
                    }
                });
                req.on('response', function (response) {
                    if (response.statusCode === 201) {
                        resolve(execPromise((_a = ["\n              git remote add origin \n              git@github.com:", "/", ".git\n            "], _a.raw = ["\n              git remote add origin \n              git@github.com:", "/", ".git\n            "], common_tags_1.oneLine(_a, answers.ghUsername, commandOptions.projectName))));
                    }
                    else {
                        reject(new SilentError((_b = ["\n              Failed to create GitHub repo. Error: ", " ", "\n            "], _b.raw = ["\n              Failed to create GitHub repo. Error: ", " ", "\n            "], common_tags_1.oneLine(_b, response.statusCode, response.statusMessage))));
                    }
                    var _a, _b;
                });
                req.write(postData);
                req.end();
            });
        });
        var _a, _b, _c;
    }
});
//# sourceMappingURL=/Users/hans/Sources/angular-cli/packages/angular-cli/tasks/create-github-repo.js.map