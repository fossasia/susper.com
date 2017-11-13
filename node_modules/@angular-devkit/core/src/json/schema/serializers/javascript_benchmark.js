"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// tslint:disable:no-any
const benchmark_1 = require("@_/benchmark");
const json_schema_1 = require("@ngtools/json-schema");
const fs = require("fs");
const path = require("path");
const registry_1 = require("../registry");
const javascript_1 = require("./javascript");
describe('JavaScript Serializer', () => {
    // Schema for the Angular-CLI config.
    const jsonPath = path.join(global._DevKitRoot, 'tests/@angular_devkit/core/json/schema/serializers/schema_benchmark.json');
    const jsonContent = fs.readFileSync(jsonPath).toString();
    const complexSchema = JSON.parse(jsonContent);
    const registry = new registry_1.JsonSchemaRegistry();
    registry.addSchema('', complexSchema);
    benchmark_1.benchmark('schema parsing', () => {
        new javascript_1.JavascriptSerializer().serialize('', registry)({});
    }, () => {
        const SchemaMetaClass = json_schema_1.SchemaClassFactory(complexSchema);
        const schemaClass = new SchemaMetaClass({});
        schemaClass.$$root();
    });
    (function () {
        const registry = new registry_1.JsonSchemaRegistry();
        registry.addSchema('', complexSchema);
        const coreRoot = new javascript_1.JavascriptSerializer().serialize('', registry)({});
        const SchemaMetaClass = json_schema_1.SchemaClassFactory(complexSchema);
        const schemaClass = new SchemaMetaClass({});
        const ngtoolsRoot = schemaClass.$$root();
        benchmark_1.benchmark('schema access', () => {
            coreRoot.project = { name: 'abc' };
        }, () => {
            ngtoolsRoot.project = { name: 'abc' };
        });
    })();
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YXNjcmlwdF9iZW5jaG1hcmsuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvanNvbi9zY2hlbWEvc2VyaWFsaXplcnMvamF2YXNjcmlwdF9iZW5jaG1hcmsudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCx3QkFBd0I7QUFDeEIsNENBQXlDO0FBQ3pDLHNEQUEwRDtBQUMxRCx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDBDQUFpRDtBQUVqRCw2Q0FBb0Q7QUFFcEQsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLHFDQUFxQztJQUNyQyxNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUN2QixNQUFjLENBQUMsV0FBVyxFQUMzQiwwRUFBMEUsQ0FDM0UsQ0FBQztJQUNGLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekQsTUFBTSxhQUFhLEdBQWUsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUUxRCxNQUFNLFFBQVEsR0FBRyxJQUFJLDZCQUFrQixFQUFFLENBQUM7SUFDMUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFFdEMscUJBQVMsQ0FBQyxnQkFBZ0IsRUFBRTtRQUMxQixJQUFJLGlDQUFvQixFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUN6RCxDQUFDLEVBQUU7UUFDRCxNQUFNLGVBQWUsR0FBRyxnQ0FBa0IsQ0FBTSxhQUFhLENBQUMsQ0FBQztRQUMvRCxNQUFNLFdBQVcsR0FBRyxJQUFJLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM1QyxXQUFXLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQUM7SUFFSCxDQUFDO1FBQ0MsTUFBTSxRQUFRLEdBQUcsSUFBSSw2QkFBa0IsRUFBRSxDQUFDO1FBQzFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sUUFBUSxHQUFHLElBQUksaUNBQW9CLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXhFLE1BQU0sZUFBZSxHQUFHLGdDQUFrQixDQUFNLGFBQWEsQ0FBQyxDQUFDO1FBQy9ELE1BQU0sV0FBVyxHQUFHLElBQUksZUFBZSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUV6QyxxQkFBUyxDQUFDLGVBQWUsRUFBRTtZQUN6QixRQUFRLENBQUMsT0FBTyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO1FBQ3JDLENBQUMsRUFBRTtZQUNELFdBQVcsQ0FBQyxPQUFPLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsRUFBRSxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZTpuby1hbnlcbmltcG9ydCB7IGJlbmNobWFyayB9IGZyb20gJ0BfL2JlbmNobWFyayc7XG5pbXBvcnQgeyBTY2hlbWFDbGFzc0ZhY3RvcnkgfSBmcm9tICdAbmd0b29scy9qc29uLXNjaGVtYSc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgSnNvblNjaGVtYVJlZ2lzdHJ5IH0gZnJvbSAnLi4vcmVnaXN0cnknO1xuaW1wb3J0IHsgSnNvblNjaGVtYSB9IGZyb20gJy4uL3NjaGVtYSc7XG5pbXBvcnQgeyBKYXZhc2NyaXB0U2VyaWFsaXplciB9IGZyb20gJy4vamF2YXNjcmlwdCc7XG5cbmRlc2NyaWJlKCdKYXZhU2NyaXB0IFNlcmlhbGl6ZXInLCAoKSA9PiB7XG4gIC8vIFNjaGVtYSBmb3IgdGhlIEFuZ3VsYXItQ0xJIGNvbmZpZy5cbiAgY29uc3QganNvblBhdGggPSBwYXRoLmpvaW4oXG4gICAgKGdsb2JhbCBhcyBhbnkpLl9EZXZLaXRSb290LFxuICAgICd0ZXN0cy9AYW5ndWxhcl9kZXZraXQvY29yZS9qc29uL3NjaGVtYS9zZXJpYWxpemVycy9zY2hlbWFfYmVuY2htYXJrLmpzb24nLFxuICApO1xuICBjb25zdCBqc29uQ29udGVudCA9IGZzLnJlYWRGaWxlU3luYyhqc29uUGF0aCkudG9TdHJpbmcoKTtcbiAgY29uc3QgY29tcGxleFNjaGVtYTogSnNvblNjaGVtYSA9IEpTT04ucGFyc2UoanNvbkNvbnRlbnQpO1xuXG4gIGNvbnN0IHJlZ2lzdHJ5ID0gbmV3IEpzb25TY2hlbWFSZWdpc3RyeSgpO1xuICByZWdpc3RyeS5hZGRTY2hlbWEoJycsIGNvbXBsZXhTY2hlbWEpO1xuXG4gIGJlbmNobWFyaygnc2NoZW1hIHBhcnNpbmcnLCAoKSA9PiB7XG4gICAgbmV3IEphdmFzY3JpcHRTZXJpYWxpemVyKCkuc2VyaWFsaXplKCcnLCByZWdpc3RyeSkoe30pO1xuICB9LCAoKSA9PiB7XG4gICAgY29uc3QgU2NoZW1hTWV0YUNsYXNzID0gU2NoZW1hQ2xhc3NGYWN0b3J5PGFueT4oY29tcGxleFNjaGVtYSk7XG4gICAgY29uc3Qgc2NoZW1hQ2xhc3MgPSBuZXcgU2NoZW1hTWV0YUNsYXNzKHt9KTtcbiAgICBzY2hlbWFDbGFzcy4kJHJvb3QoKTtcbiAgfSk7XG5cbiAgKGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHJlZ2lzdHJ5ID0gbmV3IEpzb25TY2hlbWFSZWdpc3RyeSgpO1xuICAgIHJlZ2lzdHJ5LmFkZFNjaGVtYSgnJywgY29tcGxleFNjaGVtYSk7XG4gICAgY29uc3QgY29yZVJvb3QgPSBuZXcgSmF2YXNjcmlwdFNlcmlhbGl6ZXIoKS5zZXJpYWxpemUoJycsIHJlZ2lzdHJ5KSh7fSk7XG5cbiAgICBjb25zdCBTY2hlbWFNZXRhQ2xhc3MgPSBTY2hlbWFDbGFzc0ZhY3Rvcnk8YW55Pihjb21wbGV4U2NoZW1hKTtcbiAgICBjb25zdCBzY2hlbWFDbGFzcyA9IG5ldyBTY2hlbWFNZXRhQ2xhc3Moe30pO1xuICAgIGNvbnN0IG5ndG9vbHNSb290ID0gc2NoZW1hQ2xhc3MuJCRyb290KCk7XG5cbiAgICBiZW5jaG1hcmsoJ3NjaGVtYSBhY2Nlc3MnLCAoKSA9PiB7XG4gICAgICBjb3JlUm9vdC5wcm9qZWN0ID0geyBuYW1lOiAnYWJjJyB9O1xuICAgIH0sICgpID0+IHtcbiAgICAgIG5ndG9vbHNSb290LnByb2plY3QgPSB7IG5hbWU6ICdhYmMnIH07XG4gICAgfSk7XG4gIH0pKCk7XG59KTtcbiJdfQ==