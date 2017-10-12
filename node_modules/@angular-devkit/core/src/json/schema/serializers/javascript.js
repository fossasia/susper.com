"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const exception_1 = require("../../../exception/exception");
const strings_1 = require("../../../utils/strings");
const interface_1 = require("./interface");
class InvalidRangeException extends exception_1.BaseException {
    constructor(name, value, comparator, expected) {
        super(`Property ${JSON.stringify(name)} expected a value `
            + `${comparator} ${JSON.stringify(expected)}, received ${JSON.stringify(value)}.`);
    }
}
exports.InvalidRangeException = InvalidRangeException;
class InvalidValueException extends exception_1.BaseException {
    constructor(name, value, expected) {
        super(`Property ${JSON.stringify(name)} expected a value of type ${expected}, `
            + `received ${value}.`);
    }
}
exports.InvalidValueException = InvalidValueException;
class InvalidSchemaException extends exception_1.BaseException {
    constructor(schema) {
        super(`Invalid schema: ${JSON.stringify(schema)}`);
    }
}
exports.InvalidSchemaException = InvalidSchemaException;
class InvalidPropertyNameException extends exception_1.BaseException {
    constructor(path) {
        super(`Property ${JSON.stringify(path)} does not exist in the schema, and no additional `
            + `properties are allowed.`);
        this.path = path;
    }
}
exports.InvalidPropertyNameException = InvalidPropertyNameException;
class RequiredValueMissingException extends exception_1.BaseException {
    constructor(path) {
        super(`Property ${JSON.stringify(path)} is required but missing.`);
        this.path = path;
    }
}
exports.RequiredValueMissingException = RequiredValueMissingException;
exports.exceptions = {
    InvalidRangeException,
    InvalidSchemaException,
    InvalidValueException,
    InvalidPropertyNameException,
    RequiredValueMissingException,
};
const symbols = {
    Schema: Symbol('schema'),
};
class JavascriptSerializer extends interface_1.JsonSchemaSerializer {
    constructor(_options) {
        super();
        this._options = _options;
        this._uniqueSet = new Set();
    }
    _unique(name) {
        let i = 1;
        let result = name;
        while (this._uniqueSet.has(result)) {
            result = name + i;
            i++;
        }
        this._uniqueSet.add(result);
        return result;
    }
    serialize(ref, registry) {
        const rootSchema = registry.getSchemaFromRef(ref);
        const { root, templates } = require('./templates/javascript');
        const source = root({
            exceptions: exports.exceptions,
            name: '',
            options: this._options || {},
            schema: rootSchema,
            strings: {
                classify: strings_1.classify,
                camelize: strings_1.camelize,
            },
            symbols,
            templates,
        });
        const fn = new Function('registry', 'exceptions', 'symbols', 'value', source);
        return (value) => fn(registry, exports.exceptions, symbols, value);
    }
}
exports.JavascriptSerializer = JavascriptSerializer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamF2YXNjcmlwdC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQvIiwic291cmNlcyI6WyJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9jb3JlL3NyYy9qc29uL3NjaGVtYS9zZXJpYWxpemVycy9qYXZhc2NyaXB0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsNERBQTZEO0FBQzdELG9EQUE0RDtBQUc1RCwyQ0FBbUQ7QUFHbkQsMkJBQXNDLFNBQVEseUJBQWE7SUFDekQsWUFBWSxJQUFZLEVBQUUsS0FBUSxFQUFFLFVBQWtCLEVBQUUsUUFBVztRQUNqRSxLQUFLLENBQUMsWUFBWSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxvQkFBb0I7Y0FDdEQsR0FBRyxVQUFVLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsY0FBYyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN2RixDQUFDO0NBQ0Y7QUFMRCxzREFLQztBQUNELDJCQUFtQyxTQUFRLHlCQUFhO0lBQ3RELFlBQVksSUFBWSxFQUFFLEtBQVMsRUFBRSxRQUFnQjtRQUNuRCxLQUFLLENBQUMsWUFBWSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyw2QkFBNkIsUUFBUSxJQUFJO2NBQ3pFLFlBQVksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0NBQ0Y7QUFMRCxzREFLQztBQUNELDRCQUFvQyxTQUFRLHlCQUFhO0lBQ3ZELFlBQVksTUFBa0I7UUFDNUIsS0FBSyxDQUFDLG1CQUFtQixJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyRCxDQUFDO0NBQ0Y7QUFKRCx3REFJQztBQUNELGtDQUEwQyxTQUFRLHlCQUFhO0lBQzdELFlBQTRCLElBQVk7UUFDdEMsS0FBSyxDQUFDLFlBQVksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsbURBQW1EO2NBQ25GLHlCQUF5QixDQUFDLENBQUM7UUFGUCxTQUFJLEdBQUosSUFBSSxDQUFRO0lBR3hDLENBQUM7Q0FDRjtBQUxELG9FQUtDO0FBQ0QsbUNBQTJDLFNBQVEseUJBQWE7SUFDOUQsWUFBNEIsSUFBWTtRQUN0QyxLQUFLLENBQUMsWUFBWSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBRHpDLFNBQUksR0FBSixJQUFJLENBQVE7SUFFeEMsQ0FBQztDQUNGO0FBSkQsc0VBSUM7QUFHWSxRQUFBLFVBQVUsR0FBRztJQUN4QixxQkFBcUI7SUFDckIsc0JBQXNCO0lBQ3RCLHFCQUFxQjtJQUNyQiw0QkFBNEI7SUFDNUIsNkJBQTZCO0NBQzlCLENBQUM7QUFHRixNQUFNLE9BQU8sR0FBRztJQUNkLE1BQU0sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDO0NBQ3pCLENBQUM7QUFXRiwwQkFBcUMsU0FBUSxnQ0FBcUM7SUFHaEYsWUFBb0IsUUFBc0M7UUFBSSxLQUFLLEVBQUUsQ0FBQztRQUFsRCxhQUFRLEdBQVIsUUFBUSxDQUE4QjtRQUZsRCxlQUFVLEdBQUcsSUFBSSxHQUFHLEVBQVUsQ0FBQztJQUVnQyxDQUFDO0lBRTlELE9BQU8sQ0FBQyxJQUFZO1FBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNWLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQztRQUNsQixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7WUFDbkMsTUFBTSxHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7WUFDbEIsQ0FBQyxFQUFFLENBQUM7UUFDTixDQUFDO1FBQ0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFNUIsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRUQsU0FBUyxDQUFDLEdBQVcsRUFBRSxRQUE0QjtRQUNqRCxNQUFNLFVBQVUsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEQsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztRQUU5RCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbEIsVUFBVSxFQUFWLGtCQUFVO1lBQ1YsSUFBSSxFQUFFLEVBQUU7WUFDUixPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsSUFBSSxFQUFFO1lBQzVCLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE9BQU8sRUFBRTtnQkFDUCxRQUFRLEVBQVIsa0JBQVE7Z0JBQ1IsUUFBUSxFQUFSLGtCQUFRO2FBQ1Q7WUFDRCxPQUFPO1lBQ1AsU0FBUztTQUNWLENBQUMsQ0FBQztRQUVILE1BQU0sRUFBRSxHQUFHLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUU5RSxNQUFNLENBQUMsQ0FBQyxLQUFRLEtBQUssRUFBRSxDQUFDLFFBQVEsRUFBRSxrQkFBVSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNoRSxDQUFDO0NBQ0Y7QUF0Q0Qsb0RBc0NDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgQmFzZUV4Y2VwdGlvbiB9IGZyb20gJy4uLy4uLy4uL2V4Y2VwdGlvbi9leGNlcHRpb24nO1xuaW1wb3J0IHsgY2FtZWxpemUsIGNsYXNzaWZ5IH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMvc3RyaW5ncyc7XG5pbXBvcnQgeyBKc29uU2NoZW1hUmVnaXN0cnkgfSBmcm9tICcuLi9yZWdpc3RyeSc7XG5pbXBvcnQgeyBKc29uU2NoZW1hIH0gZnJvbSAnLi4vc2NoZW1hJztcbmltcG9ydCB7IEpzb25TY2hlbWFTZXJpYWxpemVyIH0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuXG5cbmV4cG9ydCBjbGFzcyBJbnZhbGlkUmFuZ2VFeGNlcHRpb248VD4gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB2YWx1ZTogVCwgY29tcGFyYXRvcjogc3RyaW5nLCBleHBlY3RlZDogVCkge1xuICAgIHN1cGVyKGBQcm9wZXJ0eSAke0pTT04uc3RyaW5naWZ5KG5hbWUpfSBleHBlY3RlZCBhIHZhbHVlIGBcbiAgICAgICsgYCR7Y29tcGFyYXRvcn0gJHtKU09OLnN0cmluZ2lmeShleHBlY3RlZCl9LCByZWNlaXZlZCAke0pTT04uc3RyaW5naWZ5KHZhbHVlKX0uYCk7XG4gIH1cbn1cbmV4cG9ydCBjbGFzcyBJbnZhbGlkVmFsdWVFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nLCB2YWx1ZToge30sIGV4cGVjdGVkOiBzdHJpbmcpIHtcbiAgICBzdXBlcihgUHJvcGVydHkgJHtKU09OLnN0cmluZ2lmeShuYW1lKX0gZXhwZWN0ZWQgYSB2YWx1ZSBvZiB0eXBlICR7ZXhwZWN0ZWR9LCBgXG4gICAgICAgICsgYHJlY2VpdmVkICR7dmFsdWV9LmApO1xuICB9XG59XG5leHBvcnQgY2xhc3MgSW52YWxpZFNjaGVtYUV4Y2VwdGlvbiBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihzY2hlbWE6IEpzb25TY2hlbWEpIHtcbiAgICBzdXBlcihgSW52YWxpZCBzY2hlbWE6ICR7SlNPTi5zdHJpbmdpZnkoc2NoZW1hKX1gKTtcbiAgfVxufVxuZXhwb3J0IGNsYXNzIEludmFsaWRQcm9wZXJ0eU5hbWVFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHBhdGg6IHN0cmluZykge1xuICAgIHN1cGVyKGBQcm9wZXJ0eSAke0pTT04uc3RyaW5naWZ5KHBhdGgpfSBkb2VzIG5vdCBleGlzdCBpbiB0aGUgc2NoZW1hLCBhbmQgbm8gYWRkaXRpb25hbCBgXG4gICAgICAgICsgYHByb3BlcnRpZXMgYXJlIGFsbG93ZWQuYCk7XG4gIH1cbn1cbmV4cG9ydCBjbGFzcyBSZXF1aXJlZFZhbHVlTWlzc2luZ0V4Y2VwdGlvbiBleHRlbmRzIEJhc2VFeGNlcHRpb24ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgcGF0aDogc3RyaW5nKSB7XG4gICAgc3VwZXIoYFByb3BlcnR5ICR7SlNPTi5zdHJpbmdpZnkocGF0aCl9IGlzIHJlcXVpcmVkIGJ1dCBtaXNzaW5nLmApO1xuICB9XG59XG5cblxuZXhwb3J0IGNvbnN0IGV4Y2VwdGlvbnMgPSB7XG4gIEludmFsaWRSYW5nZUV4Y2VwdGlvbixcbiAgSW52YWxpZFNjaGVtYUV4Y2VwdGlvbixcbiAgSW52YWxpZFZhbHVlRXhjZXB0aW9uLFxuICBJbnZhbGlkUHJvcGVydHlOYW1lRXhjZXB0aW9uLFxuICBSZXF1aXJlZFZhbHVlTWlzc2luZ0V4Y2VwdGlvbixcbn07XG5cblxuY29uc3Qgc3ltYm9scyA9IHtcbiAgU2NoZW1hOiBTeW1ib2woJ3NjaGVtYScpLFxufTtcblxuXG5leHBvcnQgaW50ZXJmYWNlIEphdmFzY3JpcHRTZXJpYWxpemVyT3B0aW9ucyB7XG4gIC8vIERvIG5vdCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYW4gZXh0cmEgcHJvcGVydHkgaXMgcGFzc2VkLCBzaW1wbHkgaWdub3JlIGl0LlxuICBpZ25vcmVFeHRyYVByb3BlcnRpZXM/OiBib29sZWFuO1xuICAvLyBBbGxvdyBhY2Nlc3NpbmcgdW5kZWZpbmVkIG9iamVjdHMsIHdoaWNoIG1pZ2h0IGhhdmUgZGVmYXVsdCBwcm9wZXJ0eSB2YWx1ZXMuXG4gIGFsbG93QWNjZXNzVW5kZWZpbmVkT2JqZWN0cz86IGJvb2xlYW47XG59XG5cblxuZXhwb3J0IGNsYXNzIEphdmFzY3JpcHRTZXJpYWxpemVyPFQ+IGV4dGVuZHMgSnNvblNjaGVtYVNlcmlhbGl6ZXI8KHZhbHVlOiBUKSA9PiBUPiB7XG4gIHByaXZhdGUgX3VuaXF1ZVNldCA9IG5ldyBTZXQ8c3RyaW5nPigpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX29wdGlvbnM/OiBKYXZhc2NyaXB0U2VyaWFsaXplck9wdGlvbnMpIHsgc3VwZXIoKTsgfVxuXG4gIHByb3RlY3RlZCBfdW5pcXVlKG5hbWU6IHN0cmluZykge1xuICAgIGxldCBpID0gMTtcbiAgICBsZXQgcmVzdWx0ID0gbmFtZTtcbiAgICB3aGlsZSAodGhpcy5fdW5pcXVlU2V0LmhhcyhyZXN1bHQpKSB7XG4gICAgICByZXN1bHQgPSBuYW1lICsgaTtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgdGhpcy5fdW5pcXVlU2V0LmFkZChyZXN1bHQpO1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHNlcmlhbGl6ZShyZWY6IHN0cmluZywgcmVnaXN0cnk6IEpzb25TY2hlbWFSZWdpc3RyeSkge1xuICAgIGNvbnN0IHJvb3RTY2hlbWEgPSByZWdpc3RyeS5nZXRTY2hlbWFGcm9tUmVmKHJlZik7XG4gICAgY29uc3QgeyByb290LCB0ZW1wbGF0ZXMgfSA9IHJlcXVpcmUoJy4vdGVtcGxhdGVzL2phdmFzY3JpcHQnKTtcblxuICAgIGNvbnN0IHNvdXJjZSA9IHJvb3Qoe1xuICAgICAgZXhjZXB0aW9ucyxcbiAgICAgIG5hbWU6ICcnLFxuICAgICAgb3B0aW9uczogdGhpcy5fb3B0aW9ucyB8fCB7fSxcbiAgICAgIHNjaGVtYTogcm9vdFNjaGVtYSxcbiAgICAgIHN0cmluZ3M6IHtcbiAgICAgICAgY2xhc3NpZnksXG4gICAgICAgIGNhbWVsaXplLFxuICAgICAgfSxcbiAgICAgIHN5bWJvbHMsXG4gICAgICB0ZW1wbGF0ZXMsXG4gICAgfSk7XG5cbiAgICBjb25zdCBmbiA9IG5ldyBGdW5jdGlvbigncmVnaXN0cnknLCAnZXhjZXB0aW9ucycsICdzeW1ib2xzJywgJ3ZhbHVlJywgc291cmNlKTtcblxuICAgIHJldHVybiAodmFsdWU6IFQpID0+IGZuKHJlZ2lzdHJ5LCBleGNlcHRpb25zLCBzeW1ib2xzLCB2YWx1ZSk7XG4gIH1cbn1cbiJdfQ==