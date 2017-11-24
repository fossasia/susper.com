'use strict';

/**
 * TemplateTag transformer that trims whitespace on the end result of a tagged template
 * @param  {String} side = '' - The side of the string to trim. Can be 'start' or 'end' (alternatively 'left' or 'right')
 * @return {Object}           - a TemplateTag transformer
 */

var trimResultTransformer = function trimResultTransformer() {
  var side = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  return {
    onEndResult: function onEndResult(endResult) {
      if (side === '') {
        return endResult.trim();
      }

      side = side.toLowerCase();

      if (side === 'start' || side === 'left') {
        return endResult.replace(/^\s*/, '');
      }

      if (side === 'end' || side === 'right') {
        return endResult.replace(/\s*$/, '');
      }

      throw new Error('Side not supported: ' + side);
    }
  };
};

export default trimResultTransformer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmltUmVzdWx0VHJhbnNmb3JtZXIvdHJpbVJlc3VsdFRyYW5zZm9ybWVyLmpzIl0sIm5hbWVzIjpbInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInNpZGUiLCJvbkVuZFJlc3VsdCIsImVuZFJlc3VsdCIsInRyaW0iLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2UiLCJFcnJvciJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7Ozs7OztBQUtBLElBQU1BLHdCQUF3QixTQUF4QkEscUJBQXdCO0FBQUEsTUFBQ0MsSUFBRCx1RUFBUSxFQUFSO0FBQUEsU0FBZ0I7QUFDNUNDLGVBRDRDLHVCQUMvQkMsU0FEK0IsRUFDcEI7QUFDdEIsVUFBSUYsU0FBUyxFQUFiLEVBQWlCO0FBQ2YsZUFBT0UsVUFBVUMsSUFBVixFQUFQO0FBQ0Q7O0FBRURILGFBQU9BLEtBQUtJLFdBQUwsRUFBUDs7QUFFQSxVQUFJSixTQUFTLE9BQVQsSUFBb0JBLFNBQVMsTUFBakMsRUFBeUM7QUFDdkMsZUFBT0UsVUFBVUcsT0FBVixDQUFrQixNQUFsQixFQUEwQixFQUExQixDQUFQO0FBQ0Q7O0FBRUQsVUFBSUwsU0FBUyxLQUFULElBQWtCQSxTQUFTLE9BQS9CLEVBQXdDO0FBQ3RDLGVBQU9FLFVBQVVHLE9BQVYsQ0FBa0IsTUFBbEIsRUFBMEIsRUFBMUIsQ0FBUDtBQUNEOztBQUVELFlBQU0sSUFBSUMsS0FBSiwwQkFBaUNOLElBQWpDLENBQU47QUFDRDtBQWpCMkMsR0FBaEI7QUFBQSxDQUE5Qjs7QUFvQkEsZUFBZUQscUJBQWYiLCJmaWxlIjoidHJpbVJlc3VsdFRyYW5zZm9ybWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogVGVtcGxhdGVUYWcgdHJhbnNmb3JtZXIgdGhhdCB0cmltcyB3aGl0ZXNwYWNlIG9uIHRoZSBlbmQgcmVzdWx0IG9mIGEgdGFnZ2VkIHRlbXBsYXRlXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHNpZGUgPSAnJyAtIFRoZSBzaWRlIG9mIHRoZSBzdHJpbmcgdG8gdHJpbS4gQ2FuIGJlICdzdGFydCcgb3IgJ2VuZCcgKGFsdGVybmF0aXZlbHkgJ2xlZnQnIG9yICdyaWdodCcpXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAtIGEgVGVtcGxhdGVUYWcgdHJhbnNmb3JtZXJcbiAqL1xuY29uc3QgdHJpbVJlc3VsdFRyYW5zZm9ybWVyID0gKHNpZGUgPSAnJykgPT4gKHtcbiAgb25FbmRSZXN1bHQgKGVuZFJlc3VsdCkge1xuICAgIGlmIChzaWRlID09PSAnJykge1xuICAgICAgcmV0dXJuIGVuZFJlc3VsdC50cmltKClcbiAgICB9XG5cbiAgICBzaWRlID0gc2lkZS50b0xvd2VyQ2FzZSgpXG5cbiAgICBpZiAoc2lkZSA9PT0gJ3N0YXJ0JyB8fCBzaWRlID09PSAnbGVmdCcpIHtcbiAgICAgIHJldHVybiBlbmRSZXN1bHQucmVwbGFjZSgvXlxccyovLCAnJylcbiAgICB9XG5cbiAgICBpZiAoc2lkZSA9PT0gJ2VuZCcgfHwgc2lkZSA9PT0gJ3JpZ2h0Jykge1xuICAgICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKC9cXHMqJC8sICcnKVxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcihgU2lkZSBub3Qgc3VwcG9ydGVkOiAke3NpZGV9YClcbiAgfVxufSlcblxuZXhwb3J0IGRlZmF1bHQgdHJpbVJlc3VsdFRyYW5zZm9ybWVyXG4iXX0=