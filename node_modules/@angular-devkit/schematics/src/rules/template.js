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
exports.kPathTemplateComponentRE = /__(.+?)__/g;
exports.kPathTemplatePipeRE = /@([^@]+)/;
function applyContentTemplate(options) {
    return (entry) => {
        const { path, content } = entry;
        if (is_binary_1.isBinary(content)) {
            return entry;
        }
        return {
            path: path,
            content: new Buffer(core_1.template(content.toString('utf-8'), {})(options)),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L3NjaGVtYXRpY3Mvc3JjL3J1bGVzL3RlbXBsYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0NBQTBGO0FBRzFGLGlDQUF3QztBQUN4QyxpREFBNkM7QUFHN0MsaUNBQXlDLFNBQVEsb0JBQWE7SUFDNUQsWUFBWSxJQUFZLElBQUksS0FBSyxDQUFDLFdBQVcsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN6RTtBQUZELGtFQUVDO0FBR0QsMEJBQWtDLFNBQVEsb0JBQWE7SUFDckQsWUFBWSxJQUFZLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUN2RTtBQUZELG9EQUVDO0FBR0QsMEJBQWtDLFNBQVEsb0JBQWE7SUFDckQsWUFBWSxJQUFZLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDbkU7QUFGRCxvREFFQztBQUdZLFFBQUEsd0JBQXdCLEdBQUcsWUFBWSxDQUFDO0FBQ3hDLFFBQUEsbUJBQW1CLEdBQUcsVUFBVSxDQUFDO0FBVTlDLDhCQUFnRSxPQUFVO0lBQ3hFLE1BQU0sQ0FBQyxDQUFDLEtBQWdCLEVBQUUsRUFBRTtRQUMxQixNQUFNLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxHQUFHLEtBQUssQ0FBQztRQUM5QixFQUFFLENBQUMsQ0FBQyxvQkFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixNQUFNLENBQUMsS0FBSyxDQUFDO1FBQ2YsQ0FBQztRQUVELE1BQU0sQ0FBQztZQUNMLElBQUksRUFBRSxJQUFJO1lBQ1YsT0FBTyxFQUFFLElBQUksTUFBTSxDQUFDLGVBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzFFLENBQUM7SUFDSixDQUFDLENBQUM7QUFDSixDQUFDO0FBWkQsb0RBWUM7QUFHRCx5QkFBMkQsT0FBVTtJQUNuRSxNQUFNLENBQUMsY0FBTyxDQUFDLG9CQUFvQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDaEQsQ0FBQztBQUZELDBDQUVDO0FBR0QsMkJBQTZELE9BQVU7SUFDckUsTUFBTSxDQUFDLENBQUMsS0FBZ0IsRUFBRSxFQUFFO1FBQzFCLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDdEIsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUM5QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFdEIsaUJBQWlCO1FBQ2pCLElBQUksR0FBRyxnQkFBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsZ0NBQXdCLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUU7WUFDbkUsTUFBTSxDQUFDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsMkJBQW1CLENBQUMsQ0FBQztZQUMxRCxNQUFNLEtBQUssR0FBRyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVO2dCQUM5QyxDQUFDLENBQUUsT0FBTyxDQUFDLElBQUksQ0FBMEIsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQztnQkFDakUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVsQixFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztnQkFDeEIsTUFBTSxJQUFJLDJCQUEyQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlDLENBQUM7WUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQVcsRUFBRSxJQUFZLEVBQUUsRUFBRTtnQkFDaEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNWLE1BQU0sQ0FBQyxHQUFHLENBQUM7Z0JBQ2IsQ0FBQztnQkFDRCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDdkIsTUFBTSxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ3ZDLE1BQU0sSUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDdkMsQ0FBQztnQkFFRCxvQkFBb0I7Z0JBQ3BCLE1BQU0sQ0FBQyxFQUFFLEdBQUksT0FBTyxDQUFDLElBQUksQ0FBMEIsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzRCxDQUFDLEVBQUUsRUFBRSxHQUFHLEtBQUssQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFSixNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7SUFDM0IsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQW5DRCw4Q0FtQ0M7QUFHRCxzQkFBd0QsT0FBVTtJQUNoRSxNQUFNLENBQUMsY0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUZELG9DQUVDO0FBR0Qsa0JBQW9ELE9BQVU7SUFDNUQsTUFBTSxDQUFDLFlBQUssQ0FBQztRQUNYLGVBQWUsQ0FBQyxPQUFPLENBQUM7UUFDeEIsWUFBWSxDQUFDLE9BQU8sQ0FBQztLQUN0QixDQUFDLENBQUM7QUFDTCxDQUFDO0FBTEQsNEJBS0MiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgeyBCYXNlRXhjZXB0aW9uLCBub3JtYWxpemUsIHRlbXBsYXRlIGFzIHRlbXBsYXRlSW1wbCB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcbmltcG9ydCB7IEZpbGVPcGVyYXRvciwgUnVsZSB9IGZyb20gJy4uL2VuZ2luZS9pbnRlcmZhY2UnO1xuaW1wb3J0IHsgRmlsZUVudHJ5IH0gZnJvbSAnLi4vdHJlZS9pbnRlcmZhY2UnO1xuaW1wb3J0IHsgY2hhaW4sIGZvckVhY2ggfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0IHsgaXNCaW5hcnkgfSBmcm9tICcuL3V0aWxzL2lzLWJpbmFyeSc7XG5cblxuZXhwb3J0IGNsYXNzIE9wdGlvbklzTm90RGVmaW5lZEV4Y2VwdGlvbiBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHsgc3VwZXIoYE9wdGlvbiBcIiR7bmFtZX1cIiBpcyBub3QgZGVmaW5lZC5gKTsgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBVbmtub3duUGlwZUV4Y2VwdGlvbiBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHsgc3VwZXIoYFBpcGUgXCIke25hbWV9XCIgaXMgbm90IGRlZmluZWQuYCk7IH1cbn1cblxuXG5leHBvcnQgY2xhc3MgSW52YWxpZFBpcGVFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7IHN1cGVyKGBQaXBlIFwiJHtuYW1lfVwiIGlzIGludmFsaWQuYCk7IH1cbn1cblxuXG5leHBvcnQgY29uc3Qga1BhdGhUZW1wbGF0ZUNvbXBvbmVudFJFID0gL19fKC4rPylfXy9nO1xuZXhwb3J0IGNvbnN0IGtQYXRoVGVtcGxhdGVQaXBlUkUgPSAvQChbXkBdKykvO1xuXG5cbmV4cG9ydCB0eXBlIFRlbXBsYXRlVmFsdWUgPSBib29sZWFuIHwgc3RyaW5nIHwgbnVtYmVyIHwgdW5kZWZpbmVkO1xuZXhwb3J0IHR5cGUgVGVtcGxhdGVQaXBlRnVuY3Rpb24gPSAoeDogc3RyaW5nKSA9PiBUZW1wbGF0ZVZhbHVlO1xuZXhwb3J0IHR5cGUgVGVtcGxhdGVPcHRpb25zID0ge1xuICBba2V5OiBzdHJpbmddOiBUZW1wbGF0ZVZhbHVlIHwgVGVtcGxhdGVPcHRpb25zIHwgVGVtcGxhdGVQaXBlRnVuY3Rpb24sXG59O1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseUNvbnRlbnRUZW1wbGF0ZTxUIGV4dGVuZHMgVGVtcGxhdGVPcHRpb25zPihvcHRpb25zOiBUKTogRmlsZU9wZXJhdG9yIHtcbiAgcmV0dXJuIChlbnRyeTogRmlsZUVudHJ5KSA9PiB7XG4gICAgY29uc3Qge3BhdGgsIGNvbnRlbnR9ID0gZW50cnk7XG4gICAgaWYgKGlzQmluYXJ5KGNvbnRlbnQpKSB7XG4gICAgICByZXR1cm4gZW50cnk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHBhdGg6IHBhdGgsXG4gICAgICBjb250ZW50OiBuZXcgQnVmZmVyKHRlbXBsYXRlSW1wbChjb250ZW50LnRvU3RyaW5nKCd1dGYtOCcpLCB7fSkob3B0aW9ucykpLFxuICAgIH07XG4gIH07XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnRlbnRUZW1wbGF0ZTxUIGV4dGVuZHMgVGVtcGxhdGVPcHRpb25zPihvcHRpb25zOiBUKTogUnVsZSB7XG4gIHJldHVybiBmb3JFYWNoKGFwcGx5Q29udGVudFRlbXBsYXRlKG9wdGlvbnMpKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlQYXRoVGVtcGxhdGU8VCBleHRlbmRzIFRlbXBsYXRlT3B0aW9ucz4ob3B0aW9uczogVCk6IEZpbGVPcGVyYXRvciB7XG4gIHJldHVybiAoZW50cnk6IEZpbGVFbnRyeSkgPT4ge1xuICAgIGxldCBwYXRoID0gZW50cnkucGF0aDtcbiAgICBjb25zdCBjb250ZW50ID0gZW50cnkuY29udGVudDtcbiAgICBjb25zdCBvcmlnaW5hbCA9IHBhdGg7XG5cbiAgICAvLyBQYXRoIHRlbXBsYXRlLlxuICAgIHBhdGggPSBub3JtYWxpemUocGF0aC5yZXBsYWNlKGtQYXRoVGVtcGxhdGVDb21wb25lbnRSRSwgKF8sIG1hdGNoKSA9PiB7XG4gICAgICBjb25zdCBbbmFtZSwgLi4ucGlwZXNdID0gbWF0Y2guc3BsaXQoa1BhdGhUZW1wbGF0ZVBpcGVSRSk7XG4gICAgICBjb25zdCB2YWx1ZSA9IHR5cGVvZiBvcHRpb25zW25hbWVdID09ICdmdW5jdGlvbidcbiAgICAgICAgPyAob3B0aW9uc1tuYW1lXSBhcyBUZW1wbGF0ZVBpcGVGdW5jdGlvbikuY2FsbChvcHRpb25zLCBvcmlnaW5hbClcbiAgICAgICAgOiBvcHRpb25zW25hbWVdO1xuXG4gICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aHJvdyBuZXcgT3B0aW9uSXNOb3REZWZpbmVkRXhjZXB0aW9uKG5hbWUpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcGlwZXMucmVkdWNlKChhY2M6IHN0cmluZywgcGlwZTogc3RyaW5nKSA9PiB7XG4gICAgICAgIGlmICghcGlwZSkge1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEocGlwZSBpbiBvcHRpb25zKSkge1xuICAgICAgICAgIHRocm93IG5ldyBVbmtub3duUGlwZUV4Y2VwdGlvbihwaXBlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnNbcGlwZV0gIT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkUGlwZUV4Y2VwdGlvbihwaXBlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENvZXJjZSB0byBzdHJpbmcuXG4gICAgICAgIHJldHVybiAnJyArIChvcHRpb25zW3BpcGVdIGFzIFRlbXBsYXRlUGlwZUZ1bmN0aW9uKShhY2MpO1xuICAgICAgfSwgJycgKyB2YWx1ZSk7XG4gICAgfSkpO1xuXG4gICAgcmV0dXJuIHsgcGF0aCwgY29udGVudCB9O1xuICB9O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRoVGVtcGxhdGU8VCBleHRlbmRzIFRlbXBsYXRlT3B0aW9ucz4ob3B0aW9uczogVCk6IFJ1bGUge1xuICByZXR1cm4gZm9yRWFjaChhcHBseVBhdGhUZW1wbGF0ZShvcHRpb25zKSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHRlbXBsYXRlPFQgZXh0ZW5kcyBUZW1wbGF0ZU9wdGlvbnM+KG9wdGlvbnM6IFQpOiBSdWxlIHtcbiAgcmV0dXJuIGNoYWluKFtcbiAgICBjb250ZW50VGVtcGxhdGUob3B0aW9ucyksXG4gICAgcGF0aFRlbXBsYXRlKG9wdGlvbnMpLFxuICBdKTtcbn1cbiJdfQ==