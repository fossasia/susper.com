"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("./options");
class NodePackageInstallTask {
    constructor(workingDirectory) {
        this.workingDirectory = workingDirectory;
        this.quiet = true;
    }
    toConfiguration() {
        return {
            name: options_1.NodePackageName,
            options: {
                command: 'install',
                quiet: this.quiet,
                workingDirectory: this.workingDirectory,
            },
        };
    }
}
exports.NodePackageInstallTask = NodePackageInstallTask;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbC10YXNrLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3Rhc2tzL25vZGUtcGFja2FnZS9pbnN0YWxsLXRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSx1Q0FBb0U7QUFFcEU7SUFHRSxZQUFtQixnQkFBeUI7UUFBekIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFTO1FBRjVDLFVBQUssR0FBRyxJQUFJLENBQUM7SUFFa0MsQ0FBQztJQUVoRCxlQUFlO1FBQ2IsTUFBTSxDQUFDO1lBQ0wsSUFBSSxFQUFFLHlCQUFlO1lBQ3JCLE9BQU8sRUFBRTtnQkFDUCxPQUFPLEVBQUUsU0FBUztnQkFDbEIsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO2FBQ3hDO1NBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQWZELHdEQWVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgVGFza0NvbmZpZ3VyYXRpb24sIFRhc2tDb25maWd1cmF0aW9uR2VuZXJhdG9yIH0gZnJvbSAnLi4vLi4vc3JjJztcbmltcG9ydCB7IE5vZGVQYWNrYWdlTmFtZSwgTm9kZVBhY2thZ2VUYXNrT3B0aW9ucyB9IGZyb20gJy4vb3B0aW9ucyc7XG5cbmV4cG9ydCBjbGFzcyBOb2RlUGFja2FnZUluc3RhbGxUYXNrIGltcGxlbWVudHMgVGFza0NvbmZpZ3VyYXRpb25HZW5lcmF0b3I8Tm9kZVBhY2thZ2VUYXNrT3B0aW9ucz4ge1xuICBxdWlldCA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHdvcmtpbmdEaXJlY3Rvcnk/OiBzdHJpbmcpIHt9XG5cbiAgdG9Db25maWd1cmF0aW9uKCk6IFRhc2tDb25maWd1cmF0aW9uPE5vZGVQYWNrYWdlVGFza09wdGlvbnM+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogTm9kZVBhY2thZ2VOYW1lLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBjb21tYW5kOiAnaW5zdGFsbCcsXG4gICAgICAgIHF1aWV0OiB0aGlzLnF1aWV0LFxuICAgICAgICB3b3JraW5nRGlyZWN0b3J5OiB0aGlzLndvcmtpbmdEaXJlY3RvcnksXG4gICAgICB9LFxuICAgIH07XG4gIH1cbn1cbiJdfQ==