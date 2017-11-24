'use strict';

/**
 * TemplateTag transformer that trims whitespace on the end result of a tagged template
 * @param  {String} side = '' - The side of the string to trim. Can be 'start' or 'end' (alternatively 'left' or 'right')
 * @return {Object}           - a TemplateTag transformer
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

exports.default = trimResultTransformer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90cmltUmVzdWx0VHJhbnNmb3JtZXIvdHJpbVJlc3VsdFRyYW5zZm9ybWVyLmpzIl0sIm5hbWVzIjpbInRyaW1SZXN1bHRUcmFuc2Zvcm1lciIsInNpZGUiLCJvbkVuZFJlc3VsdCIsImVuZFJlc3VsdCIsInRyaW0iLCJ0b0xvd2VyQ2FzZSIsInJlcGxhY2UiLCJFcnJvciJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBRUE7Ozs7Ozs7OztBQUtBLElBQU1BLHdCQUF3QixTQUF4QkEscUJBQXdCO0FBQUEsTUFBQ0MsSUFBRCx1RUFBUSxFQUFSO0FBQUEsU0FBZ0I7QUFDNUNDLGVBRDRDLHVCQUMvQkMsU0FEK0IsRUFDcEI7QUFDdEIsVUFBSUYsU0FBUyxFQUFiLEVBQWlCO0FBQ2YsZUFBT0UsVUFBVUMsSUFBVixFQUFQO0FBQ0Q7O0FBRURILGFBQU9BLEtBQUtJLFdBQUwsRUFBUDs7QUFFQSxVQUFJSixTQUFTLE9BQVQsSUFBb0JBLFNBQVMsTUFBakMsRUFBeUM7QUFDdkMsZUFBT0UsVUFBVUcsT0FBVixDQUFrQixNQUFsQixFQUEwQixFQUExQixDQUFQO0FBQ0Q7O0FBRUQsVUFBSUwsU0FBUyxLQUFULElBQWtCQSxTQUFTLE9BQS9CLEVBQXdDO0FBQ3RDLGVBQU9FLFVBQVVHLE9BQVYsQ0FBa0IsTUFBbEIsRUFBMEIsRUFBMUIsQ0FBUDtBQUNEOztBQUVELFlBQU0sSUFBSUMsS0FBSiwwQkFBaUNOLElBQWpDLENBQU47QUFDRDtBQWpCMkMsR0FBaEI7QUFBQSxDQUE5Qjs7a0JBb0JlRCxxQiIsImZpbGUiOiJ0cmltUmVzdWx0VHJhbnNmb3JtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBUZW1wbGF0ZVRhZyB0cmFuc2Zvcm1lciB0aGF0IHRyaW1zIHdoaXRlc3BhY2Ugb24gdGhlIGVuZCByZXN1bHQgb2YgYSB0YWdnZWQgdGVtcGxhdGVcbiAqIEBwYXJhbSAge1N0cmluZ30gc2lkZSA9ICcnIC0gVGhlIHNpZGUgb2YgdGhlIHN0cmluZyB0byB0cmltLiBDYW4gYmUgJ3N0YXJ0JyBvciAnZW5kJyAoYWx0ZXJuYXRpdmVseSAnbGVmdCcgb3IgJ3JpZ2h0JylcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgIC0gYSBUZW1wbGF0ZVRhZyB0cmFuc2Zvcm1lclxuICovXG5jb25zdCB0cmltUmVzdWx0VHJhbnNmb3JtZXIgPSAoc2lkZSA9ICcnKSA9PiAoe1xuICBvbkVuZFJlc3VsdCAoZW5kUmVzdWx0KSB7XG4gICAgaWYgKHNpZGUgPT09ICcnKSB7XG4gICAgICByZXR1cm4gZW5kUmVzdWx0LnRyaW0oKVxuICAgIH1cblxuICAgIHNpZGUgPSBzaWRlLnRvTG93ZXJDYXNlKClcblxuICAgIGlmIChzaWRlID09PSAnc3RhcnQnIHx8IHNpZGUgPT09ICdsZWZ0Jykge1xuICAgICAgcmV0dXJuIGVuZFJlc3VsdC5yZXBsYWNlKC9eXFxzKi8sICcnKVxuICAgIH1cblxuICAgIGlmIChzaWRlID09PSAnZW5kJyB8fCBzaWRlID09PSAncmlnaHQnKSB7XG4gICAgICByZXR1cm4gZW5kUmVzdWx0LnJlcGxhY2UoL1xccyokLywgJycpXG4gICAgfVxuXG4gICAgdGhyb3cgbmV3IEVycm9yKGBTaWRlIG5vdCBzdXBwb3J0ZWQ6ICR7c2lkZX1gKVxuICB9XG59KVxuXG5leHBvcnQgZGVmYXVsdCB0cmltUmVzdWx0VHJhbnNmb3JtZXJcbiJdfQ==