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
    const logger = new core_1.IndentLogger('cling');
    logger
        .filter((entry) => (entry.level != 'debug' || verbose))
        .subscribe((entry) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLWxvZ2dlci5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9jb3JlL25vZGUvY2xpLWxvZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQUFnRjtBQUNoRixvQ0FBa0M7QUFHbEM7O0dBRUc7QUFDSCw2QkFBb0MsT0FBTyxHQUFHLEtBQUs7SUFDakQsTUFBTSxNQUFNLEdBQUcsSUFBSSxtQkFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXpDLE1BQU07U0FDSCxNQUFNLENBQUMsQ0FBQyxLQUFlLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQztTQUNoRSxTQUFTLENBQUMsQ0FBQyxLQUFlO1FBQ3pCLElBQUksS0FBSyxHQUEwQixDQUFDLElBQUksZUFBUSxDQUFDLEdBQUcsQ0FBQyxlQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEUsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUM1QixNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNwQixLQUFLLE1BQU07Z0JBQ1QsS0FBSyxHQUFHLGVBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQ3ZCLEtBQUssQ0FBQztZQUNSLEtBQUssTUFBTTtnQkFDVCxLQUFLLEdBQUcsZUFBUSxDQUFDLE1BQU0sQ0FBQztnQkFDeEIsS0FBSyxDQUFDO1lBQ1IsS0FBSyxPQUFPO2dCQUNWLEtBQUssR0FBRyxlQUFRLENBQUMsR0FBRyxDQUFDO2dCQUNyQixNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztnQkFDeEIsS0FBSyxDQUFDO1lBQ1IsS0FBSyxPQUFPO2dCQUNWLEtBQUssR0FBRyxDQUFDLENBQVMsS0FBSyxlQUFRLENBQUMsSUFBSSxDQUFDLGVBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEQsTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQztRQUNWLENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDNUMsQ0FBQyxDQUFDLENBQUM7SUFFTCxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUE3QkQsa0RBNkJDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgSW5kZW50TG9nZ2VyLCBMb2dFbnRyeSwgTG9nZ2VyLCB0ZXJtaW5hbCB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCAncnhqcy9hZGQvb3BlcmF0b3IvZmlsdGVyJztcblxuXG4vKipcbiAqIEEgTG9nZ2VyIHRoYXQgc2VuZHMgaW5mb3JtYXRpb24gdG8gU1RET1VUIGFuZCBTVERFUlIuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDb25zb2xlTG9nZ2VyKHZlcmJvc2UgPSBmYWxzZSk6IExvZ2dlciB7XG4gIGNvbnN0IGxvZ2dlciA9IG5ldyBJbmRlbnRMb2dnZXIoJ2NsaW5nJyk7XG5cbiAgbG9nZ2VyXG4gICAgLmZpbHRlcigoZW50cnk6IExvZ0VudHJ5KSA9PiAoZW50cnkubGV2ZWwgIT0gJ2RlYnVnJyB8fCB2ZXJib3NlKSlcbiAgICAuc3Vic2NyaWJlKChlbnRyeTogTG9nRW50cnkpID0+IHtcbiAgICAgIGxldCBjb2xvcjogKHM6IHN0cmluZykgPT4gc3RyaW5nID0geCA9PiB0ZXJtaW5hbC5kaW0odGVybWluYWwud2hpdGUoeCkpO1xuICAgICAgbGV0IG91dHB1dCA9IHByb2Nlc3Muc3Rkb3V0O1xuICAgICAgc3dpdGNoIChlbnRyeS5sZXZlbCkge1xuICAgICAgICBjYXNlICdpbmZvJzpcbiAgICAgICAgICBjb2xvciA9IHRlcm1pbmFsLndoaXRlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd3YXJuJzpcbiAgICAgICAgICBjb2xvciA9IHRlcm1pbmFsLnllbGxvdztcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZXJyb3InOlxuICAgICAgICAgIGNvbG9yID0gdGVybWluYWwucmVkO1xuICAgICAgICAgIG91dHB1dCA9IHByb2Nlc3Muc3RkZXJyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdmYXRhbCc6XG4gICAgICAgICAgY29sb3IgPSAoeDogc3RyaW5nKSA9PiB0ZXJtaW5hbC5ib2xkKHRlcm1pbmFsLnJlZCh4KSk7XG4gICAgICAgICAgb3V0cHV0ID0gcHJvY2Vzcy5zdGRlcnI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIG91dHB1dC53cml0ZShjb2xvcihlbnRyeS5tZXNzYWdlKSArICdcXG4nKTtcbiAgICB9KTtcblxuICByZXR1cm4gbG9nZ2VyO1xufVxuIl19