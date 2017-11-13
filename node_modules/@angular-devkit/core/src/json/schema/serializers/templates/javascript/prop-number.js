return module.exports.default = function(obj) {
  obj || (obj = {});
  let __t;
  let __p = "";
  const __escapes = {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;","`":"&#96;"};
  const __escapesre = new RegExp('[&<>"\\\'`]', 'g');

  const __e = function(s) {     return s ? s.replace(__escapesre, function(key) { return __escapes[key]; }) : '';  };
  with (obj) {
__p = __p
    + "{\n"
    + "";

  if ('default' in schema && typeof schema.default != 'number'
      || 'minimum' in schema && typeof schema.minimum != 'number'
      || 'maximum' in schema && typeof schema.maximum != 'number'
      || 'multipleOf' in schema && typeof schema.multipleOf != 'number'
      || (!('minimum' in schema) && 'exclusiveMinimum' in schema)
      || (!('maximum' in schema) && 'exclusiveMaximum' in schema)) {
    throw new exceptions.InvalidSchemaException(schema);
  }

__p = __p
    + "\n"
    + "  value: undefined,\n"
    + "  get() { return this.value === undefined ? ";
__p += ((__t =  schema.default || 'undefined' ) == null ? "" : __t);
__p = __p
    + " : this.value; },\n"
    + "  set(v) {\n"
    + "    if (v === undefined && ";
__p += ((__t =  !required ) == null ? "" : __t);
__p = __p
    + ") {\n"
    + "      this.value = undefined;\n"
    + "      return;\n"
    + "    }\n"
    + "    if (typeof v != 'number') {\n"
    + "      throw new exceptions.InvalidValueException(";
__p += ((__t =  JSON.stringify(name) ) == null ? "" : __t);
__p = __p
    + ", typeof v, 'number');\n"
    + "    }";

if (schema.type == 'integer') { 
__p = __p
    + "\n"
    + "    if (v % 1 != 0) {\n"
    + "      throw new exceptions.InvalidValueException(";
__p += ((__t =  JSON.stringify(name) ) == null ? "" : __t);
__p = __p
    + ", v, 'integer');\n"
    + "    }";

}
if ('minimum' in schema) { 
__p = __p
    + "\n"
    + "    if (v ";
__p += ((__t =  schema.exclusiveMinimum ? '<=' : '<' ) == null ? "" : __t);
__p = __p
    + " ";
__p += ((__t =  schema.minimum ) == null ? "" : __t);
__p = __p
    + ") {\n"
    + "      throw new exceptions.InvalidRangeException(";
__p += ((__t =  JSON.stringify(name) ) == null ? "" : __t);
__p = __p
    + ", v, '>=', ";
__p += ((__t =  schema.minimum ) == null ? "" : __t);
__p = __p
    + ");\n"
    + "    }";

}
if ('maximum' in schema) { 
__p = __p
    + "\n"
    + "  if (v ";
__p += ((__t =  schema.exclusiveMaximum ? '>=' : '>' ) == null ? "" : __t);
__p = __p
    + " ";
__p += ((__t =  schema.maximum ) == null ? "" : __t);
__p = __p
    + ") {\n"
    + "    throw new exceptions.InvalidRangeException(";
__p += ((__t =  JSON.stringify(name) ) == null ? "" : __t);
__p = __p
    + ", v, '>=', ";
__p += ((__t =  schema.maximum ) == null ? "" : __t);
__p = __p
    + ");\n"
    + "  }";

}
if ('multipleOf' in schema) { 
__p = __p
    + "\n"
    + "  if (v % ";
__p += ((__t =  schema.multipleOf ) == null ? "" : __t);
__p = __p
    + " != 0) {\n"
    + "    throw new exceptions.InvalidRangeException(";
__p += ((__t =  JSON.stringify(name) ) == null ? "" : __t);
__p = __p
    + ", v, 'multiple of', ";
__p += ((__t =  schema.maximum ) == null ? "" : __t);
__p = __p
    + ");\n"
    + "  }";

} 
__p = __p
    + "\n"
    + "    this.value = v;\n"
    + "  },\n"
    + "  isDefined() { return this.value !== undefined; },\n"
    + "  remove() { this.set(undefined); },\n"
    + "  schema() { return ";
__p += ((__t =  JSON.stringify(schema) ) == null ? "" : __t);
__p = __p
    + "; },\n"
    + "}\n"
    + "";
  };

  return __p;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2pzb24vc2NoZW1hL3NlcmlhbGl6ZXJzL3RlbXBsYXRlcy9qYXZhc2NyaXB0L3Byb3AtbnVtYmVyLmVqcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQ0E7QUFBQSxRQURDO0FBQUE7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUU7QUFBQTtBQUFBLFVBQ0Y7QUFBQSw2QkFDQTtBQUFBLG9EQUE0QztBQUFBLDhDQUFvQztBQUFBO0FBQUEsMkJBQ2hGO0FBQUEsb0JBQ0E7QUFBQSxtQ0FBMkI7QUFBQSwwQkFBZ0I7QUFBQTtBQUFBLGFBQzNDO0FBQUEsdUNBQ0E7QUFBQSx1QkFDQTtBQUFBLGVBQ0E7QUFBQSx5Q0FDQTtBQUFBLHlEQUFpRDtBQUFBLHFDQUEyQjtBQUFBO0FBQUEsZ0NBQzVFO0FBQUEsYUFBSztBQUFBO0FBQ0wsZ0NBQ0E7QUFBQTtBQUFBLFVBQ0E7QUFBQSwrQkFDQTtBQUFBLHlEQURrRDtBQUFBLHFDQUEyQjtBQUFBO0FBQUEsMEJBQzdFO0FBQUEsYUFBTTtBQUFBO0FBQ047QUFDQSwyQkFDQztBQUFBO0FBQUEsVUFDRDtBQUFBLGtCQURZO0FBQUEscURBQTJDO0FBQUE7QUFBQSxTQUFDO0FBQUEsK0JBQXFCO0FBQUE7QUFBQSxhQUM3RTtBQUFBLHlEQUFtRDtBQUFBLHFDQUEyQjtBQUFBO0FBQUEsbUJBQVc7QUFBQSwrQkFBcUI7QUFBQTtBQUFBLFlBQzlHO0FBQUEsYUFBTztBQUFBO0FBQ1A7QUFDQSwyQkFDRTtBQUFBO0FBQUEsVUFDRjtBQUFBLGdCQURXO0FBQUEscURBQTJDO0FBQUE7QUFBQSxTQUFDO0FBQUEsK0JBQXFCO0FBQUE7QUFBQSxhQUM1RTtBQUFBLHVEQUFrRDtBQUFBLHFDQUEyQjtBQUFBO0FBQUEsbUJBQVc7QUFBQSwrQkFDeEY7QUFBQTtBQUFBLFlBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQSw4QkFBRztBQUFBO0FBQUEsVUFDSDtBQUFBLGtCQURjO0FBQUEsa0NBQXdCO0FBQUE7QUFBQSxrQkFDdEM7QUFBQSx1REFBbUQ7QUFBQSxxQ0FBMkI7QUFBQTtBQUFBLDRCQUFvQjtBQUFBLCtCQUNqRztBQUFBO0FBQUEsWUFDRDtBQUFBLFdBQUM7QUFBQTtBQUNELEVBQUk7QUFBQTtBQUFBLFVBQ0o7QUFBQSw2QkFDQTtBQUFBLGNBQ0E7QUFBQSw2REFDQTtBQUFBLDhDQUNBO0FBQUEsNEJBRHlCO0FBQUEsdUNBQ3pCO0FBQUE7QUFBQSxjQUNBO0FBQUEsV0FDQTtBQUFBLFFBREs7QUFBQTtBQUFBO0FBQUE7QUFBQSIsImZpbGUiOiJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9jb3JlL3NyYy9qc29uL3NjaGVtYS9zZXJpYWxpemVycy90ZW1wbGF0ZXMvamF2YXNjcmlwdC9wcm9wLW51bWJlci5lanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0Iiwic291cmNlc0NvbnRlbnQiOlsie1xuPCVcbiAgaWYgKCdkZWZhdWx0JyBpbiBzY2hlbWEgJiYgdHlwZW9mIHNjaGVtYS5kZWZhdWx0ICE9ICdudW1iZXInXG4gICAgICB8fCAnbWluaW11bScgaW4gc2NoZW1hICYmIHR5cGVvZiBzY2hlbWEubWluaW11bSAhPSAnbnVtYmVyJ1xuICAgICAgfHwgJ21heGltdW0nIGluIHNjaGVtYSAmJiB0eXBlb2Ygc2NoZW1hLm1heGltdW0gIT0gJ251bWJlcidcbiAgICAgIHx8ICdtdWx0aXBsZU9mJyBpbiBzY2hlbWEgJiYgdHlwZW9mIHNjaGVtYS5tdWx0aXBsZU9mICE9ICdudW1iZXInXG4gICAgICB8fCAoISgnbWluaW11bScgaW4gc2NoZW1hKSAmJiAnZXhjbHVzaXZlTWluaW11bScgaW4gc2NoZW1hKVxuICAgICAgfHwgKCEoJ21heGltdW0nIGluIHNjaGVtYSkgJiYgJ2V4Y2x1c2l2ZU1heGltdW0nIGluIHNjaGVtYSkpIHtcbiAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkU2NoZW1hRXhjZXB0aW9uKHNjaGVtYSk7XG4gIH1cbiU+XG4gIHZhbHVlOiB1bmRlZmluZWQsXG4gIGdldCgpIHsgcmV0dXJuIHRoaXMudmFsdWUgPT09IHVuZGVmaW5lZCA/IDwlPSBzY2hlbWEuZGVmYXVsdCB8fCAndW5kZWZpbmVkJyAlPiA6IHRoaXMudmFsdWU7IH0sXG4gIHNldCh2KSB7XG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCAmJiA8JT0gIXJlcXVpcmVkICU+KSB7XG4gICAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIHYgIT0gJ251bWJlcicpIHtcbiAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLkludmFsaWRWYWx1ZUV4Y2VwdGlvbig8JT0gSlNPTi5zdHJpbmdpZnkobmFtZSkgJT4sIHR5cGVvZiB2LCAnbnVtYmVyJyk7XG4gICAgfTwlXG5pZiAoc2NoZW1hLnR5cGUgPT0gJ2ludGVnZXInKSB7ICU+XG4gICAgaWYgKHYgJSAxICE9IDApIHtcbiAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLkludmFsaWRWYWx1ZUV4Y2VwdGlvbig8JT0gSlNPTi5zdHJpbmdpZnkobmFtZSkgJT4sIHYsICdpbnRlZ2VyJyk7XG4gICAgfTwlXG59XG5pZiAoJ21pbmltdW0nIGluIHNjaGVtYSkgeyAlPlxuICAgIGlmICh2IDwlPSBzY2hlbWEuZXhjbHVzaXZlTWluaW11bSA/ICc8PScgOiAnPCcgJT4gPCU9IHNjaGVtYS5taW5pbXVtICU+KSB7XG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkUmFuZ2VFeGNlcHRpb24oPCU9IEpTT04uc3RyaW5naWZ5KG5hbWUpICU+LCB2LCAnPj0nLCA8JT0gc2NoZW1hLm1pbmltdW0gJT4pO1xuICAgIH08JVxufVxuaWYgKCdtYXhpbXVtJyBpbiBzY2hlbWEpIHsgJT5cbiAgaWYgKHYgPCU9IHNjaGVtYS5leGNsdXNpdmVNYXhpbXVtID8gJz49JyA6ICc+JyAlPiA8JT0gc2NoZW1hLm1heGltdW0gJT4pIHtcbiAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkUmFuZ2VFeGNlcHRpb24oPCU9IEpTT04uc3RyaW5naWZ5KG5hbWUpICU+LCB2LCAnPj0nLCA8JT0gc2NoZW1hLm1heGltdW0gJT4pO1xuICB9PCVcbn1cbmlmICgnbXVsdGlwbGVPZicgaW4gc2NoZW1hKSB7ICU+XG4gIGlmICh2ICUgPCU9IHNjaGVtYS5tdWx0aXBsZU9mICU+ICE9IDApIHtcbiAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkUmFuZ2VFeGNlcHRpb24oPCU9IEpTT04uc3RyaW5naWZ5KG5hbWUpICU+LCB2LCAnbXVsdGlwbGUgb2YnLCA8JT0gc2NoZW1hLm1heGltdW0gJT4pO1xuICB9PCVcbn0gJT5cbiAgICB0aGlzLnZhbHVlID0gdjtcbiAgfSxcbiAgaXNEZWZpbmVkKCkgeyByZXR1cm4gdGhpcy52YWx1ZSAhPT0gdW5kZWZpbmVkOyB9LFxuICByZW1vdmUoKSB7IHRoaXMuc2V0KHVuZGVmaW5lZCk7IH0sXG4gIHNjaGVtYSgpIHsgcmV0dXJuIDwlPSBKU09OLnN0cmluZ2lmeShzY2hlbWEpICU+OyB9LFxufVxuIl19