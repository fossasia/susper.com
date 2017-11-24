"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const ts = require("typescript");
const ast_utils_1 = require("./ast-utils");
const change_1 = require("./change");
/**
* Add Import `import { symbolName } from fileName` if the import doesn't exit
* already. Assumes fileToEdit can be resolved and accessed.
* @param fileToEdit (file we want to add import to)
* @param symbolName (item to import)
* @param fileName (path to the file)
* @param isDefault (if true, import follows style for importing default exports)
* @return Change
*/
function insertImport(source, fileToEdit, symbolName, fileName, isDefault = false) {
    const rootNode = source;
    const allImports = ast_utils_1.findNodes(rootNode, ts.SyntaxKind.ImportDeclaration);
    // get nodes that map to import statements from the file fileName
    const relevantImports = allImports.filter(node => {
        // StringLiteral of the ImportDeclaration is the import file (fileName in this case).
        const importFiles = node.getChildren()
            .filter(child => child.kind === ts.SyntaxKind.StringLiteral)
            .map(n => n.text);
        return importFiles.filter(file => file === fileName).length === 1;
    });
    if (relevantImports.length > 0) {
        let importsAsterisk = false;
        // imports from import file
        const imports = [];
        relevantImports.forEach(n => {
            Array.prototype.push.apply(imports, ast_utils_1.findNodes(n, ts.SyntaxKind.Identifier));
            if (ast_utils_1.findNodes(n, ts.SyntaxKind.AsteriskToken).length > 0) {
                importsAsterisk = true;
            }
        });
        // if imports * from fileName, don't add symbolName
        if (importsAsterisk) {
            return new change_1.NoopChange();
        }
        const importTextNodes = imports.filter(n => n.text === symbolName);
        // insert import if it's not there
        if (importTextNodes.length === 0) {
            const fallbackPos = ast_utils_1.findNodes(relevantImports[0], ts.SyntaxKind.CloseBraceToken)[0].getStart() ||
                ast_utils_1.findNodes(relevantImports[0], ts.SyntaxKind.FromKeyword)[0].getStart();
            return ast_utils_1.insertAfterLastOccurrence(imports, `, ${symbolName}`, fileToEdit, fallbackPos);
        }
        return new change_1.NoopChange();
    }
    // no such import declaration exists
    const useStrict = ast_utils_1.findNodes(rootNode, ts.SyntaxKind.StringLiteral)
        .filter((n) => n.text === 'use strict');
    let fallbackPos = 0;
    if (useStrict.length > 0) {
        fallbackPos = useStrict[0].end;
    }
    const open = isDefault ? '' : '{ ';
    const close = isDefault ? '' : ' }';
    // if there are no imports or 'use strict' statement, insert import at beginning of file
    const insertAtBeginning = allImports.length === 0 && useStrict.length === 0;
    const separator = insertAtBeginning ? '' : ';\n';
    const toInsert = `${separator}import ${open}${symbolName}${close}` +
        ` from '${fileName}'${insertAtBeginning ? ';\n' : ''}`;
    return ast_utils_1.insertAfterLastOccurrence(allImports, toInsert, fileToEdit, fallbackPos, ts.SyntaxKind.StringLiteral);
}
exports.insertImport = insertImport;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9hbmd1bGFyL3V0aWxpdHkvcm91dGUtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxpQ0FBaUM7QUFDakMsMkNBQW1FO0FBQ25FLHFDQUE4QztBQUc5Qzs7Ozs7Ozs7RUFRRTtBQUVGLHNCQUE2QixNQUFxQixFQUFFLFVBQWtCLEVBQUUsVUFBa0IsRUFDN0QsUUFBZ0IsRUFBRSxTQUFTLEdBQUcsS0FBSztJQUM5RCxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUM7SUFDeEIsTUFBTSxVQUFVLEdBQUcscUJBQVMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBRXhFLGlFQUFpRTtJQUNqRSxNQUFNLGVBQWUsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUk7UUFDNUMscUZBQXFGO1FBQ3JGLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUU7YUFDbkMsTUFBTSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDO2FBQzNELEdBQUcsQ0FBQyxDQUFDLElBQUssQ0FBc0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUxQyxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUM7SUFDcEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsQ0FBQyxlQUFlLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQzVCLDJCQUEyQjtRQUMzQixNQUFNLE9B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ZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgeyBmaW5kTm9kZXMsIGluc2VydEFmdGVyTGFzdE9jY3VycmVuY2UgfSBmcm9tICcuL2FzdC11dGlscyc7XG5pbXBvcnQgeyBDaGFuZ2UsIE5vb3BDaGFuZ2UgfSBmcm9tICcuL2NoYW5nZSc7XG5cblxuLyoqXG4qIEFkZCBJbXBvcnQgYGltcG9ydCB7IHN5bWJvbE5hbWUgfSBmcm9tIGZpbGVOYW1lYCBpZiB0aGUgaW1wb3J0IGRvZXNuJ3QgZXhpdFxuKiBhbHJlYWR5LiBBc3N1bWVzIGZpbGVUb0VkaXQgY2FuIGJlIHJlc29sdmVkIGFuZCBhY2Nlc3NlZC5cbiogQHBhcmFtIGZpbGVUb0VkaXQgKGZpbGUgd2Ugd2FudCB0byBhZGQgaW1wb3J0IHRvKVxuKiBAcGFyYW0gc3ltYm9sTmFtZSAoaXRlbSB0byBpbXBvcnQpXG4qIEBwYXJhbSBmaWxlTmFtZSAocGF0aCB0byB0aGUgZmlsZSlcbiogQHBhcmFtIGlzRGVmYXVsdCAoaWYgdHJ1ZSwgaW1wb3J0IGZvbGxvd3Mgc3R5bGUgZm9yIGltcG9ydGluZyBkZWZhdWx0IGV4cG9ydHMpXG4qIEByZXR1cm4gQ2hhbmdlXG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gaW5zZXJ0SW1wb3J0KHNvdXJjZTogdHMuU291cmNlRmlsZSwgZmlsZVRvRWRpdDogc3RyaW5nLCBzeW1ib2xOYW1lOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbGVOYW1lOiBzdHJpbmcsIGlzRGVmYXVsdCA9IGZhbHNlKTogQ2hhbmdlIHtcbiAgY29uc3Qgcm9vdE5vZGUgPSBzb3VyY2U7XG4gIGNvbnN0IGFsbEltcG9ydHMgPSBmaW5kTm9kZXMocm9vdE5vZGUsIHRzLlN5bnRheEtpbmQuSW1wb3J0RGVjbGFyYXRpb24pO1xuXG4gIC8vIGdldCBub2RlcyB0aGF0IG1hcCB0byBpbXBvcnQgc3RhdGVtZW50cyBmcm9tIHRoZSBmaWxlIGZpbGVOYW1lXG4gIGNvbnN0IHJlbGV2YW50SW1wb3J0cyA9IGFsbEltcG9ydHMuZmlsdGVyKG5vZGUgPT4ge1xuICAgIC8vIFN0cmluZ0xpdGVyYWwgb2YgdGhlIEltcG9ydERlY2xhcmF0aW9uIGlzIHRoZSBpbXBvcnQgZmlsZSAoZmlsZU5hbWUgaW4gdGhpcyBjYXNlKS5cbiAgICBjb25zdCBpbXBvcnRGaWxlcyA9IG5vZGUuZ2V0Q2hpbGRyZW4oKVxuICAgICAgLmZpbHRlcihjaGlsZCA9PiBjaGlsZC5raW5kID09PSB0cy5TeW50YXhLaW5kLlN0cmluZ0xpdGVyYWwpXG4gICAgICAubWFwKG4gPT4gKG4gYXMgdHMuU3RyaW5nTGl0ZXJhbCkudGV4dCk7XG5cbiAgICByZXR1cm4gaW1wb3J0RmlsZXMuZmlsdGVyKGZpbGUgPT4gZmlsZSA9PT0gZmlsZU5hbWUpLmxlbmd0aCA9PT0gMTtcbiAgfSk7XG5cbiAgaWYgKHJlbGV2YW50SW1wb3J0cy5sZW5ndGggPiAwKSB7XG4gICAgbGV0IGltcG9ydHNBc3RlcmlzayA9IGZhbHNlO1xuICAgIC8vIGltcG9ydHMgZnJvbSBpbXBvcnQgZmlsZVxuICAgIGNvbnN0IGltcG9ydHM6IHRzLk5vZGVbXSA9IFtdO1xuICAgIHJlbGV2YW50SW1wb3J0cy5mb3JFYWNoKG4gPT4ge1xuICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkoaW1wb3J0cywgZmluZE5vZGVzKG4sIHRzLlN5bnRheEtpbmQuSWRlbnRpZmllcikpO1xuICAgICAgaWYgKGZpbmROb2RlcyhuLCB0cy5TeW50YXhLaW5kLkFzdGVyaXNrVG9rZW4pLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaW1wb3J0c0FzdGVyaXNrID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIGlmIGltcG9ydHMgKiBmcm9tIGZpbGVOYW1lLCBkb24ndCBhZGQgc3ltYm9sTmFtZVxuICAgIGlmIChpbXBvcnRzQXN0ZXJpc2spIHtcbiAgICAgIHJldHVybiBuZXcgTm9vcENoYW5nZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGltcG9ydFRleHROb2RlcyA9IGltcG9ydHMuZmlsdGVyKG4gPT4gKG4gYXMgdHMuSWRlbnRpZmllcikudGV4dCA9PT0gc3ltYm9sTmFtZSk7XG5cbiAgICAvLyBpbnNlcnQgaW1wb3J0IGlmIGl0J3Mgbm90IHRoZXJlXG4gICAgaWYgKGltcG9ydFRleHROb2Rlcy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGZhbGxiYWNrUG9zID1cbiAgICAgICAgZmluZE5vZGVzKHJlbGV2YW50SW1wb3J0c1swXSwgdHMuU3ludGF4S2luZC5DbG9zZUJyYWNlVG9rZW4pWzBdLmdldFN0YXJ0KCkgfHxcbiAgICAgICAgZmluZE5vZGVzKHJlbGV2YW50SW1wb3J0c1swXSwgdHMuU3ludGF4S2luZC5Gcm9tS2V5d29yZClbMF0uZ2V0U3RhcnQoKTtcblxuICAgICAgcmV0dXJuIGluc2VydEFmdGVyTGFzdE9jY3VycmVuY2UoaW1wb3J0cywgYCwgJHtzeW1ib2xOYW1lfWAsIGZpbGVUb0VkaXQsIGZhbGxiYWNrUG9zKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IE5vb3BDaGFuZ2UoKTtcbiAgfVxuXG4gIC8vIG5vIHN1Y2ggaW1wb3J0IGRlY2xhcmF0aW9uIGV4aXN0c1xuICBjb25zdCB1c2VTdHJpY3QgPSBmaW5kTm9kZXMocm9vdE5vZGUsIHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbClcbiAgICAgICAgICAgICAgICAgICAgLmZpbHRlcigobjogdHMuU3RyaW5nTGl0ZXJhbCkgPT4gbi50ZXh0ID09PSAndXNlIHN0cmljdCcpO1xuICBsZXQgZmFsbGJhY2tQb3MgPSAwO1xuICBpZiAodXNlU3RyaWN0Lmxlbmd0aCA+IDApIHtcbiAgICBmYWxsYmFja1BvcyA9IHVzZVN0cmljdFswXS5lbmQ7XG4gIH1cbiAgY29uc3Qgb3BlbiA9IGlzRGVmYXVsdCA/ICcnIDogJ3sgJztcbiAgY29uc3QgY2xvc2UgPSBpc0RlZmF1bHQgPyAnJyA6ICcgfSc7XG4gIC8vIGlmIHRoZXJlIGFyZSBubyBpbXBvcnRzIG9yICd1c2Ugc3RyaWN0JyBzdGF0ZW1lbnQsIGluc2VydCBpbXBvcnQgYXQgYmVnaW5uaW5nIG9mIGZpbGVcbiAgY29uc3QgaW5zZXJ0QXRCZWdpbm5pbmcgPSBhbGxJbXBvcnRzLmxlbmd0aCA9PT0gMCAmJiB1c2VTdHJpY3QubGVuZ3RoID09PSAwO1xuICBjb25zdCBzZXBhcmF0b3IgPSBpbnNlcnRBdEJlZ2lubmluZyA/ICcnIDogJztcXG4nO1xuICBjb25zdCB0b0luc2VydCA9IGAke3NlcGFyYXRvcn1pbXBvcnQgJHtvcGVufSR7c3ltYm9sTmFtZX0ke2Nsb3NlfWAgK1xuICAgIGAgZnJvbSAnJHtmaWxlTmFtZX0nJHtpbnNlcnRBdEJlZ2lubmluZyA/ICc7XFxuJyA6ICcnfWA7XG5cbiAgcmV0dXJuIGluc2VydEFmdGVyTGFzdE9jY3VycmVuY2UoXG4gICAgYWxsSW1wb3J0cyxcbiAgICB0b0luc2VydCxcbiAgICBmaWxlVG9FZGl0LFxuICAgIGZhbGxiYWNrUG9zLFxuICAgIHRzLlN5bnRheEtpbmQuU3RyaW5nTGl0ZXJhbCxcbiAgKTtcbn1cbiJdfQ==