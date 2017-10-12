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
  path: (path ? path + '/' : '') + name,
  strings,
  symbols,
  templates,
};

if (!schema) {
  
__p = __p
    + "null";

} else if (schema === true) {

__p += ((__t = 
  templates.prop_any(Object.assign({
    name,
    required,
    schema: {},
  }, extras))
) == null ? "" : __t);

} else if (!('type' in schema)) {

__p += ((__t = 
  templates.prop_any(Object.assign({
    name,
    required,
    schema: {},
  }, extras))
) == null ? "" : __t);

} else {

__p += ((__t = 
  templates['prop_' + schema.type](Object.assign({
    name: name,
    required,
    schema: schema,
  }, extras))
) == null ? "" : __t);

}

__p = __p
    + "\n"
    + "";
  };

  return __p;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2pzb24vc2NoZW1hL3NlcmlhbGl6ZXJzL3RlbXBsYXRlcy9qYXZhc2NyaXB0L3N1YnNjaGVtYS5lanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUk7QUFBQTtBQUFBLFlBQUk7QUFBQTtBQUNSO0FBQ0c7QUFBQTtBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDRztBQUFBO0FBQ0g7QUFDSTtBQUFBO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNJO0FBQUE7QUFDSjtBQUNLO0FBQUE7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFBQTtBQUNBO0FBQ0c7QUFBQTtBQUFBLFVBQ0g7QUFBQSxRQURJO0FBQUE7QUFBQTtBQUFBO0FBQUEiLCJmaWxlIjoicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvanNvbi9zY2hlbWEvc2VyaWFsaXplcnMvdGVtcGxhdGVzL2phdmFzY3JpcHQvc3Vic2NoZW1hLmVqcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQiLCJzb3VyY2VzQ29udGVudCI6WyI8JVxuY29uc3QgZXh0cmFzID0ge1xuICBleGNlcHRpb25zLFxuICBvcHRpb25zLFxuICBwYXRoOiAocGF0aCA/IHBhdGggKyAnLycgOiAnJykgKyBuYW1lLFxuICBzdHJpbmdzLFxuICBzeW1ib2xzLFxuICB0ZW1wbGF0ZXMsXG59O1xuXG5pZiAoIXNjaGVtYSkge1xuICAlPm51bGw8JVxufSBlbHNlIGlmIChzY2hlbWEgPT09IHRydWUpIHtcbiU+PCU9XG4gIHRlbXBsYXRlcy5wcm9wX2FueShPYmplY3QuYXNzaWduKHtcbiAgICBuYW1lLFxuICAgIHJlcXVpcmVkLFxuICAgIHNjaGVtYToge30sXG4gIH0sIGV4dHJhcykpXG4lPjwlXG59IGVsc2UgaWYgKCEoJ3R5cGUnIGluIHNjaGVtYSkpIHtcbiU+PCU9XG4gIHRlbXBsYXRlcy5wcm9wX2FueShPYmplY3QuYXNzaWduKHtcbiAgICBuYW1lLFxuICAgIHJlcXVpcmVkLFxuICAgIHNjaGVtYToge30sXG4gIH0sIGV4dHJhcykpXG4lPjwlXG59IGVsc2Uge1xuJT48JT1cbiAgdGVtcGxhdGVzWydwcm9wXycgKyBzY2hlbWEudHlwZV0oT2JqZWN0LmFzc2lnbih7XG4gICAgbmFtZTogbmFtZSxcbiAgICByZXF1aXJlZCxcbiAgICBzY2hlbWE6IHNjaGVtYSxcbiAgfSwgZXh0cmFzKSlcbiU+PCVcbn1cbiU+XG4iXX0=