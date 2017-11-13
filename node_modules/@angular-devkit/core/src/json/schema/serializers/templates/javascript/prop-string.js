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

if ('default' in schema && typeof schema.default != 'string'
    || 'minLength' in schema && (typeof schema.minLength != 'number' || schema.minLength < 0)
    || 'maxLength' in schema && (typeof schema.maxLength != 'number' || schema.maxLength < 0)
    || 'pattern' in schema && typeof schema.pattern != 'string'
    || 'format' in schema && typeof schema.format != 'string') {
  throw new exceptions.InvalidSchemaException(schema);
}

const pattern = ('pattern' in schema) ? new RegExp(schema.pattern) : null;

__p = __p
    + "\n"
    + "  value: undefined,\n"
    + "  get() { return this.value === undefined ? ";
__p += ((__t =  JSON.stringify(schema.default) || 'undefined' ) == null ? "" : __t);
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
    + "    if (typeof v != 'string') {\n"
    + "      throw new exceptions.InvalidValueException(";
__p += ((__t =  JSON.stringify(name) ) == null ? "" : __t);
__p = __p
    + ", typeof v, 'string');\n"
    + "    }";

if ('minLength' in schema) { 
__p = __p
    + "\n"
    + "    if (v.length <= ";
__p += ((__t =  schema.minLength ) == null ? "" : __t);
__p = __p
    + ") {\n"
    + "      throw new exceptions.InvalidRangeException(";
__p += ((__t =  JSON.stringify(name) ) == null ? "" : __t);
__p = __p
    + ", v, 'longer', ";
__p += ((__t =  schema.minLength ) == null ? "" : __t);
__p = __p
    + ");\n"
    + "    }";

}
if ('maxLength' in schema) { 
__p = __p
    + "\n"
    + "    if (v.length >= ";
__p += ((__t =  schema.maxLength ) == null ? "" : __t);
__p = __p
    + ") {\n"
    + "      throw new exceptions.InvalidRangeException(";
__p += ((__t =  JSON.stringify(name) ) == null ? "" : __t);
__p = __p
    + ", v, 'smaller', ";
__p += ((__t =  schema.maxLength ) == null ? "" : __t);
__p = __p
    + ");\n"
    + "    }";

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2pzb24vc2NoZW1hL3NlcmlhbGl6ZXJzL3RlbXBsYXRlcy9qYXZhc2NyaXB0L3Byb3Atc3RyaW5nLmVqcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQ0E7QUFBQSxRQURDO0FBQUE7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFRTtBQUFBO0FBQUEsVUFDRjtBQUFBLDZCQUNBO0FBQUEsb0RBQTRDO0FBQUEsOERBQW9EO0FBQUE7QUFBQSwyQkFDaEc7QUFBQSxvQkFDQTtBQUFBLG1DQUEyQjtBQUFBLDBCQUFnQjtBQUFBO0FBQUEsYUFDM0M7QUFBQSx1Q0FDQTtBQUFBLHVCQUNBO0FBQUEsZUFDQTtBQUFBLHlDQUNBO0FBQUEseURBQWlEO0FBQUEscUNBQTJCO0FBQUE7QUFBQSxnQ0FDNUU7QUFBQSxhQUFLO0FBQUE7QUFDTCw2QkFDQTtBQUFBO0FBQUEsVUFDQTtBQUFBLDRCQURxQjtBQUFBLGlDQUF1QjtBQUFBO0FBQUEsYUFDNUM7QUFBQSx5REFBa0Q7QUFBQSxxQ0FBMkI7QUFBQTtBQUFBLHVCQUFlO0FBQUEsaUNBQXVCO0FBQUE7QUFBQSxZQUNuSDtBQUFBLGFBQU07QUFBQTtBQUNOO0FBQ0EsNkJBQ0M7QUFBQTtBQUFBLFVBQ0Q7QUFBQSw0QkFEc0I7QUFBQSxpQ0FBdUI7QUFBQTtBQUFBLGFBQzdDO0FBQUEseURBQW1EO0FBQUEscUNBQTJCO0FBQUE7QUFBQSx3QkFBZ0I7QUFBQSxpQ0FBdUI7QUFBQTtBQUFBLFlBQ3JIO0FBQUEsYUFBTztBQUFBO0FBQ1A7QUFFRTtBQUFBO0FBQUEsVUFDRjtBQUFBLDZCQUNBO0FBQUEsY0FDQTtBQUFBLDZEQUNBO0FBQUEsOENBQ0E7QUFBQSw0QkFEdUI7QUFBQSx1Q0FBNkI7QUFBQTtBQUFBLGNBQ3BEO0FBQUEsV0FDQTtBQUFBLFFBQUc7QUFBQTtBQUFBO0FBQUE7QUFBQSIsImZpbGUiOiJwYWNrYWdlcy9hbmd1bGFyX2RldmtpdC9jb3JlL3NyYy9qc29uL3NjaGVtYS9zZXJpYWxpemVycy90ZW1wbGF0ZXMvamF2YXNjcmlwdC9wcm9wLXN0cmluZy5lanMiLCJzb3VyY2VSb290IjoiL1VzZXJzL2hhbnNsL1NvdXJjZXMvaGFuc2wvZGV2a2l0Iiwic291cmNlc0NvbnRlbnQiOlsie1xuPCVcbmlmICgnZGVmYXVsdCcgaW4gc2NoZW1hICYmIHR5cGVvZiBzY2hlbWEuZGVmYXVsdCAhPSAnc3RyaW5nJ1xuICAgIHx8ICdtaW5MZW5ndGgnIGluIHNjaGVtYSAmJiAodHlwZW9mIHNjaGVtYS5taW5MZW5ndGggIT0gJ251bWJlcicgfHwgc2NoZW1hLm1pbkxlbmd0aCA8IDApXG4gICAgfHwgJ21heExlbmd0aCcgaW4gc2NoZW1hICYmICh0eXBlb2Ygc2NoZW1hLm1heExlbmd0aCAhPSAnbnVtYmVyJyB8fCBzY2hlbWEubWF4TGVuZ3RoIDwgMClcbiAgICB8fCAncGF0dGVybicgaW4gc2NoZW1hICYmIHR5cGVvZiBzY2hlbWEucGF0dGVybiAhPSAnc3RyaW5nJ1xuICAgIHx8ICdmb3JtYXQnIGluIHNjaGVtYSAmJiB0eXBlb2Ygc2NoZW1hLmZvcm1hdCAhPSAnc3RyaW5nJykge1xuICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkU2NoZW1hRXhjZXB0aW9uKHNjaGVtYSk7XG59XG5cbmNvbnN0IHBhdHRlcm4gPSAoJ3BhdHRlcm4nIGluIHNjaGVtYSkgPyBuZXcgUmVnRXhwKHNjaGVtYS5wYXR0ZXJuKSA6IG51bGw7XG4lPlxuICB2YWx1ZTogdW5kZWZpbmVkLFxuICBnZXQoKSB7IHJldHVybiB0aGlzLnZhbHVlID09PSB1bmRlZmluZWQgPyA8JT0gSlNPTi5zdHJpbmdpZnkoc2NoZW1hLmRlZmF1bHQpIHx8ICd1bmRlZmluZWQnICU+IDogdGhpcy52YWx1ZTsgfSxcbiAgc2V0KHYpIHtcbiAgICBpZiAodiA9PT0gdW5kZWZpbmVkICYmIDwlPSAhcmVxdWlyZWQgJT4pIHtcbiAgICAgIHRoaXMudmFsdWUgPSB1bmRlZmluZWQ7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0eXBlb2YgdiAhPSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuSW52YWxpZFZhbHVlRXhjZXB0aW9uKDwlPSBKU09OLnN0cmluZ2lmeShuYW1lKSAlPiwgdHlwZW9mIHYsICdzdHJpbmcnKTtcbiAgICB9PCVcbmlmICgnbWluTGVuZ3RoJyBpbiBzY2hlbWEpIHsgJT5cbiAgICBpZiAodi5sZW5ndGggPD0gPCU9IHNjaGVtYS5taW5MZW5ndGggJT4pIHtcbiAgICAgIHRocm93IG5ldyBleGNlcHRpb25zLkludmFsaWRSYW5nZUV4Y2VwdGlvbig8JT0gSlNPTi5zdHJpbmdpZnkobmFtZSkgJT4sIHYsICdsb25nZXInLCA8JT0gc2NoZW1hLm1pbkxlbmd0aCAlPik7XG4gICAgfTwlXG59XG5pZiAoJ21heExlbmd0aCcgaW4gc2NoZW1hKSB7ICU+XG4gICAgaWYgKHYubGVuZ3RoID49IDwlPSBzY2hlbWEubWF4TGVuZ3RoICU+KSB7XG4gICAgICB0aHJvdyBuZXcgZXhjZXB0aW9ucy5JbnZhbGlkUmFuZ2VFeGNlcHRpb24oPCU9IEpTT04uc3RyaW5naWZ5KG5hbWUpICU+LCB2LCAnc21hbGxlcicsIDwlPSBzY2hlbWEubWF4TGVuZ3RoICU+KTtcbiAgICB9PCVcbn1cbiU+XG4gICAgdGhpcy52YWx1ZSA9IHY7XG4gIH0sXG4gIGlzRGVmaW5lZCgpIHsgcmV0dXJuIHRoaXMudmFsdWUgIT09IHVuZGVmaW5lZDsgfSxcbiAgcmVtb3ZlKCkgeyB0aGlzLnNldCh1bmRlZmluZWQpOyB9LFxuICBzY2hlbWEoKSB7IHJldHVybiA8JT0gSlNPTi5zdHJpbmdpZnkoc2NoZW1hKSAlPjsgfSxcbn1cbiJdfQ==