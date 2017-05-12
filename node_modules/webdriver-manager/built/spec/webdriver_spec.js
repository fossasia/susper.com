"use strict";
var child_process = require('child_process');
var webdriver_1 = require('../lib/webdriver');
function runSpawn(task, opt_arg) {
    opt_arg = typeof opt_arg !== 'undefined' ? opt_arg : [];
    var child = child_process.spawnSync(task, opt_arg, { stdio: 'pipe' });
    return child.output[1].toString().split('\n');
}
;
describe('cli', function () {
    describe('help', function () {
        it('should have usage and commands', function () {
            var lines = runSpawn('node', ['built/lib/webdriver.js', 'help']);
            // very specific to make sure the
            var index = 0;
            expect(lines[index++].indexOf('Usage:')).toBe(0);
            index++;
            expect(lines[index++].indexOf('Commands:')).toBe(0);
            for (var cmd in webdriver_1.cli.programs) {
                expect(lines[index++].indexOf(cmd)).toBe(2);
            }
            index++;
            expect(lines[index++].indexOf('Options:')).toBe(0);
            var options = webdriver_1.cli.getOptions();
            for (var opt in options) {
                expect(lines[index++].indexOf('--' + opt)).toBe(2);
            }
        });
    });
});
//# sourceMappingURL=webdriver_spec.js.map