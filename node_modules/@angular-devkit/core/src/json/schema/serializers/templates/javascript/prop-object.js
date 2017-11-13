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
    + "const additionalProperties = {};\n"
    + "const additionalPropertyHandler = ";

if (!('additionalProperties' in schema)) { 
__p = __p
    + "null";
 } else { 
__p = __p
    + " function() { return (";
__p += ((__t = 
  templates.subschema(Object.assign({
    name: '???',
    required: false,
    schema: schema.additionalProperties,
  }, extras)) ) == null ? "" : __t);
__p = __p
    + "); }";

}

__p = __p
    + ";\n"
    + "\n"
    + "const handlers = Object.create(null);\n"
    + "";

  for (const propName of Object.keys(schema.properties)) {
    const _key = JSON.stringify(propName);
    const _name = propName.match(/^[_a-zA-Z][_a-zA-Z0-9]*$/) ? propName : `[${_key}]`;

__p = __p
    + "handlers[";
__p += ((__t =  JSON.stringify(_name) ) == null ? "" : __t);
__p = __p
    + "] = ";
__p += ((__t = 
  templates.subschema(Object.assign({
    name: _name,
    required: required.indexOf(propName) != -1,
    schema: schema.properties[propName],
  }, extras))
) == null ? "" : __t);

}

__p = __p
    + "\n"
    + "\n"
    + "const objectFunctions = {\n"
    + "  hasOwnProperty(name) { return objectProxyHandler.has(null, name); },\n"
    + "};\n"
    + "\n"
    + "\n"
    + "let defined = false;\n"
    + "const objectProxyHandler = {\n"
    + "  isExtensible() { return false; },\n"
    + "  has(target, prop) {\n"
    + "    return (prop in handlers && handlers[prop].isDefined())\n"
    + "        || (additionalPropertyHandler\n"
    + "            ? (prop in additionalProperties && additionalProperties[prop].isDefined())\n"
    + "            : false);\n"
    + "  },\n"
    + "  get(target, prop) {\n"
    + "    if (prop === symbols.Schema) {\n"
    + "      return objectHandler.schema;\n"
    + "    }\n"
    + "    if (prop in handlers) {\n"
    + "      return handlers[prop].get();\n"
    + "    }\n"
    + "    if (prop in objectFunctions) {\n"
    + "      return objectFunctions[prop];\n"
    + "    }\n"
    + "    return undefined;\n"
    + "  },\n"
    + "  set(target, prop, v) {\n"
    + "    defined = true;\n"
    + "    if (prop in handlers) {\n"
    + "      handlers[prop].set(v);\n"
    + "      return true;\n"
    + "    } else if (additionalPropertyHandler) {\n"
    + "      if (!(prop in additionalProperties)) {\n"
    + "        additionalProperties[prop] = additionalPropertyHandler(prop);\n"
    + "      }\n"
    + "      additionalProperties[prop].set(v);\n"
    + "      return true;\n"
    + "    } else {\n"
    + "      ";
 if (options.ignoreExtraProperties !== true) {
      
__p = __p
    + "throw new exceptions.InvalidPropertyNameException(";
__p += ((__t =  JSON.stringify(path) ) == null ? "" : __t);
__p = __p
    + " + '/' + prop);";

      } else {
        // Just ignore the property.
      
__p = __p
    + "return true;";

      } 
__p = __p
    + "\n"
    + "    }\n"
    + "  },\n"
    + "  deleteProperty(target, prop) {\n"
    + "    if (prop in handlers) {\n"
    + "      handlers[prop].remove();\n"
    + "      return true;\n"
    + "    } else if (additionalPropertyHandler && prop in additionalProperties) {\n"
    + "      delete additionalProperties[prop];\n"
    + "    }\n"
    + "  },\n"
    + "  defineProperty(target, prop, descriptor) {\n"
    + "    return false;\n"
    + "  },\n"
    + "  getOwnPropertyDescriptor(target, prop) {\n"
    + "    if (prop in handlers) {\n"
    + "      return { configurable: true, enumerable: true };\n"
    + "    } else if (additionalPropertyHandler && prop in additionalPropertyHandler) {\n"
    + "      return { configurable: true, enumerable: true };\n"
    + "    }\n"
    + "  },\n"
    + "  ownKeys(target) {\n"
    + "    return [].concat(\n"
    + "      Object.keys(handlers),\n"
    + "      additionalPropertyHandler ? Object.keys(additionalProperties) : []\n"
    + "    );\n"
    + "  },\n"
    + "};\n"
    + "\n"
    + "\n"
    + "const proxy = new Proxy({}, objectProxyHandler);\n"
    + "\n"
    + "const objectHandler = {\n"
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
    + "    if (";
