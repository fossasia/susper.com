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
const schematics_1 = require("@angular-devkit/schematics");
function appendPropertyInAstObject(recorder, node, propertyName, value, indent = 4) {
    const indentStr = '\n' + new Array(indent + 1).join(' ');
    if (node.properties.length > 0) {
        // Insert comma.
        const last = node.properties[node.properties.length - 1];
        recorder.insertRight(last.start.offset + last.text.replace(/\s+$/, '').length, ',');
    }
    recorder.insertLeft(node.end.offset - 1, '  '
        + `"${propertyName}": ${JSON.stringify(value, null, 2).replace(/\n/g, indentStr)}`
        + indentStr.slice(0, -2));
}
function addSchematicToCollectionJson(collectionPath, schematicName, description) {
    return (tree, _context) => {
        const collectionJsonContent = tree.read(collectionPath);
        if (!collectionJsonContent) {
            throw new Error('Invalid collection path: ' + collectionPath);
        }
        const collectionJsonAst = core_1.parseJsonAst(collectionJsonContent.toString('utf-8'));
        if (collectionJsonAst.kind !== 'object') {
            throw new Error('Invalid collection content.');
        }
        for (const property of collectionJsonAst.properties) {
            if (property.key.value == 'schematics') {
                if (property.value.kind !== 'object') {
                    throw new Error('Invalid collection.json; schematics needs to be an object.');
                }
                const recorder = tree.beginUpdate(collectionPath);
                appendPropertyInAstObject(recorder, property.value, schematicName, description);
                tree.commitUpdate(recorder);
                return tree;
            }
        }
        throw new Error('Could not find the "schematics" property in collection.json.');
    };
}
function default_1(options) {
    const schematicsVersion = require('@angular-devkit/schematics/package.json').version;
    const coreVersion = require('@angular-devkit/core/package.json').version;
    // Verify if we need to create a full project, or just add a new schematic.
    return (tree, context) => {
        let collectionPath;
        try {
            const packageJsonContent = tree.read('/package.json');
            if (packageJsonContent) {
                const packageJson = JSON.parse(packageJsonContent.toString('utf-8'));
                if ('schematics' in packageJson) {
                    const p = core_1.normalize(packageJson['schematics']);
                    if (tree.exists(p)) {
                        collectionPath = p;
                    }
                }
            }
        }
        catch (_) {
        }
        let source = schematics_1.apply(schematics_1.url('./schematic-files'), [
            schematics_1.template(Object.assign({}, options, { coreVersion,
                schematicsVersion, dot: '.', camelize: core_1.camelize,
                dasherize: core_1.dasherize })),
        ]);
        // Simply create a new schematic project.
        if (!collectionPath) {
            collectionPath = core_1.normalize('/' + options.name + '/src/collection.json');
            source = schematics_1.apply(schematics_1.url('./project-files'), [
                schematics_1.template(Object.assign({}, options, { coreVersion,
                    schematicsVersion, dot: '.', camelize: core_1.camelize,
                    dasherize: core_1.dasherize })),
                schematics_1.mergeWith(source),
                schematics_1.move(options.name),
            ]);
        }
        return schematics_1.chain([
            schematics_1.mergeWith(source),
            addSchematicToCollectionJson(collectionPath, core_1.dasherize(options.name), {
                description: 'A blank schematic.',
                factory: './' + core_1.dasherize(options.name) + '/index#' + core_1.camelize(options.name),
            }),
        ])(tree, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9zY2hlbWF0aWNzL3NjaGVtYXRpY3MvYmxhbmsvZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQVM4QjtBQUM5QiwyREFXb0M7QUFJcEMsbUNBQ0UsUUFBd0IsRUFDeEIsSUFBbUIsRUFDbkIsWUFBb0IsRUFDcEIsS0FBZ0IsRUFDaEIsTUFBTSxHQUFHLENBQUM7SUFFVixNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUV6RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLGdCQUFnQjtRQUNoQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pELFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRUQsUUFBUSxDQUFDLFVBQVUsQ0FDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUNuQixJQUFJO1VBQ0YsSUFBSSxZQUFZLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEVBQUU7VUFDaEYsU0FBUyxDQUFDLEtBQUss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bGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgSnNvbkFzdE9iamVjdCxcbiAgSnNvbk9iamVjdCxcbiAgSnNvblZhbHVlLFxuICBQYXRoLFxuICBjYW1lbGl6ZSxcbiAgZGFzaGVyaXplLFxuICBub3JtYWxpemUsXG4gIHBhcnNlSnNvbkFzdCxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtcbiAgUnVsZSxcbiAgU2NoZW1hdGljQ29udGV4dCxcbiAgVHJlZSxcbiAgVXBkYXRlUmVjb3JkZXIsXG4gIGFwcGx5LFxuICBjaGFpbixcbiAgbWVyZ2VXaXRoLFxuICBtb3ZlLFxuICB0ZW1wbGF0ZSxcbiAgdXJsLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgeyBTY2hlbWEgfSBmcm9tICcuL3NjaGVtYSc7XG5cblxuZnVuY3Rpb24gYXBwZW5kUHJvcGVydHlJbkFzdE9iamVjdChcbiAgcmVjb3JkZXI6IFVwZGF0ZVJlY29yZGVyLFxuICBub2RlOiBKc29uQXN0T2JqZWN0LFxuICBwcm9wZXJ0eU5hbWU6IHN0cmluZyxcbiAgdmFsdWU6IEpzb25WYWx1ZSxcbiAgaW5kZW50ID0gNCxcbikge1xuICBjb25zdCBpbmRlbnRTdHIgPSAnXFxuJyArIG5ldyBBcnJheShpbmRlbnQgKyAxKS5qb2luKCcgJyk7XG5cbiAgaWYgKG5vZGUucHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgLy8gSW5zZXJ0IGNvbW1hLlxuICAgIGNvbnN0IGxhc3QgPSBub2RlLnByb3BlcnRpZXNbbm9kZS5wcm9wZXJ0aWVzLmxlbmd0aCAtIDFdO1xuICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGxhc3Quc3RhcnQub2Zmc2V0ICsgbGFzdC50ZXh0LnJlcGxhY2UoL1xccyskLywgJycpLmxlbmd0aCwgJywnKTtcbiAgfVxuXG4gIHJlY29yZGVyLmluc2VydExlZnQoXG4gICAgbm9kZS5lbmQub2Zmc2V0IC0gMSxcbiAgICAnICAnXG4gICAgKyBgXCIke3Byb3BlcnR5TmFtZX1cIjogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSwgbnVsbCwgMikucmVwbGFjZSgvXFxuL2csIGluZGVudFN0cil9YFxuICAgICsgaW5kZW50U3RyLnNsaWNlKDAsIC0yKSxcbiAgKTtcbn1cblxuZnVuY3Rpb24gYWRkU2NoZW1hdGljVG9Db2xsZWN0aW9uSnNvbihcbiAgY29sbGVjdGlvblBhdGg6IFBhdGgsXG4gIHNjaGVtYXRpY05hbWU6IHN0cmluZyxcbiAgZGVzY3JpcHRpb246IEpzb25PYmplY3QsXG4pOiBSdWxlIHtcbiAgcmV0dXJuICh0cmVlOiBUcmVlLCBfY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGNvbnN0IGNvbGxlY3Rpb25Kc29uQ29udGVudCA9IHRyZWUucmVhZChjb2xsZWN0aW9uUGF0aCk7XG4gICAgaWYgKCFjb2xsZWN0aW9uSnNvbkNvbnRlbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2xsZWN0aW9uIHBhdGg6ICcgKyBjb2xsZWN0aW9uUGF0aCk7XG4gICAgfVxuICAgIGNvbnN0IGNvbGxlY3Rpb25Kc29uQXN0ID0gcGFyc2VKc29uQXN0KGNvbGxlY3Rpb25Kc29uQ29udGVudC50b1N0cmluZygndXRmLTgnKSk7XG4gICAgaWYgKGNvbGxlY3Rpb25Kc29uQXN0LmtpbmQgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sbGVjdGlvbiBjb250ZW50LicpO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgcHJvcGVydHkgb2YgY29sbGVjdGlvbkpzb25Bc3QucHJvcGVydGllcykge1xuICAgICAgaWYgKHByb3BlcnR5LmtleS52YWx1ZSA9PSAnc2NoZW1hdGljcycpIHtcbiAgICAgICAgaWYgKHByb3BlcnR5LnZhbHVlLmtpbmQgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbGxlY3Rpb24uanNvbjsgc2NoZW1hdGljcyBuZWVkcyB0byBiZSBhbiBvYmplY3QuJyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCByZWNvcmRlciA9IHRyZWUuYmVnaW5VcGRhdGUoY29sbGVjdGlvblBhdGgpO1xuICAgICAgICBhcHBlbmRQcm9wZXJ0eUluQXN0T2JqZWN0KHJlY29yZGVyLCBwcm9wZXJ0eS52YWx1ZSwgc2NoZW1hdGljTmFtZSwgZGVzY3JpcHRpb24pO1xuICAgICAgICB0cmVlLmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG5cbiAgICAgICAgcmV0dXJuIHRyZWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgZmluZCB0aGUgXCJzY2hlbWF0aWNzXCIgcHJvcGVydHkgaW4gY29sbGVjdGlvbi5qc29uLicpO1xuICB9O1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIChvcHRpb25zOiBTY2hlbWEpOiBSdWxlIHtcbiAgY29uc3Qgc2NoZW1hdGljc1ZlcnNpb24gPSByZXF1aXJlKCdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcy9wYWNrYWdlLmpzb24nKS52ZXJzaW9uO1xuICBjb25zdCBjb3JlVmVyc2lvbiA9IHJlcXVpcmUoJ0Bhbmd1bGFyLWRldmtpdC9jb3JlL3BhY2thZ2UuanNvbicpLnZlcnNpb247XG5cbiAgLy8gVmVyaWZ5IGlmIHdlIG5lZWQgdG8gY3JlYXRlIGEgZnVsbCBwcm9qZWN0LCBvciBqdXN0IGFkZCBhIG5ldyBzY2hlbWF0aWMuXG4gIHJldHVybiAodHJlZTogVHJlZSwgY29udGV4dDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIGxldCBjb2xsZWN0aW9uUGF0aDogUGF0aCB8IHVuZGVmaW5lZDtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcGFja2FnZUpzb25Db250ZW50ID0gdHJlZS5yZWFkKCcvcGFja2FnZS5qc29uJyk7XG4gICAgICBpZiAocGFja2FnZUpzb25Db250ZW50KSB7XG4gICAgICAgIGNvbnN0IHBhY2thZ2VKc29uID0gSlNPTi5wYXJzZShwYWNrYWdlSnNvbkNvbnRlbnQudG9TdHJpbmcoJ3V0Zi04JykpO1xuICAgICAgICBpZiAoJ3NjaGVtYXRpY3MnIGluIHBhY2thZ2VKc29uKSB7XG4gICAgICAgICAgY29uc3QgcCA9IG5vcm1hbGl6ZShwYWNrYWdlSnNvblsnc2NoZW1hdGljcyddKTtcbiAgICAgICAgICBpZiAodHJlZS5leGlzdHMocCkpIHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb25QYXRoID0gcDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChfKSB7XG4gICAgfVxuXG4gICAgbGV0IHNvdXJjZSA9IGFwcGx5KHVybCgnLi9zY2hlbWF0aWMtZmlsZXMnKSwgW1xuICAgICAgICB0ZW1wbGF0ZSh7XG4gICAgICAgICAgLi4ub3B0aW9ucyBhcyBvYmplY3QsXG4gICAgICAgICAgY29yZVZlcnNpb24sXG4gICAgICAgICAgc2NoZW1hdGljc1ZlcnNpb24sXG4gICAgICAgICAgZG90OiAnLicsXG4gICAgICAgICAgY2FtZWxpemUsXG4gICAgICAgICAgZGFzaGVyaXplLFxuICAgICAgICB9KSxcbiAgICAgIF0pO1xuXG4gICAgLy8gU2ltcGx5IGNyZWF0ZSBhIG5ldyBzY2hlbWF0aWMgcHJvamVjdC5cbiAgICBpZiAoIWNvbGxlY3Rpb25QYXRoKSB7XG4gICAgICBjb2xsZWN0aW9uUGF0aCA9IG5vcm1hbGl6ZSgnLycgKyBvcHRpb25zLm5hbWUgKyAnL3NyYy9jb2xsZWN0aW9uLmpzb24nKTtcbiAgICAgIHNvdXJjZSA9IGFwcGx5KHVybCgnLi9wcm9qZWN0LWZpbGVzJyksIFtcbiAgICAgICAgdGVtcGxhdGUoe1xuICAgICAgICAgIC4uLm9wdGlvbnMgYXMgb2JqZWN0LFxuICAgICAgICAgIGNvcmVWZXJzaW9uLFxuICAgICAgICAgIHNjaGVtYXRpY3NWZXJzaW9uLFxuICAgICAgICAgIGRvdDogJy4nLFxuICAgICAgICAgIGNhbWVsaXplLFxuICAgICAgICAgIGRhc2hlcml6ZSxcbiAgICAgICAgfSksXG4gICAgICAgIG1lcmdlV2l0aChzb3VyY2UpLFxuICAgICAgICBtb3ZlKG9wdGlvbnMubmFtZSksXG4gICAgICBdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2hhaW4oW1xuICAgICAgbWVyZ2VXaXRoKHNvdXJjZSksXG4gICAgICBhZGRTY2hlbWF0aWNUb0NvbGxlY3Rpb25Kc29uKGNvbGxlY3Rpb25QYXRoLCBkYXNoZXJpemUob3B0aW9ucy5uYW1lKSwge1xuICAgICAgICBkZXNjcmlwdGlvbjogJ0EgYmxhbmsgc2NoZW1hdGljLicsXG4gICAgICAgIGZhY3Rvcnk6ICcuLycgKyBkYXNoZXJpemUob3B0aW9ucy5uYW1lKSArICcvaW5kZXgjJyArIGNhbWVsaXplKG9wdGlvbnMubmFtZSksXG4gICAgICB9KSxcbiAgICBdKSh0cmVlLCBjb250ZXh0KTtcbiAgfTtcbn1cbiJdfQ==