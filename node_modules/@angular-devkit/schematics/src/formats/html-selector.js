"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Must start with a letter, and must contain only alphanumeric characters or dashes.
// When adding a dash the segment after the dash must also start with a letter.
exports.htmlSelectorRe = /^[a-zA-Z][.0-9a-zA-Z]*(:?-[a-zA-Z][.0-9a-zA-Z]*)*$/;
exports.htmlSelectorFormat = {
    name: 'html-selector',
    formatter: {
        async: false,
        validate: (selector) => exports.htmlSelectorRe.test(selector),
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC1zZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9zY2hlbWF0aWNzL3NyYy9mb3JtYXRzL2h0bWwtc2VsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFLSCxxRkFBcUY7QUFDckYsK0VBQStFO0FBQ2xFLFFBQUEsY0FBYyxHQUFHLG9EQUFvRCxDQUFDO0FBRXRFLFFBQUEsa0JBQWtCLEdBQXdCO0lBQ3JELElBQUksRUFBRSxlQUFlO0lBQ3JCLFNBQVMsRUFBRTtRQUNULEtBQUssRUFBRSxLQUFLO1FBQ1osUUFBUSxFQUFFLENBQUMsUUFBZ0IsRUFBRSxFQUFFLENBQUMsc0JBQWMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQzlEO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHsgc2NoZW1hIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuXG5cbi8vIE11c3Qgc3RhcnQgd2l0aCBhIGxldHRlciwgYW5kIG11c3QgY29udGFpbiBvbmx5IGFscGhhbnVtZXJpYyBjaGFyYWN0ZXJzIG9yIGRhc2hlcy5cbi8vIFdoZW4gYWRkaW5nIGEgZGFzaCB0aGUgc2VnbWVudCBhZnRlciB0aGUgZGFzaCBtdXN0IGFsc28gc3RhcnQgd2l0aCBhIGxldHRlci5cbmV4cG9ydCBjb25zdCBodG1sU2VsZWN0b3JSZSA9IC9eW2EtekEtWl1bLjAtOWEtekEtWl0qKDo/LVthLXpBLVpdWy4wLTlhLXpBLVpdKikqJC87XG5cbmV4cG9ydCBjb25zdCBodG1sU2VsZWN0b3JGb3JtYXQ6IHNjaGVtYS5TY2hlbWFGb3JtYXQgPSB7XG4gIG5hbWU6ICdodG1sLXNlbGVjdG9yJyxcbiAgZm9ybWF0dGVyOiB7XG4gICAgYXN5bmM6IGZhbHNlLFxuICAgIHZhbGlkYXRlOiAoc2VsZWN0b3I6IHN0cmluZykgPT4gaHRtbFNlbGVjdG9yUmUudGVzdChzZWxlY3RvciksXG4gIH0sXG59O1xuIl19