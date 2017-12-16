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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9zY2hlbWF0aWNzL3NjaGVtYXRpY3MvYmxhbmsvZmFjdG9yeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILCtDQVM4QjtBQUM5QiwyREFXb0M7QUFJcEMsbUNBQ0UsUUFBd0IsRUFDeEIsSUFBbUIsRUFDbkIsWUFBb0IsRUFDcEIsS0FBZ0IsRUFDaEIsTUFBTSxHQUFHLENBQUM7SUFFVixNQUFNLFNBQVMsR0FBRyxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUV6RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9CLGdCQUFnQjtRQUNoQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pELFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBRUQsUUFBUSxDQUFDLFVBQVUsQ0FDakIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUNuQixJQUFJO1VBQ0YsSUFBSSxZQUFZLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEVBQUU7VUFDaEYsU0FBUyxDQUFDLEtBQUss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Q29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1xuICBKc29uQXN0T2JqZWN0LFxuICBKc29uT2JqZWN0LFxuICBKc29uVmFsdWUsXG4gIFBhdGgsXG4gIGNhbWVsaXplLFxuICBkYXNoZXJpemUsXG4gIG5vcm1hbGl6ZSxcbiAgcGFyc2VKc29uQXN0LFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge1xuICBSdWxlLFxuICBTY2hlbWF0aWNDb250ZXh0LFxuICBUcmVlLFxuICBVcGRhdGVSZWNvcmRlcixcbiAgYXBwbHksXG4gIGNoYWluLFxuICBtZXJnZVdpdGgsXG4gIG1vdmUsXG4gIHRlbXBsYXRlLFxuICB1cmwsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7IFNjaGVtYSB9IGZyb20gJy4vc2NoZW1hJztcblxuXG5mdW5jdGlvbiBhcHBlbmRQcm9wZXJ0eUluQXN0T2JqZWN0KFxuICByZWNvcmRlcjogVXBkYXRlUmVjb3JkZXIsXG4gIG5vZGU6IEpzb25Bc3RPYmplY3QsXG4gIHByb3BlcnR5TmFtZTogc3RyaW5nLFxuICB2YWx1ZTogSnNvblZhbHVlLFxuICBpbmRlbnQgPSA0LFxuKSB7XG4gIGNvbnN0IGluZGVudFN0ciA9ICdcXG4nICsgbmV3IEFycmF5KGluZGVudCArIDEpLmpvaW4oJyAnKTtcblxuICBpZiAobm9kZS5wcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICAvLyBJbnNlcnQgY29tbWEuXG4gICAgY29uc3QgbGFzdCA9IG5vZGUucHJvcGVydGllc1tub2RlLnByb3BlcnRpZXMubGVuZ3RoIC0gMV07XG4gICAgcmVjb3JkZXIuaW5zZXJ0UmlnaHQobGFzdC5zdGFydC5vZmZzZXQgKyBsYXN0LnRleHQucmVwbGFjZSgvXFxzKyQvLCAnJykubGVuZ3RoLCAnLCcpO1xuICB9XG5cbiAgcmVjb3JkZXIuaW5zZXJ0TGVmdChcbiAgICBub2RlLmVuZC5vZmZzZXQgLSAxLFxuICAgICcgICdcbiAgICArIGBcIiR7cHJvcGVydHlOYW1lfVwiOiAke0pTT04uc3RyaW5naWZ5KHZhbHVlLCBudWxsLCAyKS5yZXBsYWNlKC9cXG4vZywgaW5kZW50U3RyKX1gXG4gICAgKyBpbmRlbnRTdHIuc2xpY2UoMCwgLTIpLFxuICApO1xufVxuXG5mdW5jdGlvbiBhZGRTY2hlbWF0aWNUb0NvbGxlY3Rpb25Kc29uKFxuICBjb2xsZWN0aW9uUGF0aDogUGF0aCxcbiAgc2NoZW1hdGljTmFtZTogc3RyaW5nLFxuICBkZXNjcmlwdGlvbjogSnNvbk9iamVjdCxcbik6IFJ1bGUge1xuICByZXR1cm4gKHRyZWU6IFRyZWUsIF9jb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgY29uc3QgY29sbGVjdGlvbkpzb25Db250ZW50ID0gdHJlZS5yZWFkKGNvbGxlY3Rpb25QYXRoKTtcbiAgICBpZiAoIWNvbGxlY3Rpb25Kc29uQ29udGVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbGxlY3Rpb24gcGF0aDogJyArIGNvbGxlY3Rpb25QYXRoKTtcbiAgICB9XG4gICAgY29uc3QgY29sbGVjdGlvbkpzb25Bc3QgPSBwYXJzZUpzb25Bc3QoY29sbGVjdGlvbkpzb25Db250ZW50LnRvU3RyaW5nKCd1dGYtOCcpKTtcbiAgICBpZiAoY29sbGVjdGlvbkpzb25Bc3Qua2luZCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2xsZWN0aW9uIGNvbnRlbnQuJyk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBjb2xsZWN0aW9uSnNvbkFzdC5wcm9wZXJ0aWVzKSB7XG4gICAgICBpZiAocHJvcGVydHkua2V5LnZhbHVlID09ICdzY2hlbWF0aWNzJykge1xuICAgICAgICBpZiAocHJvcGVydHkudmFsdWUua2luZCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sbGVjdGlvbi5qc29uOyBzY2hlbWF0aWNzIG5lZWRzIHRvIGJlIGFuIG9iamVjdC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlY29yZGVyID0gdHJlZS5iZWdpblVwZGF0ZShjb2xsZWN0aW9uUGF0aCk7XG4gICAgICAgIGFwcGVuZFByb3BlcnR5SW5Bc3RPYmplY3QocmVjb3JkZXIsIHByb3BlcnR5LnZhbHVlLCBzY2hlbWF0aWNOYW1lLCBkZXNjcmlwdGlvbik7XG4gICAgICAgIHRyZWUuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcblxuICAgICAgICByZXR1cm4gdHJlZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIHRoZSBcInNjaGVtYXRpY3NcIiBwcm9wZXJ0eSBpbiBjb2xsZWN0aW9uLmpzb24uJyk7XG4gIH07XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICBjb25zdCBzY2hlbWF0aWNzVmVyc2lvbiA9IHJlcXVpcmUoJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3BhY2thZ2UuanNvbicpLnZlcnNpb247XG4gIGNvbnN0IGNvcmVWZXJzaW9uID0gcmVxdWlyZSgnQGFuZ3VsYXItZGV2a2l0L2NvcmUvcGFja2FnZS5qc29uJykudmVyc2lvbjtcblxuICAvLyBWZXJpZnkgaWYgd2UgbmVlZCB0byBjcmVhdGUgYSBmdWxsIHByb2plY3QsIG9yIGp1c3QgYWRkIGEgbmV3IHNjaGVtYXRpYy5cbiAgcmV0dXJuICh0cmVlOiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgbGV0IGNvbGxlY3Rpb25QYXRoOiBQYXRoIHwgdW5kZWZpbmVkO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBwYWNrYWdlSnNvbkNvbnRlbnQgPSB0cmVlLnJlYWQoJy9wYWNrYWdlLmpzb24nKTtcbiAgICAgIGlmIChwYWNrYWdlSnNvbkNvbnRlbnQpIHtcbiAgICAgICAgY29uc3QgcGFja2FnZUpzb24gPSBKU09OLnBhcnNlKHBhY2thZ2VKc29uQ29udGVudC50b1N0cmluZygndXRmLTgnKSk7XG4gICAgICAgIGlmICgnc2NoZW1hdGljcycgaW4gcGFja2FnZUpzb24pIHtcbiAgICAgICAgICBjb25zdCBwID0gbm9ybWFsaXplKHBhY2thZ2VKc29uWydzY2hlbWF0aWNzJ10pO1xuICAgICAgICAgIGlmICh0cmVlLmV4aXN0cyhwKSkge1xuICAgICAgICAgICAgY29sbGVjdGlvblBhdGggPSBwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKF8pIHtcbiAgICB9XG5cbiAgICBsZXQgc291cmNlID0gYXBwbHkodXJsKCcuL3NjaGVtYXRpYy1maWxlcycpLCBbXG4gICAgICAgIHRlbXBsYXRlKHtcbiAgICAgICAgICAuLi5vcHRpb25zIGFzIG9iamVjdCxcbiAgICAgICAgICBjb3JlVmVyc2lvbixcbiAgICAgICAgICBzY2hlbWF0aWNzVmVyc2lvbixcbiAgICAgICAgICBkb3Q6ICcuJyxcbiAgICAgICAgICBjYW1lbGl6ZSxcbiAgICAgICAgICBkYXNoZXJpemUsXG4gICAgICAgIH0pLFxuICAgICAgXSk7XG5cbiAgICAvLyBTaW1wbHkgY3JlYXRlIGEgbmV3IHNjaGVtYXRpYyBwcm9qZWN0LlxuICAgIGlmICghY29sbGVjdGlvblBhdGgpIHtcbiAgICAgIGNvbGxlY3Rpb25QYXRoID0gbm9ybWFsaXplKCcvJyArIG9wdGlvbnMubmFtZSArICcvc3JjL2NvbGxlY3Rpb24uanNvbicpO1xuICAgICAgc291cmNlID0gYXBwbHkodXJsKCcuL3Byb2plY3QtZmlsZXMnKSwgW1xuICAgICAgICB0ZW1wbGF0ZSh7XG4gICAgICAgICAgLi4ub3B0aW9ucyBhcyBvYmplY3QsXG4gICAgICAgICAgY29yZVZlcnNpb24sXG4gICAgICAgICAgc2NoZW1hdGljc1ZlcnNpb24sXG4gICAgICAgICAgZG90OiAnLicsXG4gICAgICAgICAgY2FtZWxpemUsXG4gICAgICAgICAgZGFzaGVyaXplLFxuICAgICAgICB9KSxcbiAgICAgICAgbWVyZ2VXaXRoKHNvdXJjZSksXG4gICAgICAgIG1vdmUob3B0aW9ucy5uYW1lKSxcbiAgICAgIF0pO1xuICAgIH1cblxuICAgIHJldHVybiBjaGFpbihbXG4gICAgICBtZXJnZVdpdGgoc291cmNlKSxcbiAgICAgIGFkZFNjaGVtYXRpY1RvQ29sbGVjdGlvbkpzb24oY29sbGVjdGlvblBhdGgsIGRhc2hlcml6ZShvcHRpb25zLm5hbWUpLCB7XG4gICAgICAgIGRlc2NyaXB0aW9uOiAnQSBibGFuayBzY2hlbWF0aWMuJyxcbiAgICAgICAgZmFjdG9yeTogJy4vJyArIGRhc2hlcml6ZShvcHRpb25zLm5hbWUpICsgJy9pbmRleCMnICsgY2FtZWxpemUob3B0aW9ucy5uYW1lKSxcbiAgICAgIH0pLFxuICAgIF0pKHRyZWUsIGNvbnRleHQpO1xuICB9O1xufVxuIl19