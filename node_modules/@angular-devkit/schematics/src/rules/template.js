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
const base_1 = require("./base");
const template_1 = require("./template/template");
const is_binary_1 = require("./utils/is-binary");
class OptionIsNotDefinedException extends core_1.BaseException {
    constructor(name) { super(`Option "${name}" is not defined.`); }
}
exports.OptionIsNotDefinedException = OptionIsNotDefinedException;
class UnknownPipeException extends core_1.BaseException {
    constructor(name) { super(`Pipe "${name}" is not defined.`); }
}
exports.UnknownPipeException = UnknownPipeException;
class InvalidPipeException extends core_1.BaseException {
    constructor(name) { super(`Pipe "${name}" is invalid.`); }
}
exports.InvalidPipeException = InvalidPipeException;
exports.kPathTemplateComponentRE = /__([^_]+)__/g;
exports.kPathTemplatePipeRE = /@([^@]+)/;
function applyContentTemplate(options) {
    return (entry) => {
        const { path, content } = entry;
        if (is_binary_1.isBinary(content)) {
            return entry;
        }
        return {
            path: path,
            content: new Buffer(template_1.template(content.toString('utf-8'), {})(options)),
        };
    };
}
exports.applyContentTemplate = applyContentTemplate;
function contentTemplate(options) {
    return base_1.forEach(applyContentTemplate(options));
}
exports.contentTemplate = contentTemplate;
function applyPathTemplate(options) {
    return (entry) => {
        let path = entry.path;
        const content = entry.content;
        const original = path;
        // Path template.
        path = core_1.normalize(path.replace(exports.kPathTemplateComponentRE, (_, match) => {
            const [name, ...pipes] = match.split(exports.kPathTemplatePipeRE);
            const value = typeof options[name] == 'function'
                ? options[name].call(options, original)
                : options[name];
            if (value === undefined) {
                throw new OptionIsNotDefinedException(name);
            }
            return pipes.reduce((acc, pipe) => {
                if (!pipe) {
                    return acc;
                }
                if (!(pipe in options)) {
                    throw new UnknownPipeException(pipe);
                }
                if (typeof options[pipe] != 'function') {
                    throw new InvalidPipeException(pipe);
                }
                // Coerce to string.
                return '' + options[pipe](acc);
            }, '' + value);
        }));
        return { path, content };
    };
}
exports.applyPathTemplate = applyPathTemplate;
function pathTemplate(options) {
    return base_1.forEach(applyPathTemplate(options));
}
exports.pathTemplate = pathTemplate;
function template(options) {
    return base_1.chain([
        contentTemplate(options),
        pathTemplate(options),
    ]);
}
exports.template = template;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy9zcmMvcnVsZXMvdGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FBZ0U7QUFHaEUsaUNBQXdDO0FBQ3hDLGtEQUErRDtBQUMvRCxpREFBNkM7QUFHN0MsaUNBQXlDLFNBQVEsb0JBQWE7SUFDNUQsWUFBWSxJQUFZLElBQUksS0FBSyxDQUFDLFdBQVcsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN6RTtBQUZELGtFQUVDO0FBR0QsMEJBQWtDLFNBQVEsb0JBQWE7SUFDckQsWUFBWSxJQUFZLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN2RTtBQUZELG9EQUVDO0FBR0QsMEJBQWtDLFNBQVEsb0JBQWE7SUFDckQsWUFBWSxJQUFZLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDbkU7QUFGRCxvREFFQztBQUdZLFFBQUEsd0JBQXdCLEdBQUcsY0FBYyxDQUFDO0FBQzFDLFFBQUEsbUJBQW1CLEdBQUcsVUFBVSxDQUFDO0FBVTlDLDhCQUFnRSxPQUFVO0lBQ3hFLE1BQU0sQ0FBQyxDQUFDLEtBQWdCO1FBQ3RCLE1BQU0sRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLG9CQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsTUFBTSxDQUFDO1lBQ0wsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsSUFBSSxNQUFNLENBQUMsbUJBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFFLENBQUM7SUFDSixDQUFDLENBQUM7QUFDSixDQUFDO0FBWkQsb0RBWUM7QUFHRCx5QkFBMkQsT0FBVTtJQUNuRSxNQUFNLENBQUMsY0FBTyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUZELDBDQUVDO0FBR0QsMkJBQTZELE9BQVU7SUFDckUsTUFBTSxDQUFDLENBQUMsS0FBZ0I7UUFDdEIsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN0QixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQztRQUV0QixpQkFBaUI7UUFDakIsSUFBSSxHQUFHLGdCQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQ0FBd0IsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLO1lBQy9ELE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLDJCQUFtQixDQUFDLENBQUM7WUFDMUQsTUFBTSxLQUFLLEdBQUcsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVTtrQkFDM0MsT0FBTyxDQUFDLElBQUksQ0FBMEIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztrQkFDL0QsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWxCLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLElBQUksMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUMsQ0FBQztZQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBVyxFQUFFLElBQVk7Z0JBQzVDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDVixNQUFNLENBQUMsR0FBRyxDQUFDO2dCQUNiLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZCLE1BQU0sSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkMsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN2QyxNQUFNLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLENBQUM7Z0JBRUQsb0JBQW9CO2dCQUNwQixNQUFNLENBQUMsRUFBRSxHQUFJLE9BQU8sQ0FBQyxJQUFJLENBQTBCLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0QsQ0FBQyxFQUFFLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUosTUFBTSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBQzNCLENBQUMsQ0FBQztBQUNKLENBQUM7QUFuQ0QsOENBbUNDO0FBR0Qsc0JBQXdELE9BQVU7SUFDaEUsTUFBTSxDQUFDLGNBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFGRCxvQ0FFQztBQUdELGtCQUFvRCxPQUFVO0lBQzVELE1BQU0sQ0FBQyxZQUFLLENBQUM7UUFDWCxlQUFlLENBQUMsT0FBTyxDQUFDO1FBQ3hCLFlBQVksQ0FBQyxPQUFPLENBQUM7S0FDdEIsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUxELDRCQUtDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgQmFzZUV4Y2VwdGlvbiwgbm9ybWFsaXplIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgRmlsZU9wZXJhdG9yLCBSdWxlIH0gZnJvbSAnLi4vZW5naW5lL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBGaWxlRW50cnkgfSBmcm9tICcuLi90cmVlL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBjaGFpbiwgZm9yRWFjaCB9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgeyB0ZW1wbGF0ZSBhcyB0ZW1wbGF0ZUltcGwgfSBmcm9tICcuL3RlbXBsYXRlL3RlbXBsYXRlJztcbmltcG9ydCB7IGlzQmluYXJ5IH0gZnJvbSAnLi91dGlscy9pcy1iaW5hcnknO1xuXG5cbmV4cG9ydCBjbGFzcyBPcHRpb25Jc05vdERlZmluZWRFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7IHN1cGVyKGBPcHRpb24gXCIke25hbWV9XCIgaXMgbm90IGRlZmluZWQuYCk7IH1cbn1cblxuXG5leHBvcnQgY2xhc3MgVW5rbm93blBpcGVFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7IHN1cGVyKGBQaXBlIFwiJHtuYW1lfVwiIGlzIG5vdCBkZWZpbmVkLmApOyB9XG59XG5cblxuZXhwb3J0IGNsYXNzIEludmFsaWRQaXBlRXhjZXB0aW9uIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykgeyBzdXBlcihgUGlwZSBcIiR7bmFtZX1cIiBpcyBpbnZhbGlkLmApOyB9XG59XG5cblxuZXhwb3J0IGNvbnN0IGtQYXRoVGVtcGxhdGVDb21wb25lbnRSRSA9IC9fXyhbXl9dKylfXy9nO1xuZXhwb3J0IGNvbnN0IGtQYXRoVGVtcGxhdGVQaXBlUkUgPSAvQChbXkBdKykvO1xuXG5cbmV4cG9ydCB0eXBlIFRlbXBsYXRlVmFsdWUgPSBib29sZWFuIHwgc3RyaW5nIHwgbnVtYmVyO1xuZXhwb3J0IHR5cGUgVGVtcGxhdGVQaXBlRnVuY3Rpb24gPSAoeDogc3RyaW5nKSA9PiBUZW1wbGF0ZVZhbHVlO1xuZXhwb3J0IHR5cGUgVGVtcGxhdGVPcHRpb25zID0ge1xuICBba2V5OiBzdHJpbmddOiBUZW1wbGF0ZVZhbHVlIHwgVGVtcGxhdGVPcHRpb25zIHwgVGVtcGxhdGVQaXBlRnVuY3Rpb24sXG59O1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUNvbnRlbnRUZW1wbGF0ZTxUIGV4dGVuZHMgVGVtcGxhdGVPcHRpb25zPihvcHRpb25zOiBUKTogRmlsZU9wZXJhdG9yIHtcbiAgcmV0dXJuIChlbnRyeTogRmlsZUVudHJ5KSA9PiB7XG4gICAgY29uc3Qge3BhdGgsIGNvbnRlbnR9ID0gZW50cnk7XG4gICAgaWYgKGlzQmluYXJ5KGNvbnRlbnQpKSB7XG4gICAgICByZXR1cm4gZW50cnk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhdGg6IHBhdGgsXG4gICAgICBjb250ZW50OiBuZXcgQnVmZmVyKHRlbXBsYXRlSW1wbChjb250ZW50LnRvU3RyaW5nKCd1dGYtOCcpLCB7fSkob3B0aW9ucykpLFxuICAgIH07XG4gIH07XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRlbnRUZW1wbGF0ZTxUIGV4dGVuZHMgVGVtcGxhdGVPcHRpb25zPihvcHRpb25zOiBUKTogUnVsZSB7XG4gIHJldHVybiBmb3JFYWNoKGFwcGx5Q29udGVudFRlbXBsYXRlKG9wdGlvbnMpKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlQYXRoVGVtcGxhdGU8VCBleHRlbmRzIFRlbXBsYXRlT3B0aW9ucz4ob3B0aW9uczogVCk6IEZpbGVPcGVyYXRvciB7XG4gIHJldHVybiAoZW50cnk6IEZpbGVFbnRyeSkgPT4ge1xuICAgIGxldCBwYXRoID0gZW50cnkucGF0aDtcbiAgICBjb25zdCBjb250ZW50ID0gZW50cnkuY29udGVudDtcbiAgICBjb25zdCBvcmlnaW5hbCA9IHBhdGg7XG5cbiAgICAvLyBQYXRoIHRlbXBsYXRlLlxuICAgIHBhdGggPSBub3JtYWxpemUocGF0aC5yZXBsYWNlKGtQYXRoVGVtcGxhdGVDb21wb25lbnRSRSwgKF8sIG1hdGNoKSA9PiB7XG4gICAgICBjb25zdCBbbmFtZSwgLi4ucGlwZXNdID0gbWF0Y2guc3BsaXQoa1BhdGhUZW1wbGF0ZVBpcGVSRSk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHR5cGVvZiBvcHRpb25zW25hbWVdID09ICdmdW5jdGlvbidcbiAgICAgICAgPyAob3B0aW9uc1tuYW1lXSBhcyBUZW1wbGF0ZVBpcGVGdW5jdGlvbikuY2FsbChvcHRpb25zLCBvcmlnaW5hbClcbiAgICAgICAgOiBvcHRpb25zW25hbWVdO1xuXG4gICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgT3B0aW9uSXNOb3REZWZpbmVkRXhjZXB0aW9uKG5hbWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGlwZXMucmVkdWNlKChhY2M6IHN0cmluZywgcGlwZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmICghcGlwZSkge1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEocGlwZSBpbiBvcHRpb25zKSkge1xuICAgICAgICAgIHRocm93IG5ldyBVbmtub3duUGlwZUV4Y2VwdGlvbihwaXBlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnNbcGlwZV0gIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkUGlwZUV4Y2VwdGlvbihwaXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvZXJjZSB0byBzdHJpbmcuXG4gICAgICAgIHJldHVybiAnJyArIChvcHRpb25zW3BpcGVdIGFzIFRlbXBsYXRlUGlwZUZ1bmN0aW9uKShhY2MpO1xuICAgICAgfSwgJycgKyB2YWx1ZSk7XG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHsgcGF0aCwgY29udGVudCB9O1xuICB9O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRoVGVtcGxhdGU8VCBleHRlbmRzIFRlbXBsYXRlT3B0aW9ucz4ob3B0aW9uczogVCk6IFJ1bGUge1xuICByZXR1cm4gZm9yRWFjaChhcHBseVBhdGhUZW1wbGF0ZShvcHRpb25zKSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRlbXBsYXRlPFQgZXh0ZW5kcyBUZW1wbGF0ZU9wdGlvbnM+KG9wdGlvbnM6IFQpOiBSdWxlIHtcbiAgcmV0dXJuIGNoYWluKFtcbiAgICBjb250ZW50VGVtcGxhdGUob3B0aW9ucyksXG4gICAgcGF0aFRlbXBsYXRlKG9wdGlvbnMpLFxuICBdKTtcbn1cbiJdfQ==