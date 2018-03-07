"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = require("./options");
class NodePackageLinkTask {
    constructor(packageName, workingDirectory) {
        this.packageName = packageName;
        this.workingDirectory = workingDirectory;
        this.quiet = true;
    }
    toConfiguration() {
        return {
            name: options_1.NodePackageName,
            options: {
                command: 'link',
                quiet: this.quiet,
                workingDirectory: this.workingDirectory,
                packageName: this.packageName,
            },
        };
    }
}
exports.NodePackageLinkTask = NodePackageLinkTask;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay10YXNrLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3Rhc2tzL25vZGUtcGFja2FnZS9saW5rLXRhc2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSx1Q0FBb0U7QUFFcEU7SUFHRSxZQUFtQixXQUFvQixFQUFTLGdCQUF5QjtRQUF0RCxnQkFBVyxHQUFYLFdBQVcsQ0FBUztRQUFTLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBUztRQUZ6RSxVQUFLLEdBQUcsSUFBSSxDQUFDO0lBRStELENBQUM7SUFFN0UsZUFBZTtRQUNiLE1BQU0sQ0FBQztZQUNMLElBQUksRUFBRSx5QkFBZTtZQUNyQixPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO2dCQUNqQixnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCO2dCQUN2QyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVc7YUFDOUI7U0FDRixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBaEJELGtEQWdCQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IFRhc2tDb25maWd1cmF0aW9uLCBUYXNrQ29uZmlndXJhdGlvbkdlbmVyYXRvciB9IGZyb20gJy4uLy4uL3NyYyc7XG5pbXBvcnQgeyBOb2RlUGFja2FnZU5hbWUsIE5vZGVQYWNrYWdlVGFza09wdGlvbnMgfSBmcm9tICcuL29wdGlvbnMnO1xuXG5leHBvcnQgY2xhc3MgTm9kZVBhY2thZ2VMaW5rVGFzayBpbXBsZW1lbnRzIFRhc2tDb25maWd1cmF0aW9uR2VuZXJhdG9yPE5vZGVQYWNrYWdlVGFza09wdGlvbnM+IHtcbiAgcXVpZXQgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBwYWNrYWdlTmFtZT86IHN0cmluZywgcHVibGljIHdvcmtpbmdEaXJlY3Rvcnk/OiBzdHJpbmcpIHt9XG5cbiAgdG9Db25maWd1cmF0aW9uKCk6IFRhc2tDb25maWd1cmF0aW9uPE5vZGVQYWNrYWdlVGFza09wdGlvbnM+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogTm9kZVBhY2thZ2VOYW1lLFxuICAgICAgb3B0aW9uczoge1xuICAgICAgICBjb21tYW5kOiAnbGluaycsXG4gICAgICAgIHF1aWV0OiB0aGlzLnF1aWV0LFxuICAgICAgICB3b3JraW5nRGlyZWN0b3J5OiB0aGlzLndvcmtpbmdEaXJlY3RvcnksXG4gICAgICAgIHBhY2thZ2VOYW1lOiB0aGlzLnBhY2thZ2VOYW1lLFxuICAgICAgfSxcbiAgICB9O1xuICB9XG59XG4iXX0=