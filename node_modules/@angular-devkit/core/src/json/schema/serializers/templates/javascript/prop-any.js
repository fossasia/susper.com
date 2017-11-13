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
    + "  value: undefined,\n"
    + "  get() { return this.value === undefined ? ";
__p += ((__t =  'default' in schema ? JSON.stringify(schema.default) : 'undefined' ) == null ? "" : __t);
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2pzb24vc2NoZW1hL3NlcmlhbGl6ZXJzL3RlbXBsYXRlcy9qYXZhc2NyaXB0L3Byb3AtYW55LmVqcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLFdBQ0E7QUFBQSw2QkFDQTtBQUFBLG9EQUEyQztBQUFBLG1GQUF5RTtBQUFBO0FBQUEsMkJBQ3BIO0FBQUEsb0JBQ0E7QUFBQSxtQ0FBMEI7QUFBQSwwQkFBZ0I7QUFBQTtBQUFBLGFBQzFDO0FBQUEsdUNBQ0E7QUFBQSx1QkFDQTtBQUFBLGVBQ0E7QUFBQSw2QkFDQTtBQUFBLGNBQ0E7QUFBQSw2REFDQTtBQUFBLDhDQUNBO0FBQUEsNEJBQW1CO0FBQUEsdUNBQTZCO0FBQUE7QUFBQSxjQUNoRDtBQUFBLFdBQ0E7QUFBQSxRQURDO0FBQUE7QUFBQTtBQUFBO0FBQUEiLCJmaWxlIjoicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvanNvbi9zY2hlbWEvc2VyaWFsaXplcnMvdGVtcGxhdGVzL2phdmFzY3JpcHQvcHJvcC1hbnkuZWpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2hhbnNsL2RldmtpdCIsInNvdXJjZXNDb250ZW50IjpbIntcbiAgdmFsdWU6IHVuZGVmaW5lZCxcbiAgZ2V0KCkgeyByZXR1cm4gdGhpcy52YWx1ZSA9PT0gdW5kZWZpbmVkID8gPCU9ICdkZWZhdWx0JyBpbiBzY2hlbWEgPyBKU09OLnN0cmluZ2lmeShzY2hlbWEuZGVmYXVsdCkgOiAndW5kZWZpbmVkJyAlPiA6IHRoaXMudmFsdWU7IH0sXG4gIHNldCh2KSB7XG4gICAgaWYgKHYgPT09IHVuZGVmaW5lZCAmJiA8JT0gIXJlcXVpcmVkICU+KSB7XG4gICAgICB0aGlzLnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnZhbHVlID0gdjtcbiAgfSxcbiAgaXNEZWZpbmVkKCkgeyByZXR1cm4gdGhpcy52YWx1ZSAhPT0gdW5kZWZpbmVkOyB9LFxuICByZW1vdmUoKSB7IHRoaXMuc2V0KHVuZGVmaW5lZCk7IH0sXG4gIHNjaGVtYSgpIHsgcmV0dXJuIDwlPSBKU09OLnN0cmluZ2lmeShzY2hlbWEpICU+OyB9LFxufVxuIl19