__p += ((__t =  options.allowAccessUndefinedObjects === true ) == null ? "" : __t);
__p = __p
    + " || this.isDefined()) {\n"
    + "      return proxy;\n"
    + "    } else {\n"
    + "      return ";
__p += ((__t =  'default' in schema ? JSON.stringify(schema.default) : 'undefined' ) == null ? "" : __t);
__p = __p
    + ";\n"
    + "    }\n"
    + "  },\n"
    + "  isDefined() {\n"
    + "    return defined\n"
    + "      && (Object.keys(handlers).some(function(x) { return handlers[x].isDefined(); })\n"
    + "          || Object.keys(additionalProperties).some(function(x) {\n"
    + "            return additionalProperties[x].isDefined();\n"
    + "          }));\n"
    + "  },\n"
    + "  remove() { this.set(undefined); },\n"
    + "  schema: ";
__p += ((__t =  JSON.stringify(schema) ) == null ? "" : __t);
__p = __p
    + ",\n"
    + "};\n"
    + "\n"
    + "return objectHandler;\n"
    + "\n"
    + "})()\n"
    + "";
  };

  return __p;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2pzb24vc2NoZW1hL3NlcmlhbGl6ZXJzL3RlbXBsYXRlcy9qYXZhc2NyaXB0L3Byb3Atb2JqZWN0LmVqcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLHVCQUNBO0FBQUEsUUFEYTtBQUFBO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUU7QUFBQTtBQUFBLFVBQ0Y7QUFBQSxVQUNBO0FBQUEsMENBQ0E7QUFBQSwwQ0FBa0M7QUFBQTtBQUNsQywyQ0FBOEM7QUFBQTtBQUFBLFlBQUk7QUFBQSxVQUFlO0FBQUE7QUFBQSw4QkFBc0I7QUFBQTtBQUN2RjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWtCO0FBQUE7QUFBQSxZQUFJO0FBQUE7QUFDdEI7QUFHQTtBQUFBO0FBQUEsV0FDQTtBQUFBLFVBQ0E7QUFBQSwrQ0FDQTtBQUFBLFFBREE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUFNO0FBQUE7QUFBQSxpQkFBUztBQUFBLHNDQUE0QjtBQUFBO0FBQUEsWUFDM0M7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQztBQUFBO0FBQ0Q7QUFFRztBQUFBO0FBQUEsVUFDSDtBQUFBLFVBQ0E7QUFBQSxtQ0FDQTtBQUFBLGdGQUNBO0FBQUEsWUFDQTtBQUFBLFVBQ0E7QUFBQSxVQUNBO0FBQUEsOEJBQ0E7QUFBQSxzQ0FDQTtBQUFBLDZDQUNBO0FBQUEsK0JBQ0E7QUFBQSxxRUFDQTtBQUFBLCtDQUNBO0FBQUEsZ0dBQ0E7QUFBQSwrQkFDQTtBQUFBLGNBQ0E7QUFBQSwrQkFDQTtBQUFBLDRDQUNBO0FBQUEsNENBQ0E7QUFBQSxlQUNBO0FBQUEscUNBQ0E7QUFBQSw0Q0FDQTtBQUFBLGVBQ0E7QUFBQSw0Q0FDQTtBQUFBLDZDQUNBO0FBQUEsZUFDQTtBQUFBLCtCQUNBO0FBQUEsY0FDQTtBQUFBLGtDQUNBO0FBQUEsNkJBQ0E7QUFBQSxxQ0FDQTtBQUFBLHNDQUNBO0FBQUEsNEJBQ0E7QUFBQSxxREFDQTtBQUFBLHNEQUNBO0FBQUEsK0VBQ0E7QUFBQSxpQkFDQTtBQUFBLGtEQUNBO0FBQUEsNEJBQ0E7QUFBQSxzQkFDQTtBQUFBLGNBRlc7QUFBQTtBQUNYLE1BQWM7QUFBQTtBQUFBLDBEQUFrRDtBQUFBLHFDQUEyQjtBQUFBO0FBQUEsdUJBQ3hGO0FBQUE7QUFDSDtBQUNBO0FBQ0EsTUFEZTtBQUFBO0FBQUEsb0JBQ1g7QUFBQTtBQUNKLFFBQ0M7QUFBQTtBQUFBLFVBQ0Q7QUFBQSxlQUNBO0FBQUEsY0FDQTtBQUFBLDBDQUNBO0FBQUEscUNBQ0E7QUFBQSx3Q0FDQTtBQUFBLDRCQUNBO0FBQUEscUZBQ0E7QUFBQSxrREFDQTtBQUFBLGVBQ0E7QUFBQSxjQUNBO0FBQUEsc0RBQ0E7QUFBQSwyQkFDQTtBQUFBLGNBQ0E7QUFBQSxvREFDQTtBQUFBLHFDQUNBO0FBQUEsZ0VBQ0E7QUFBQSwwRkFDQTtBQUFBLGdFQUNBO0FBQUEsZUFDQTtBQUFBLGNBQ0E7QUFBQSw2QkFDQTtBQUFBLCtCQUNBO0FBQUEsc0NBQ0E7QUFBQSxrRkFDQTtBQUFBLGdCQUNBO0FBQUEsY0FDQTtBQUFBLFlBQ0E7QUFBQSxVQUNBO0FBQUEsVUFDQTtBQUFBLDBEQUNBO0FBQUEsVUFDQTtBQUFBLGlDQUNBO0FBQUEsb0JBQ0E7QUFBQSxvQ0FDQTtBQUFBLGdDQUNBO0FBQUEsdUJBQ0E7QUFBQSxlQUNBO0FBQUEsVUFDQTtBQUFBLDZCQUNBO0FBQUEsaURBQ0E7QUFBQSxvQ0FDQTtBQUFBLGVBQ0E7QUFBQSxVQUNBO0FBQUEsMENBQ0E7QUFBQSxZQUZZO0FBQUEsK0JBQ0o7QUFBQTtBQUFBLFVBQ1I7QUFBQSxrQkFEbUI7QUFBQSxvQ0FBMEI7QUFBQTtBQUFBLG1CQUM3QztBQUFBLGlFQUFrRTtBQUFBLHFDQUEyQjtBQUFBO0FBQUEsaUJBQVM7QUFBQSxvQ0FDaEc7QUFBQTtBQUFBLFlBQ047QUFBQSxhQUFDO0FBQUEsR0FDRztBQUFBO0FBQUEsVUFDSjtBQUFBLGNBQ0E7QUFBQSxtQkFDQTtBQUFBLGdCQUZrQjtBQUFBLDZEQUFtRDtBQUFBO0FBQUEsaUNBQ3JFO0FBQUEsNkJBQ0E7QUFBQSxzQkFDQTtBQUFBLHFCQUF1QjtBQUFBLG1GQUVyQjtBQUFBO0FBQUEsV0FDRjtBQUFBLGVBQ0E7QUFBQSxjQUNBO0FBQUEseUJBQ0E7QUFBQSw0QkFDQTtBQUFBLCtGQUNBO0FBQUEsMkVBQ0E7QUFBQSxpRUFDQTtBQUFBLHdCQUNBO0FBQUEsY0FDQTtBQUFBLDhDQUNBO0FBQUEsa0JBRm9CO0FBQUEsdUNBR2hCO0FBQUE7QUFBQSxXQUNKO0FBQUEsWUFDQTtBQUFBLFVBQ0E7QUFBQSwrQkFDQTtBQUFBLFVBQ0E7QUFBQSxjQUNBO0FBQUEsUUFIVTtBQUFBO0FBQUE7QUFBQTtBQUFBIiwiZmlsZSI6InBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2pzb24vc2NoZW1hL3NlcmlhbGl6ZXJzL3RlbXBsYXRlcy9qYXZhc2NyaXB0L3Byb3Atb2JqZWN0LmVqcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG48JVxuICBjb25zdCByZXF1aXJlZCA9IChzY2hlbWEucmVxdWlyZWQgfHwgW10pO1xuICBjb25zdCBleHRyYXMgPSB7XG4gICAgZXhjZXB0aW9uczogZXhjZXB0aW9ucyxcbiAgICBvcHRpb25zOiBvcHRpb25zLFxuICAgIHBhdGg6IHBhdGgsXG4gICAgc3RyaW5nczogc3RyaW5ncyxcbiAgICBzeW1ib2xzOiBzeW1ib2xzLFxuICAgIHRlbXBsYXRlczogdGVtcGxhdGVzLFxuICB9O1xuJT5cblxuY29uc3QgYWRkaXRpb25hbFByb3BlcnRpZXMgPSB7fTtcbmNvbnN0IGFkZGl0aW9uYWxQcm9wZXJ0eUhhbmRsZXIgPSA8JVxuaWYgKCEoJ2FkZGl0aW9uYWxQcm9wZXJ0aWVzJyBpbiBzY2hlbWEpKSB7ICU+bnVsbDwlIH0gZWxzZSB7ICU+IGZ1bmN0aW9uKCkgeyByZXR1cm4gKDwlPVxuICB0ZW1wbGF0ZXMuc3Vic2NoZW1hKE9iamVjdC5hc3NpZ24oe1xuICAgIG5hbWU6ICc/Pz8nLFxuICAgIHJlcXVpcmVkOiBmYWxzZSxcbiAgICBzY2hlbWE6IHNjaGVtYS5hZGRpdGlvbmFsUHJvcGVydGllcyxcbiAgfSwgZXh0cmFzKSkgJT4pOyB9PCVcbn1cbiU+O1xuXG5jb25zdCBoYW5kbGVycyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG48JVxuICBmb3IgKGNvbnN0IHByb3BOYW1lIG9mIE9iamVjdC5rZXlzKHNjaGVtYS5wcm9wZXJ0aWVzKSkge1xuICAgIGNvbnN0IF9rZXkgPSBKU09OLnN0cmluZ2lmeShwcm9wTmFtZSk7XG4gICAgY29uc3QgX25hbWUgPSBwcm9wTmFtZS5tYXRjaCgvXltfYS16QS1aXVtfYS16QS1aMC05XSokLykgPyBwcm9wTmFtZSA6IGBbJHtfa2V5fV1gO1xuJT5oYW5kbGVyc1s8JT0gSlNPTi5zdHJpbmdpZnkoX25hbWUpICU+XSA9IDwlPVxuICB0ZW1wbGF0ZXMuc3Vic2NoZW1hKE9iamVjdC5hc3NpZ24oe1xuICAgIG5hbWU6IF9uYW1lLFxuICAgIHJlcXVpcmVkOiByZXF1aXJlZC5pbmRleE9mKHByb3BOYW1lKSAhPSAtMSxcbiAgICBzY2hlbWE6IHNjaGVtYS5wcm9wZXJ0aWVzW3Byb3BOYW1lXSxcbiAgfSwgZXh0cmFzKSlcbiU+PCVcbn1cbiU+XG5cbmNvbnN0IG9iamVjdEZ1bmN0aW9ucyA9IHtcbiAgaGFzT3duUHJvcGVydHkobmFtZSkgeyByZXR1cm4gb2JqZWN0UHJveHlIYW5kbGVyLmhhcyhudWxsLCBuYW1lKTsgfSxcbn07XG5cblxubGV0IGRlZmluZWQgPSBmYWxzZTtcbmNvbnN0IG9iamVjdFByb3h5SGFuZGxlciA9IHtcbiAgaXNFeHRlbnNpYmxlKCkgeyByZXR1cm4gZmFsc2U7IH0sXG4gIGhhcyh0YXJnZXQsIHByb3ApIHtcbiAgICByZXR1cm4gKHByb3AgaW4gaGFuZGxlcnMgJiYgaGFuZGxlcnNbcHJvcF0uaXNEZWZpbmVkKCkpXG4gICAgICAgIHx8IChhZGRpdGlvbmFsUHJvcGVydHlIYW5kbGVyXG4gICAgICAgICAgICA/IChwcm9wIGluIGFkZGl0aW9uYWxQcm9wZXJ0aWVzICYmIGFkZGl0aW9uYWxQcm9wZXJ0aWVzW3Byb3BdLmlzRGVmaW5lZCgpKVxuICAgICAgICAgICAgOiBmYWxzZSk7XG4gIH0sXG4gIGdldCh0YXJnZXQsIHByb3ApIHtcbiAgICBpZiAocHJvcCA9PT0gc3ltYm9scy5TY2hlbWEpIHtcbiAgICAgIHJldHVybiBvYmplY3RIYW5kbGVyLnNjaGVtYTtcbiAgICB9XG4gICAgaWYgKHByb3AgaW4gaGFuZGxlcnMpIHtcbiAgICAgIHJldHVybiBoYW5kbGVyc1twcm9wXS5nZXQoKTtcbiAgICB9XG4gICAgaWYgKHByb3AgaW4gb2JqZWN0RnVuY3Rpb25zKSB7XG4gICAgICByZXR1cm4gb2JqZWN0RnVuY3Rpb25zW3Byb3BdO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9LFxuICBzZXQodGFyZ2V0LCBwcm9wLCB2KSB7XG4gICAgZGVmaW5lZCA9IHRydWU7XG4gICAgaWYgKHByb3AgaW4gaGFuZGxlcnMpIHtcbiAgICAgIGhhbmRsZXJzW3Byb3BdLnNldCh2KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoYWRkaXRpb25hbFByb3BlcnR5SGFuZGxlcikge1xuICAgICAgaWYgKCEocHJvcCBpbiBhZGRpdGlvbmFsUHJvcGVydGllcykpIHtcbiAgICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXNbcHJvcF0gPSBhZGRpdGlvbmFsUHJvcGVydHlIYW5kbGVyKHByb3ApO1xuICAgICAgfVxuICAgICAgYWRkaXRpb25hbFByb3BlcnRpZXNbcHJvcF0uc2V0KHYpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIDwlIGlmIChvcHRpb25zLmlnbm9yZUV4dHJhUHJvcGVydGllcyAhPT0gdHJ1ZSkge1xuICAgICAgJT50aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkUHJvcGVydHlOYW1lRXhjZXB0aW9uKDwlPSBKU09OLnN0cmluZ2lmeShwYXRoKSAlPiArICcvJyArIHByb3ApOzwlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBKdXN0IGlnbm9yZSB0aGUgcHJvcGVydHkuXG4gICAgICAlPnJldHVybiB0cnVlOzwlXG4gICAgICB9ICU+XG4gICAgfVxuICB9LFxuICBkZWxldGVQcm9wZXJ0eSh0YXJnZXQsIHByb3ApIHtcbiAgICBpZiAocHJvcCBpbiBoYW5kbGVycykge1xuICAgICAgaGFuZGxlcnNbcHJvcF0ucmVtb3ZlKCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKGFkZGl0aW9uYWxQcm9wZXJ0eUhhbmRsZXIgJiYgcHJvcCBpbiBhZGRpdGlvbmFsUHJvcGVydGllcykge1xuICAgICAgZGVsZXRlIGFkZGl0aW9uYWxQcm9wZXJ0aWVzW3Byb3BdO1xuICAgIH1cbiAgfSxcbiAgZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wLCBkZXNjcmlwdG9yKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBwcm9wKSB7XG4gICAgaWYgKHByb3AgaW4gaGFuZGxlcnMpIHtcbiAgICAgIHJldHVybiB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogdHJ1ZSB9O1xuICAgIH0gZWxzZSBpZiAoYWRkaXRpb25hbFByb3BlcnR5SGFuZGxlciAmJiBwcm9wIGluIGFkZGl0aW9uYWxQcm9wZXJ0eUhhbmRsZXIpIHtcbiAgICAgIHJldHVybiB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogdHJ1ZSB9O1xuICAgIH1cbiAgfSxcbiAgb3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gW10uY29uY2F0KFxuICAgICAgT2JqZWN0LmtleXMoaGFuZGxlcnMpLFxuICAgICAgYWRkaXRpb25hbFByb3BlcnR5SGFuZGxlciA/IE9iamVjdC5rZXlzKGFkZGl0aW9uYWxQcm9wZXJ0aWVzKSA6IFtdXG4gICAgKTtcbiAgfSxcbn07XG5cblxuY29uc3QgcHJveHkgPSBuZXcgUHJveHkoe30sIG9iamVjdFByb3h5SGFuZGxlcik7XG5cbmNvbnN0IG9iamVjdEhhbmRsZXIgPSB7XG4gIHNldCh2KSB7XG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZGVmaW5lZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGRlZmluZWQgPSB0cnVlO1xuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHYpKSB7XG4gICAgICBwcm94eVtrZXldID0gdltrZXldO1xuICAgIH1cblxuICAgIC8vIFZhbGlkYXRlIHJlcXVpcmVkIGZpZWxkcy5cbiAgICA8JSBmb3IgKGNvbnN0IGtleSBvZiByZXF1aXJlZCkgeyAlPlxuICAgIGlmICghKDwlPSBKU09OLnN0cmluZ2lmeShrZXkpICU+IGluIHYpKSB7XG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5SZXF1aXJlZFZhbHVlTWlzc2luZ0V4Y2VwdGlvbig8JT0gSlNPTi5zdHJpbmdpZnkocGF0aCkgJT4gKyAnLycgKyA8JT0gSlNPTi5zdHJpbmdpZnkoa2V5KSAlPik7XG4gICAgfTwlIH0gJT5cbiAgfSxcbiAgZ2V0KCkge1xuICAgIGlmICg8JT0gb3B0aW9ucy5hbGxvd0FjY2Vzc1VuZGVmaW5lZE9iamVjdHMgPT09IHRydWUgJT4gfHwgdGhpcy5pc0RlZmluZWQoKSkge1xuICAgICAgcmV0dXJuIHByb3h5O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gPCU9ICdkZWZhdWx0JyBpbiBzY2hlbWEgPyBKU09OLnN0cmluZ2lmeShzY2hlbWEuZGVmYXVsdCkgOiAndW5kZWZpbmVkJyAlPjtcbiAgICB9XG4gIH0sXG4gIGlzRGVmaW5lZCgpIHtcbiAgICByZXR1cm4gZGVmaW5lZFxuICAgICAgJiYgKE9iamVjdC5rZXlzKGhhbmRsZXJzKS5zb21lKGZ1bmN0aW9uKHgpIHsgcmV0dXJuIGhhbmRsZXJzW3hdLmlzRGVmaW5lZCgpOyB9KVxuICAgICAgICAgIHx8IE9iamVjdC5rZXlzKGFkZGl0aW9uYWxQcm9wZXJ0aWVzKS5zb21lKGZ1bmN0aW9uKHgpIHtcbiAgICAgICAgICAgIHJldHVybiBhZGRpdGlvbmFsUHJvcGVydGllc1t4XS5pc0RlZmluZWQoKTtcbiAgICAgICAgICB9KSk7XG4gIH0sXG4gIHJlbW92ZSgpIHsgdGhpcy5zZXQodW5kZWZpbmVkKTsgfSxcbiAgc2NoZW1hOiA8JT0gSlNPTi5zdHJpbmdpZnkoc2NoZW1hKSAlPixcbn07XG5cbnJldHVybiBvYmplY3RIYW5kbGVyO1xuXG59KSgpXG4iXX0=