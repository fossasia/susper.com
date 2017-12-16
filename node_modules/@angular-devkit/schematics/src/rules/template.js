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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGUuanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0LyIsInNvdXJjZXMiOlsicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvc2NoZW1hdGljcy9zcmMvcnVsZXMvdGVtcGxhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FBMEY7QUFHMUYsaUNBQXdDO0FBQ3hDLGlEQUE2QztBQUc3QyxpQ0FBeUMsU0FBUSxvQkFBYTtJQUM1RCxZQUFZLElBQVksSUFBSSxLQUFLLENBQUMsV0FBVyxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3pFO0FBRkQsa0VBRUM7QUFHRCwwQkFBa0MsU0FBUSxvQkFBYTtJQUNyRCxZQUFZLElBQVksSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQ3ZFO0FBRkQsb0RBRUM7QUFHRCwwQkFBa0MsU0FBUSxvQkFBYTtJQUNyRCxZQUFZLElBQVksSUFBSSxLQUFLLENBQUMsU0FBUyxJQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUNuRTtBQUZELG9EQUVDO0FBR1ksUUFBQSx3QkFBd0IsR0FBRyxZQUFZLENBQUM7QUFDeEMsUUFBQSxtQkFBbUIsR0FBRyxVQUFVLENBQUM7QUFVOUMsOEJBQWdFLE9BQVU7SUFDeEUsTUFBTSxDQUFDLENBQUMsS0FBZ0IsRUFBRSxFQUFFO1FBQzFCLE1BQU0sRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLG9CQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsTUFBTSxDQUFDO1lBQ0wsSUFBSSxFQUFFLElBQUk7WUFDVixPQUFPLEVBQUUsSUFBSSxNQUFNLENBQUMsZUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDMUUsQ0FBQztJQUNKLENBQUMsQ0FBQztBQUNKLENBQUM7QUFaRCxvREFZQztBQUdELHlCQUEyRCxPQUFVO0lBQ25FLE1BQU0sQ0FBQyxjQUFPLENBQUMsb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRkQsMENBRUM7QUFHRCwyQkFBNkQsT0FBVTtJQUNyRSxNQUFNLENBQUMsQ0FBQyxLQUFnQixFQUFFLEVBQUU7UUFDMUIsSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUN0QixNQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQzlCLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQztRQUV0QixpQkFBaUI7UUFDakIsSUFBSSxHQUFHLGdCQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQ0FBd0IsRUFBRSxDQUFDLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNuRSxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQywyQkFBbUIsQ0FBQyxDQUFDO1lBQzFELE1BQU0sS0FBSyxHQUFHLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVU7Z0JBQzlDLENBQUMsQ0FBRSxPQUFPLENBQUMsSUFBSSxDQUEwQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDO2dCQUNqRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWxCLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN4QixNQUFNLElBQUksMkJBQTJCLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDOUMsQ0FBQztZQUVELE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBVyxFQUFFLElBQVksRUFBRSxFQUFFO2dCQUNoRCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7b0JBQ1YsTUFBTSxDQUFDLEdBQUcsQ0FBQztnQkFDYixDQUFDO2dCQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN2QixNQUFNLElBQUksb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3ZDLENBQUM7Z0JBQ0QsRUFBRSxDQUFDLENBQUMsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDdkMsTUFBTSxJQUFJLG9CQUFvQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2dCQUVELG9CQUFvQjtnQkFDcEIsTUFBTSxDQUFDLEVBQUUsR0FBSSxPQUFPLENBQUMsSUFBSSxDQUEwQixDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzNELENBQUMsRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVKLE1BQU0sQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztJQUMzQixDQUFDLENBQUM7QUFDSixDQUFDO0FBbkNELDhDQW1DQztBQUdELHNCQUF3RCxPQUFVO0lBQ2hFLE1BQU0sQ0FBQyxjQUFPLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRkQsb0NBRUM7QUFHRCxrQkFBb0QsT0FBVTtJQUM1RCxNQUFNLENBQUMsWUFBSyxDQUFDO1FBQ1gsZUFBZSxDQUFDLE9BQU8sQ0FBQztRQUN4QixZQUFZLENBQUMsT0FBTyxDQUFDO0tBQ3RCLENBQUMsQ0FBQztBQUNMLENBQUM7QUFMRCw0QkFLQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7IEJhc2VFeGNlcHRpb24sIG5vcm1hbGl6ZSwgdGVtcGxhdGUgYXMgdGVtcGxhdGVJbXBsIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHsgRmlsZU9wZXJhdG9yLCBSdWxlIH0gZnJvbSAnLi4vZW5naW5lL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBGaWxlRW50cnkgfSBmcm9tICcuLi90cmVlL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBjaGFpbiwgZm9yRWFjaCB9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgeyBpc0JpbmFyeSB9IGZyb20gJy4vdXRpbHMvaXMtYmluYXJ5JztcblxuXG5leHBvcnQgY2xhc3MgT3B0aW9uSXNOb3REZWZpbmVkRXhjZXB0aW9uIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykgeyBzdXBlcihgT3B0aW9uIFwiJHtuYW1lfVwiIGlzIG5vdCBkZWZpbmVkLmApOyB9XG59XG5cblxuZXhwb3J0IGNsYXNzIFVua25vd25QaXBlRXhjZXB0aW9uIGV4dGVuZHMgQmFzZUV4Y2VwdGlvbiB7XG4gIGNvbnN0cnVjdG9yKG5hbWU6IHN0cmluZykgeyBzdXBlcihgUGlwZSBcIiR7bmFtZX1cIiBpcyBub3QgZGVmaW5lZC5gKTsgfVxufVxuXG5cbmV4cG9ydCBjbGFzcyBJbnZhbGlkUGlwZUV4Y2VwdGlvbiBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHsgc3VwZXIoYFBpcGUgXCIke25hbWV9XCIgaXMgaW52YWxpZC5gKTsgfVxufVxuXG5cbmV4cG9ydCBjb25zdCBrUGF0aFRlbXBsYXRlQ29tcG9uZW50UkUgPSAvX18oLis/KV9fL2c7XG5leHBvcnQgY29uc3Qga1BhdGhUZW1wbGF0ZVBpcGVSRSA9IC9AKFteQF0rKS87XG5cblxuZXhwb3J0IHR5cGUgVGVtcGxhdGVWYWx1ZSA9IGJvb2xlYW4gfCBzdHJpbmcgfCBudW1iZXIgfCB1bmRlZmluZWQ7XG5leHBvcnQgdHlwZSBUZW1wbGF0ZVBpcGVGdW5jdGlvbiA9ICh4OiBzdHJpbmcpID0+IFRlbXBsYXRlVmFsdWU7XG5leHBvcnQgdHlwZSBUZW1wbGF0ZU9wdGlvbnMgPSB7XG4gIFtrZXk6IHN0cmluZ106IFRlbXBsYXRlVmFsdWUgfCBUZW1wbGF0ZU9wdGlvbnMgfCBUZW1wbGF0ZVBpcGVGdW5jdGlvbixcbn07XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5Q29udGVudFRlbXBsYXRlPFQgZXh0ZW5kcyBUZW1wbGF0ZU9wdGlvbnM+KG9wdGlvbnM6IFQpOiBGaWxlT3BlcmF0b3Ige1xuICByZXR1cm4gKGVudHJ5OiBGaWxlRW50cnkpID0+IHtcbiAgICBjb25zdCB7cGF0aCwgY29udGVudH0gPSBlbnRyeTtcbiAgICBpZiAoaXNCaW5hcnkoY29udGVudCkpIHtcbiAgICAgIHJldHVybiBlbnRyeTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgcGF0aDogcGF0aCxcbiAgICAgIGNvbnRlbnQ6IG5ldyBCdWZmZXIodGVtcGxhdGVJbXBsKGNvbnRlbnQudG9TdHJpbmcoJ3V0Zi04JyksIHt9KShvcHRpb25zKSksXG4gICAgfTtcbiAgfTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY29udGVudFRlbXBsYXRlPFQgZXh0ZW5kcyBUZW1wbGF0ZU9wdGlvbnM+KG9wdGlvbnM6IFQpOiBSdWxlIHtcbiAgcmV0dXJuIGZvckVhY2goYXBwbHlDb250ZW50VGVtcGxhdGUob3B0aW9ucykpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBhcHBseVBhdGhUZW1wbGF0ZTxUIGV4dGVuZHMgVGVtcGxhdGVPcHRpb25zPihvcHRpb25zOiBUKTogRmlsZU9wZXJhdG9yIHtcbiAgcmV0dXJuIChlbnRyeTogRmlsZUVudHJ5KSA9PiB7XG4gICAgbGV0IHBhdGggPSBlbnRyeS5wYXRoO1xuICAgIGNvbnN0IGNvbnRlbnQgPSBlbnRyeS5jb250ZW50O1xuICAgIGNvbnN0IG9yaWdpbmFsID0gcGF0aDtcblxuICAgIC8vIFBhdGggdGVtcGxhdGUuXG4gICAgcGF0aCA9IG5vcm1hbGl6ZShwYXRoLnJlcGxhY2Uoa1BhdGhUZW1wbGF0ZUNvbXBvbmVudFJFLCAoXywgbWF0Y2gpID0+IHtcbiAgICAgIGNvbnN0IFtuYW1lLCAuLi5waXBlc10gPSBtYXRjaC5zcGxpdChrUGF0aFRlbXBsYXRlUGlwZVJFKTtcbiAgICAgIGNvbnN0IHZhbHVlID0gdHlwZW9mIG9wdGlvbnNbbmFtZV0gPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICA/IChvcHRpb25zW25hbWVdIGFzIFRlbXBsYXRlUGlwZUZ1bmN0aW9uKS5jYWxsKG9wdGlvbnMsIG9yaWdpbmFsKVxuICAgICAgICA6IG9wdGlvbnNbbmFtZV07XG5cbiAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRocm93IG5ldyBPcHRpb25Jc05vdERlZmluZWRFeGNlcHRpb24obmFtZSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwaXBlcy5yZWR1Y2UoKGFjYzogc3RyaW5nLCBwaXBlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgaWYgKCFwaXBlKSB7XG4gICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShwaXBlIGluIG9wdGlvbnMpKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFVua25vd25QaXBlRXhjZXB0aW9uKHBpcGUpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2Ygb3B0aW9uc1twaXBlXSAhPSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRQaXBlRXhjZXB0aW9uKHBpcGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29lcmNlIHRvIHN0cmluZy5cbiAgICAgICAgcmV0dXJuICcnICsgKG9wdGlvbnNbcGlwZV0gYXMgVGVtcGxhdGVQaXBlRnVuY3Rpb24pKGFjYyk7XG4gICAgICB9LCAnJyArIHZhbHVlKTtcbiAgICB9KSk7XG5cbiAgICByZXR1cm4geyBwYXRoLCBjb250ZW50IH07XG4gIH07XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGhUZW1wbGF0ZTxUIGV4dGVuZHMgVGVtcGxhdGVPcHRpb25zPihvcHRpb25zOiBUKTogUnVsZSB7XG4gIHJldHVybiBmb3JFYWNoKGFwcGx5UGF0aFRlbXBsYXRlKG9wdGlvbnMpKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gdGVtcGxhdGU8VCBleHRlbmRzIFRlbXBsYXRlT3B0aW9ucz4ob3B0aW9uczogVCk6IFJ1bGUge1xuICByZXR1cm4gY2hhaW4oW1xuICAgIGNvbnRlbnRUZW1wbGF0ZShvcHRpb25zKSxcbiAgICBwYXRoVGVtcGxhdGUob3B0aW9ucyksXG4gIF0pO1xufVxuIl19