return module.exports.default = function(obj) {
  obj || (obj = {});
  let __t;
  let __p = "";
  const __escapes = {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;","`":"&#96;"};
  const __escapesre = new RegExp('[&<>"\\\'`]', 'g');

  const __e = function(s) {     return s ? s.replace(__escapesre, function(key) { return __escapes[key]; }) : '';  };
  with (obj) {

const extras = {
  exceptions,
  options,
  strings,
  symbols,
  templates,
};

__p = __p
    + "\n"
    + "\n"
    + "const holder = ";
__p += ((__t =  templates.subschema(Object.assign({
  name: name,
  path: '',
  required: false,
  schema: schema,
}, extras))
) == null ? "" : __t);
__p = __p
    + ";\n"
    + "\n"
    + "holder.set(value);\n"
    + "return holder.get();\n"
    + "";
  };

  return __p;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2pzb24vc2NoZW1hL3NlcmlhbGl6ZXJzL3RlbXBsYXRlcy9qYXZhc2NyaXB0L3Jvb3QuZWpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRTtBQUFBO0FBQUEsVUFDRjtBQUFBLFVBQ0E7QUFBQSx1QkFBZTtBQUFBO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNFO0FBQUE7QUFBQSxXQUNGO0FBQUEsVUFDQTtBQUFBLDRCQUNBO0FBQUEsOEJBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBIiwiZmlsZSI6InBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2pzb24vc2NoZW1hL3NlcmlhbGl6ZXJzL3RlbXBsYXRlcy9qYXZhc2NyaXB0L3Jvb3QuZWpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2hhbnNsL2RldmtpdCIsInNvdXJjZXNDb250ZW50IjpbIjwlXG5jb25zdCBleHRyYXMgPSB7XG4gIGV4Y2VwdGlvbnMsXG4gIG9wdGlvbnMsXG4gIHN0cmluZ3MsXG4gIHN5bWJvbHMsXG4gIHRlbXBsYXRlcyxcbn07XG4lPlxuXG5jb25zdCBob2xkZXIgPSA8JT0gdGVtcGxhdGVzLnN1YnNjaGVtYShPYmplY3QuYXNzaWduKHtcbiAgbmFtZTogbmFtZSxcbiAgcGF0aDogJycsXG4gIHJlcXVpcmVkOiBmYWxzZSxcbiAgc2NoZW1hOiBzY2hlbWEsXG59LCBleHRyYXMpKVxuJT47XG5cbmhvbGRlci5zZXQodmFsdWUpO1xucmV0dXJuIGhvbGRlci5nZXQoKTtcbiJdfQ==