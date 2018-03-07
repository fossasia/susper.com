"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createAppModule(tree, path) {
    tree.create(path || '/src/app/app.module.ts', `
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { AppComponent } from './app.component';

    @NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule
    ],
    providers: [],
    bootstrap: [AppComponent]
    })
    export class AppModule { }
  `);
    return tree;
}
exports.createAppModule = createAppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlLWFwcC1tb2R1bGUuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL3NjaGVtYXRpY3MvYW5ndWxhci91dGlsaXR5L3Rlc3QvY3JlYXRlLWFwcC1tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFVQSx5QkFBZ0MsSUFBVSxFQUFFLElBQWE7SUFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksd0JBQXdCLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQjdDLENBQUMsQ0FBQztJQUVILE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBcEJELDBDQW9CQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IFRyZWUgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUFwcE1vZHVsZSh0cmVlOiBUcmVlLCBwYXRoPzogc3RyaW5nKTogVHJlZSB7XG4gIHRyZWUuY3JlYXRlKHBhdGggfHwgJy9zcmMvYXBwL2FwcC5tb2R1bGUudHMnLCBgXG4gICAgaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuICAgIGltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG4gICAgaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi9hcHAuY29tcG9uZW50JztcblxuICAgIEBOZ01vZHVsZSh7XG4gICAgZGVjbGFyYXRpb25zOiBbXG4gICAgICBBcHBDb21wb25lbnRcbiAgICBdLFxuICAgIGltcG9ydHM6IFtcbiAgICAgIEJyb3dzZXJNb2R1bGVcbiAgICBdLFxuICAgIHByb3ZpZGVyczogW10sXG4gICAgYm9vdHN0cmFwOiBbQXBwQ29tcG9uZW50XVxuICAgIH0pXG4gICAgZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7IH1cbiAgYCk7XG5cbiAgcmV0dXJuIHRyZWU7XG59XG4iXX0=