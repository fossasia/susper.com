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

  if ('default' in schema && typeof schema.default != 'boolean') {
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
    + "    if (typeof v != 'boolean') {\n"
    + "      throw new exceptions.InvalidValueException(";
__p += ((__t =  JSON.stringify(name) ) == null ? "" : __t);
__p = __p
    + ", typeof v, 'boolean');\n"
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2pzb24vc2NoZW1hL3NlcmlhbGl6ZXJzL3RlbXBsYXRlcy9qYXZhc2NyaXB0L3Byb3AtYm9vbGVhbi5lanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxXQUNBO0FBQUEsUUFEQztBQUFBO0FBQ0Q7QUFDQTtBQUNBO0FBRUU7QUFBQTtBQUFBLFVBQ0Y7QUFBQSw2QkFDQTtBQUFBLG9EQUE0QztBQUFBLDhDQUFvQztBQUFBO0FBQUEsMkJBQ2hGO0FBQUEsb0JBQ0E7QUFBQSxtQ0FBMkI7QUFBQSwwQkFBZ0I7QUFBQTtBQUFBLGFBQzNDO0FBQUEsdUNBQ0E7QUFBQSx1QkFDQTtBQUFBLGVBQ0E7QUFBQSwwQ0FDQTtBQUFBLHlEQUFpRDtBQUFBLHFDQUEyQjtBQUFBO0FBQUEsaUNBQzVFO0FBQUEsZUFDQTtBQUFBLDZCQUNBO0FBQUEsY0FDQTtBQUFBLDZEQUNBO0FBQUEsOENBQ0E7QUFBQSw0QkFBb0I7QUFBQSx1Q0FBNkI7QUFBQTtBQUFBLGNBQ2pEO0FBQUEsV0FDQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEiLCJmaWxlIjoicGFja2FnZXMvYW5ndWxhcl9kZXZraXQvY29yZS9zcmMvanNvbi9zY2hlbWEvc2VyaWFsaXplcnMvdGVtcGxhdGVzL2phdmFzY3JpcHQvcHJvcC1ib29sZWFuLmVqcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvaGFuc2wvU291cmNlcy9oYW5zbC9kZXZraXQiLCJzb3VyY2VzQ29udGVudCI6WyJ7XG48JVxuICBpZiAoJ2RlZmF1bHQnIGluIHNjaGVtYSAmJiB0eXBlb2Ygc2NoZW1hLmRlZmF1bHQgIT0gJ2Jvb2xlYW4nKSB7XG4gICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuSW52YWxpZFNjaGVtYUV4Y2VwdGlvbihzY2hlbWEpO1xuICB9XG4lPlxuICB2YWx1ZTogdW5kZWZpbmVkLFxuICBnZXQoKSB7IHJldHVybiB0aGlzLnZhbHVlID09PSB1bmRlZmluZWQgPyA8JT0gc2NoZW1hLmRlZmF1bHQgfHwgJ3VuZGVmaW5lZCcgJT4gOiB0aGlzLnZhbHVlOyB9LFxuICBzZXQodikge1xuICAgIGlmICh2ID09PSB1bmRlZmluZWQgJiYgPCU9ICFyZXF1aXJlZCAlPikge1xuICAgICAgdGhpcy52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiB2ICE9ICdib29sZWFuJykge1xuICAgICAgdGhyb3cgbmV3IGV4Y2VwdGlvbnMuSW52YWxpZFZhbHVlRXhjZXB0aW9uKDwlPSBKU09OLnN0cmluZ2lmeShuYW1lKSAlPiwgdHlwZW9mIHYsICdib29sZWFuJyk7XG4gICAgfVxuICAgIHRoaXMudmFsdWUgPSB2O1xuICB9LFxuICBpc0RlZmluZWQoKSB7IHJldHVybiB0aGlzLnZhbHVlICE9PSB1bmRlZmluZWQ7IH0sXG4gIHJlbW92ZSgpIHsgdGhpcy5zZXQodW5kZWZpbmVkKTsgfSxcbiAgc2NoZW1hKCkgeyByZXR1cm4gPCU9IEpTT04uc3RyaW5naWZ5KHNjaGVtYSkgJT47IH0sXG59XG4iXX0=