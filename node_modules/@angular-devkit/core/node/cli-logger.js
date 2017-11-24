"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
require("rxjs/add/operator/filter");
/**
 * A Logger that sends information to STDOUT and STDERR.
 */
function createConsoleLogger(verbose = false) {
    const logger = new core_1.logging.IndentLogger('cling');
    logger
        .filter(entry => (entry.level != 'debug' || verbose))
        .subscribe(entry => {
        let color = x => core_1.terminal.dim(core_1.terminal.white(x));
        let output = process.stdout;
        switch (entry.level) {
            case 'info':
                color = core_1.terminal.white;
                break;
            case 'warn':
                color = core_1.terminal.yellow;
                break;
            case 'error':
                color = core_1.terminal.red;
                output = process.stderr;
                break;
            case 'fatal':
                color = (x) => core_1.terminal.bold(core_1.terminal.red(x));
                output = process.stderr;
                break;
        }
        output.write(color(entry.message) + '\n');
    });
    return logger;
}
exports.createConsoleLogger = createConsoleLogger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWxvZ2dlci5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9jb3JlL25vZGUvY2xpLWxvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQUF5RDtBQUN6RCxvQ0FBa0M7QUFHbEM7O0dBRUc7QUFDSCw2QkFBb0MsT0FBTyxHQUFHLEtBQUs7SUFDakQsTUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRWpELE1BQU07U0FDSCxNQUFNLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLENBQUM7U0FDcEQsU0FBUyxDQUFDLEtBQUs7UUFDZCxJQUFJLEtBQUssR0FBMEIsQ0FBQyxJQUFJLGVBQVEsQ0FBQyxHQUFHLENBQUMsZUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDNUIsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDcEIsS0FBSyxNQUFNO2dCQUNULEtBQUssR0FBRyxlQUFRLENBQUMsS0FBSyxDQUFDO2dCQUN2QixLQUFLLENBQUM7WUFDUixLQUFLLE1BQU07Z0JBQ1QsS0FBSyxHQUFHLGVBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQztZQUNSLEtBQUssT0FBTztnQkFDVixLQUFLLEdBQUcsZUFBUSxDQUFDLEdBQUcsQ0FBQztnQkFDckIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQztZQUNSLEtBQUssT0FBTztnQkFDVixLQUFLLEdBQUcsQ0FBQyxDQUFTLEtBQUssZUFBUSxDQUFDLElBQUksQ0FBQyxlQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO2dCQUN4QixLQUFLLENBQUM7UUFDVixDQUFDO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0lBRUwsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBN0JELGtEQTZCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IGxvZ2dpbmcsIHRlcm1pbmFsIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0ICdyeGpzL2FkZC9vcGVyYXRvci9maWx0ZXInO1xuXG5cbi8qKlxuICogQSBMb2dnZXIgdGhhdCBzZW5kcyBpbmZvcm1hdGlvbiB0byBTVERPVVQgYW5kIFNUREVSUi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbnNvbGVMb2dnZXIodmVyYm9zZSA9IGZhbHNlKTogbG9nZ2luZy5Mb2dnZXIge1xuICBjb25zdCBsb2dnZXIgPSBuZXcgbG9nZ2luZy5JbmRlbnRMb2dnZXIoJ2NsaW5nJyk7XG5cbiAgbG9nZ2VyXG4gICAgLmZpbHRlcihlbnRyeSA9PiAoZW50cnkubGV2ZWwgIT0gJ2RlYnVnJyB8fCB2ZXJib3NlKSlcbiAgICAuc3Vic2NyaWJlKGVudHJ5ID0+IHtcbiAgICAgIGxldCBjb2xvcjogKHM6IHN0cmluZykgPT4gc3RyaW5nID0geCA9PiB0ZXJtaW5hbC5kaW0odGVybWluYWwud2hpdGUoeCkpO1xuICAgICAgbGV0IG91dHB1dCA9IHByb2Nlc3Muc3Rkb3V0O1xuICAgICAgc3dpdGNoIChlbnRyeS5sZXZlbCkge1xuICAgICAgICBjYXNlICdpbmZvJzpcbiAgICAgICAgICBjb2xvciA9IHRlcm1pbmFsLndoaXRlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3YXJuJzpcbiAgICAgICAgICBjb2xvciA9IHRlcm1pbmFsLnllbGxvdztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICAgIGNvbG9yID0gdGVybWluYWwucmVkO1xuICAgICAgICAgIG91dHB1dCA9IHByb2Nlc3Muc3RkZXJyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmYXRhbCc6XG4gICAgICAgICAgY29sb3IgPSAoeDogc3RyaW5nKSA9PiB0ZXJtaW5hbC5ib2xkKHRlcm1pbmFsLnJlZCh4KSk7XG4gICAgICAgICAgb3V0cHV0ID0gcHJvY2Vzcy5zdGRlcnI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIG91dHB1dC53cml0ZShjb2xvcihlbnRyeS5tZXNzYWdlKSArICdcXG4nKTtcbiAgICB9KTtcblxuICByZXR1cm4gbG9nZ2VyO1xufVxuIl19