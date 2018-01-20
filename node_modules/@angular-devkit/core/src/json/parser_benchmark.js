"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const benchmark_1 = require("@_/benchmark");
const parser_1 = require("./parser");
const testCase = {
    'hello': [0, 1, 'world', 2],
    'world': {
        'great': 123E-12,
    },
};
const testCaseJson = JSON.stringify(testCase);
describe('parserJson', () => {
    benchmark_1.benchmark('parseJsonAst', () => parser_1.parseJsonAst(testCaseJson), () => JSON.parse(testCaseJson));
    benchmark_1.benchmark('parseJson', () => parser_1.parseJson(testCaseJson));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyX2JlbmNobWFyay5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9jb3JlL3NyYy9qc29uL3BhcnNlcl9iZW5jaG1hcmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCw0Q0FBeUM7QUFDekMscUNBQW1EO0FBR25ELE1BQU0sUUFBUSxHQUFHO0lBQ2YsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO0lBQzNCLE9BQU8sRUFBRTtRQUNQLE9BQU8sRUFBRSxPQUFPO0tBQ2pCO0NBQ0YsQ0FBQztBQUNGLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7QUFHOUMsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7SUFDMUIscUJBQVMsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFLENBQUMscUJBQVksQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDNUYscUJBQVMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLENBQUMsa0JBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBQ3hELENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgYmVuY2htYXJrIH0gZnJvbSAnQF8vYmVuY2htYXJrJztcbmltcG9ydCB7IHBhcnNlSnNvbiwgcGFyc2VKc29uQXN0IH0gZnJvbSAnLi9wYXJzZXInO1xuXG5cbmNvbnN0IHRlc3RDYXNlID0ge1xuICAnaGVsbG8nOiBbMCwgMSwgJ3dvcmxkJywgMl0sXG4gICd3b3JsZCc6IHtcbiAgICAnZ3JlYXQnOiAxMjNFLTEyLFxuICB9LFxufTtcbmNvbnN0IHRlc3RDYXNlSnNvbiA9IEpTT04uc3RyaW5naWZ5KHRlc3RDYXNlKTtcblxuXG5kZXNjcmliZSgncGFyc2VySnNvbicsICgpID0+IHtcbiAgYmVuY2htYXJrKCdwYXJzZUpzb25Bc3QnLCAoKSA9PiBwYXJzZUpzb25Bc3QodGVzdENhc2VKc29uKSwgKCkgPT4gSlNPTi5wYXJzZSh0ZXN0Q2FzZUpzb24pKTtcbiAgYmVuY2htYXJrKCdwYXJzZUpzb24nLCAoKSA9PiBwYXJzZUpzb24odGVzdENhc2VKc29uKSk7XG59KTtcbiJdfQ==