return module.exports.default = function(obj) {
  obj || (obj = {});
  let __t;
  let __p = "";
  const __escapes = {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;","`":"&#96;"};
  const __escapesre = new RegExp('[&<>"\\\'`]', 'g');

  const __e = function(s) {     return s ? s.replace(__escapesre, function(key) { return __escapes[key]; }) : '';  };
  with (obj) {
__p = __p
    + "(function() {\n"
    + "";

  if ('default' in schema && !Array.isArray(schema.default)
    || 'minItems' in schema && (typeof schema.minItems != 'number' || schema.minItems < 0)
    || 'maxItems' in schema && (typeof schema.maxItems != 'number' || schema.maxItems < 0)
    || 'uniqueItems' in schema && typeof schema.uniqueItems != 'boolean') {
    throw new exceptions.InvalidSchemaException(schema);
  }

  const required = (schema.required || []);
  const extras = {
    exceptions: exceptions,
    options: options,
    path: path,
    strings: strings,
    symbols: symbols,
    templates: templates,
  };

__p = __p
    + "\n"
    + "\n"
    + "const itemHandler = function() { return (";
__p += ((__t = 
  templates.subschema(Object.assign({
    name: '???',
    required: false,
    schema: schema.additionalProperties,
  }, extras))
) == null ? "" : __t);
__p = __p
    + "); };\n"
    + "\n"
    + "\n"
    + "const items = [];\n"
    + "const arrayFunctions = {\n"
    + "  get length() { return items.length; },\n"
    + "  push() { items.push.apply(items, arguments); },\n"
    + "  pop() { return items.pop(); },\n"
    + "  shift() { return items.shift(); },\n"
    + "  unshift() { return items.unshift(); },\n"
    + "  slice(start, end) { return items.slice(start, end); },\n"
    + "};\n"
    + "\n"
    + "\n"
    + "let defined = false;\n"
    + "const proxy = new Proxy({}, {\n"
    + "  isExtensible() { return false; },\n"
    + "  has(target, prop) {\n"
    + "    return (prop in items);\n"
    + "  },\n"
    + "  get(target, prop) {\n"
    + "    if (prop === symbols.Schema) {\n"
    + "      return arrayHandler.schema;\n"
    + "    }\n"
    + "\n"
    + "    if (prop >= 0 && prop in value) {\n"
    + "      return value[prop].get();\n"
    + "    }\n"
    + "    if (prop in arrayFunctions) {\n"
    + "      return arrayFunctions[prop];\n"
    + "    }\n"
    + "    return undefined;\n"
    + "  },\n"
    + "  set(target, prop, v) {\n"
    + "    if (prop >= 0) {\n"
    + "      if (!(prop in items)) {\n"
    + "        items[prop] = itemHandler();\n"
    + "      }\n"
    + "      items[prop].set(v);\n"
    + "      return true;\n"
    + "    }\n"
    + "    return false;\n"
    + "  },\n"
    + "  deleteProperty(target, prop) {\n"
    + "    if (prop >= 0 && prop in value) {\n"
    + "      value[prop].remove();\n"
    + "      return true;\n"
    + "    }\n"
    + "    return false;\n"
    + "  },\n"
    + "  defineProperty(target, prop, descriptor) {\n"
    + "    return false;\n"
    + "  },\n"
    + "  getOwnPropertyDescriptor(target, prop) {\n"
    + "    if (prop >= 0 && prop in value) {\n"
    + "      return { configurable: true, enumerable: true };\n"
    + "    }\n"
    + "  },\n"
    + "  ownKeys(target) {\n"
    + "    return Object.keys(items);\n"
    + "  },\n"
    + "});\n"
    + "\n"
    + "const arrayHandler = {\n"
    + "  set(v) {\n"
    + "    if (v === undefined) {\n"
    + "      defined = false;\n"
    + "      return;\n"
    + "    }\n"
    + "\n"
    + "    defined = true;\n"
    + "    for (const key of Object.keys(v)) {\n"
    + "      proxy[key] = v[key];\n"
    + "    }\n"
    + "\n"
    + "    // Validate required fields.\n"
    + "    ";
 for (const key of required) { 
__p = __p
    + "\n"
    + "    if (!(";
__p += ((__t =  JSON.stringify(key) ) == null ? "" : __t);
__p = __p
    + " in v)) {\n"
    + "      throw new exceptions.RequiredValueMissingException(";
__p += ((__t =  JSON.stringify(path) ) == null ? "" : __t);
__p = __p
    + " + '/' + ";
__p += ((__t =  JSON.stringify(key) ) == null ? "" : __t);
__p = __p
    + ");\n"
    + "    }";
 } 
__p = __p
    + "\n"
    + "  },\n"
    + "  get() {\n"
    + "    if (defined) {\n"
    + "      return proxy;\n"
    + "    } else {\n"
    + "      return ";
__p += ((__t =  'default' in schema ? JSON.stringify(schema.default) : 'undefined' ) == null ? "" : __t);
__p = __p
    + ";\n"
    + "    }\n"
    + "  },\n"
    + "  isDefined() { return defined; },\n"
    + "  remove() { this.set(undefined); },\n"
    + "  schema: ";
__p += ((__t =  JSON.stringify(schema) ) == null ? "" : __t);
__p = __p
    + ",\n"
    + "};\n"
    + "\n"
    + "return arrayHandler;\n"
    + "\n"
    + "})()\n"
    + "";
  };

  return __p;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2pzb24vc2NoZW1hL3NlcmlhbGl6ZXJzL3RlbXBsYXRlcy9qYXZhc2NyaXB0L3Byb3AtYXJyYXkuZWpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsdUJBQ0E7QUFBQSxRQURhO0FBQUE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVFO0FBQUE7QUFBQSxVQUNGO0FBQUEsVUFDQTtBQUFBLGlEQUF5QztBQUFBO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRTtBQUFBO0FBQUEsZUFDRjtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsMkJBQ0E7QUFBQSxrQ0FDQTtBQUFBLGtEQUNBO0FBQUEsMkRBQ0E7QUFBQSwwQ0FDQTtBQUFBLDhDQUNBO0FBQUEsa0RBQ0E7QUFBQSxrRUFDQTtBQUFBLFlBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLDhCQUNBO0FBQUEsdUNBQ0E7QUFBQSw2Q0FDQTtBQUFBLCtCQUNBO0FBQUEscUNBQ0E7QUFBQSxjQUNBO0FBQUEsK0JBQ0E7QUFBQSw0Q0FDQTtBQUFBLDJDQUNBO0FBQUEsZUFDQTtBQUFBLFVBQ0E7QUFBQSwrQ0FDQTtBQUFBLHlDQUNBO0FBQUEsZUFDQTtBQUFBLDJDQUNBO0FBQUEsNENBQ0E7QUFBQSxlQUNBO0FBQUEsK0JBQ0E7QUFBQSxjQUNBO0FBQUEsa0NBQ0E7QUFBQSw4QkFDQTtBQUFBLHVDQUNBO0FBQUEsOENBQ0E7QUFBQSxpQkFDQTtBQUFBLG1DQUNBO0FBQUEsNEJBQ0E7QUFBQSxlQUNBO0FBQUEsMkJBQ0E7QUFBQSxjQUNBO0FBQUEsMENBQ0E7QUFBQSwrQ0FDQTtBQUFBLHFDQUNBO0FBQUEsNEJBQ0E7QUFBQSxlQUNBO0FBQUEsMkJBQ0E7QUFBQSxjQUNBO0FBQUEsc0RBQ0E7QUFBQSwyQkFDQTtBQUFBLGNBQ0E7QUFBQSxvREFDQTtBQUFBLCtDQUNBO0FBQUEsZ0VBQ0E7QUFBQSxlQUNBO0FBQUEsY0FDQTtBQUFBLDZCQUNBO0FBQUEsd0NBQ0E7QUFBQSxjQUNBO0FBQUEsYUFDQTtBQUFBLFVBQ0E7QUFBQSxnQ0FDQTtBQUFBLG9CQUNBO0FBQUEsb0NBQ0E7QUFBQSxnQ0FDQTtBQUFBLHVCQUNBO0FBQUEsZUFDQTtBQUFBLFVBQ0E7QUFBQSw2QkFDQTtBQUFBLGlEQUNBO0FBQUEsb0NBQ0E7QUFBQSxlQUNBO0FBQUEsVUFDQTtBQUFBLDBDQUNBO0FBQUEsWUFBSTtBQUFBLCtCQUNKO0FBQUE7QUFBQSxVQUNBO0FBQUEsa0JBRFc7QUFBQSxvQ0FBMEI7QUFBQTtBQUFBLG1CQUNyQztBQUFBLGlFQUEwRDtBQUFBLHFDQUEyQjtBQUFBO0FBQUEsaUJBQVM7QUFBQSxvQ0FBMEI7QUFBQTtBQUFBLFlBQ3hIO0FBQUEsYUFBTTtBQUFBLEdBQ0w7QUFBQTtBQUFBLFVBQ0Q7QUFBQSxjQUNBO0FBQUEsbUJBQ0E7QUFBQSw0QkFDQTtBQUFBLDZCQUNBO0FBQUEsc0JBQ0E7QUFBQSxxQkFEZTtBQUFBLG1GQUNmO0FBQUE7QUFBQSxXQUNBO0FBQUEsZUFDQTtBQUFBLGNBQ0E7QUFBQSw0Q0FDQTtBQUFBLDhDQUNBO0FBQUEsa0JBRFk7QUFBQSx1Q0FDWjtBQUFBO0FBQUEsV0FDQTtBQUFBLFlBQ0E7QUFBQSxVQUNBO0FBQUEsOEJBQ0E7QUFBQSxVQUNBO0FBQUEsY0FDQTtBQUFBLFFBREU7QUFBQTtBQUFBO0FBQUE7QUFBQSIsImZpbGUiOiJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9jb3JlL3NyYy9qc29uL3NjaGVtYS9zZXJpYWxpemVycy90ZW1wbGF0ZXMvamF2YXNjcmlwdC9wcm9wLWFycmF5LmVqcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG48JVxuICBpZiAoJ2RlZmF1bHQnIGluIHNjaGVtYSAmJiAhQXJyYXkuaXNBcnJheShzY2hlbWEuZGVmYXVsdClcbiAgICB8fCAnbWluSXRlbXMnIGluIHNjaGVtYSAmJiAodHlwZW9mIHNjaGVtYS5taW5JdGVtcyAhPSAnbnVtYmVyJyB8fCBzY2hlbWEubWluSXRlbXMgPCAwKVxuICAgIHx8ICdtYXhJdGVtcycgaW4gc2NoZW1hICYmICh0eXBlb2Ygc2NoZW1hLm1heEl0ZW1zICE9ICdudW1iZXInIHx8IHNjaGVtYS5tYXhJdGVtcyA8IDApXG4gICAgfHwgJ3VuaXF1ZUl0ZW1zJyBpbiBzY2hlbWEgJiYgdHlwZW9mIHNjaGVtYS51bmlxdWVJdGVtcyAhPSAnYm9vbGVhbicpIHtcbiAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkU2NoZW1hRXhjZXB0aW9uKHNjaGVtYSk7XG4gIH1cblxuICBjb25zdCByZXF1aXJlZCA9IChzY2hlbWEucmVxdWlyZWQgfHwgW10pO1xuICBjb25zdCBleHRyYXMgPSB7XG4gICAgZXhjZXB0aW9uczogZXhjZXB0aW9ucyxcbiAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgIHBhdGg6IHBhdGgsXG4gICAgc3RyaW5nczogc3RyaW5ncyxcbiAgICBzeW1ib2xzOiBzeW1ib2xzLFxuICAgIHRlbXBsYXRlczogdGVtcGxhdGVzLFxuICB9O1xuJT5cblxuY29uc3QgaXRlbUhhbmRsZXIgPSBmdW5jdGlvbigpIHsgcmV0dXJuICg8JT1cbiAgdGVtcGxhdGVzLnN1YnNjaGVtYShPYmplY3QuYXNzaWduKHtcbiAgICBuYW1lOiAnPz8/JyxcbiAgICByZXF1aXJlZDogZmFsc2UsXG4gICAgc2NoZW1hOiBzY2hlbWEuYWRkaXRpb25hbFByb3BlcnRpZXMsXG4gIH0sIGV4dHJhcykpXG4lPik7IH07XG5cblxuY29uc3QgaXRlbXMgPSBbXTtcbmNvbnN0IGFycmF5RnVuY3Rpb25zID0ge1xuICBnZXQgbGVuZ3RoKCkgeyByZXR1cm4gaXRlbXMubGVuZ3RoOyB9LFxuICBwdXNoKCkgeyBpdGVtcy5wdXNoLmFwcGx5KGl0ZW1zLCBhcmd1bWVudHMpOyB9LFxuICBwb3AoKSB7IHJldHVybiBpdGVtcy5wb3AoKTsgfSxcbiAgc2hpZnQoKSB7IHJldHVybiBpdGVtcy5zaGlmdCgpOyB9LFxuICB1bnNoaWZ0KCkgeyByZXR1cm4gaXRlbXMudW5zaGlmdCgpOyB9LFxuICBzbGljZShzdGFydCwgZW5kKSB7IHJldHVybiBpdGVtcy5zbGljZShzdGFydCwgZW5kKTsgfSxcbn07XG5cblxubGV0IGRlZmluZWQgPSBmYWxzZTtcbmNvbnN0IHByb3h5ID0gbmV3IFByb3h5KHt9LCB7XG4gIGlzRXh0ZW5zaWJsZSgpIHsgcmV0dXJuIGZhbHNlOyB9LFxuICBoYXModGFyZ2V0LCBwcm9wKSB7XG4gICAgcmV0dXJuIChwcm9wIGluIGl0ZW1zKTtcbiAgfSxcbiAgZ2V0KHRhcmdldCwgcHJvcCkge1xuICAgIGlmIChwcm9wID09PSBzeW1ib2xzLlNjaGVtYSkge1xuICAgICAgcmV0dXJuIGFycmF5SGFuZGxlci5zY2hlbWE7XG4gICAgfVxuXG4gICAgaWYgKHByb3AgPj0gMCAmJiBwcm9wIGluIHZhbHVlKSB7XG4gICAgICByZXR1cm4gdmFsdWVbcHJvcF0uZ2V0KCk7XG4gICAgfVxuICAgIGlmIChwcm9wIGluIGFycmF5RnVuY3Rpb25zKSB7XG4gICAgICByZXR1cm4gYXJyYXlGdW5jdGlvbnNbcHJvcF07XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0sXG4gIHNldCh0YXJnZXQsIHByb3AsIHYpIHtcbiAgICBpZiAocHJvcCA+PSAwKSB7XG4gICAgICBpZiAoIShwcm9wIGluIGl0ZW1zKSkge1xuICAgICAgICBpdGVtc1twcm9wXSA9IGl0ZW1IYW5kbGVyKCk7XG4gICAgICB9XG4gICAgICBpdGVtc1twcm9wXS5zZXQodik7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3ApIHtcbiAgICBpZiAocHJvcCA+PSAwICYmIHByb3AgaW4gdmFsdWUpIHtcbiAgICAgIHZhbHVlW3Byb3BdLnJlbW92ZSgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wLCBkZXNjcmlwdG9yKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wKSB7XG4gICAgaWYgKHByb3AgPj0gMCAmJiBwcm9wIGluIHZhbHVlKSB7XG4gICAgICByZXR1cm4geyBjb25maWd1cmFibGU6IHRydWUsIGVudW1lcmFibGU6IHRydWUgfTtcbiAgICB9XG4gIH0sXG4gIG93bktleXModGFyZ2V0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGl0ZW1zKTtcbiAgfSxcbn0pO1xuXG5jb25zdCBhcnJheUhhbmRsZXIgPSB7XG4gIHNldCh2KSB7XG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVmaW5lZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRlZmluZWQgPSB0cnVlO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHYpKSB7XG4gICAgICBwcm94eVtrZXldID0gdltrZXldO1xuICAgIH1cblxuICAgIC8vIFZhbGlkYXRlIHJlcXVpcmVkIGZpZWxkcy5cbiAgICA8JSBmb3IgKGNvbnN0IGtleSBvZiByZXF1aXJlZCkgeyAlPlxuICAgIGlmICghKDwlPSBKU09OLnN0cmluZ2lmeShrZXkpICU+IGluIHYpKSB7XG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5SZXF1aXJlZFZhbHVlTWlzc2luZ0V4Y2VwdGlvbig8JT0gSlNPTi5zdHJpbmdpZnkocGF0aCkgJT4gKyAnLycgKyA8JT0gSlNPTi5zdHJpbmdpZnkoa2V5KSAlPik7XG4gICAgfTwlIH0gJT5cbiAgfSxcbiAgZ2V0KCkge1xuICAgIGlmIChkZWZpbmVkKSB7XG4gICAgICByZXR1cm4gcHJveHk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8JT0gJ2RlZmF1bHQnIGluIHNjaGVtYSA/IEpTT04uc3RyaW5naWZ5KHNjaGVtYS5kZWZhdWx0KSA6ICd1bmRlZmluZWQnICU+O1xuICAgIH1cbiAgfSxcbiAgaXNEZWZpbmVkKCkgeyByZXR1cm4gZGVmaW5lZDsgfSxcbiAgcmVtb3ZlKCkgeyB0aGlzLnNldCh1bmRlZmluZWQpOyB9LFxuICBzY2hlbWE6IDwlPSBKU09OLnN0cmluZ2lmeShzY2hlbWEpICU+LFxufTtcblxucmV0dXJuIGFycmF5SGFuZGxlcjtcblxufSkoKVxuIl19