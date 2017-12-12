'use strict';

/**
 * strips indentation from a template literal
 * @param  {String} type = 'initial' - whether to remove all indentation or just leading indentation. can be 'all' or 'initial'
 * @return {Object}                  - a TemplateTag transformer
 */

import _toConsumableArray from 'babel-runtime/helpers/toConsumableArray';
var stripIndentTransformer = function stripIndentTransformer() {
  var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'initial';
  return {
    onEndResult: function onEndResult(endResult) {
      if (type === 'initial') {
        // remove the shortest leading indentation from each line
        var match = endResult.match(/^[ \t]*(?=\S)/gm);
        // return early if there's nothing to strip
        if (match === null) {
          return endResult;
        }
        var indent = Math.min.apply(Math, _toConsumableArray(match.map(function (el) {
          return el.length;
        })));
        var regexp = new RegExp('^[ \\t]{' + indent + '}', 'gm');
        endResult = indent > 0 ? endResult.replace(regexp, '') : endResult;
      } else if (type === 'all') {
        // remove all indentation from each line
        endResult = endResult.replace(/(?:\n[^\S\n]*)/g, '\n');
      } else {
        throw new Error('Unknown type: ' + type);
      }
      return endResult;
    }
  };
};

export default stripIndentTransformer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJpcEluZGVudFRyYW5zZm9ybWVyL3N0cmlwSW5kZW50VHJhbnNmb3JtZXIuanMiXSwibmFtZXMiOlsic3RyaXBJbmRlbnRUcmFuc2Zvcm1lciIsInR5cGUiLCJvbkVuZFJlc3VsdCIsImVuZFJlc3VsdCIsIm1hdGNoIiwiaW5kZW50IiwiTWF0aCIsIm1pbiIsIm1hcCIsImVsIiwibGVuZ3RoIiwicmVnZXhwIiwiUmVnRXhwIiwicmVwbGFjZSIsIkVycm9yIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7Ozs7OztBQUtBLElBQU1BLHlCQUF5QixTQUF6QkEsc0JBQXlCO0FBQUEsTUFBQ0MsSUFBRCx1RUFBUSxTQUFSO0FBQUEsU0FBdUI7QUFDcERDLGVBRG9ELHVCQUN2Q0MsU0FEdUMsRUFDNUI7QUFDdEIsVUFBSUYsU0FBUyxTQUFiLEVBQXdCO0FBQ3RCO0FBQ0EsWUFBTUcsUUFBUUQsVUFBVUMsS0FBVixDQUFnQixpQkFBaEIsQ0FBZDtBQUNBO0FBQ0EsWUFBSUEsVUFBVSxJQUFkLEVBQW9CO0FBQ2xCLGlCQUFPRCxTQUFQO0FBQ0Q7QUFDRCxZQUFNRSxTQUFTQyxLQUFLQyxHQUFMLGdDQUFZSCxNQUFNSSxHQUFOLENBQVU7QUFBQSxpQkFBTUMsR0FBR0MsTUFBVDtBQUFBLFNBQVYsQ0FBWixFQUFmO0FBQ0EsWUFBTUMsU0FBUyxJQUFJQyxNQUFKLENBQVcsYUFBYVAsTUFBYixHQUFzQixHQUFqQyxFQUFzQyxJQUF0QyxDQUFmO0FBQ0FGLG9CQUFZRSxTQUFTLENBQVQsR0FBYUYsVUFBVVUsT0FBVixDQUFrQkYsTUFBbEIsRUFBMEIsRUFBMUIsQ0FBYixHQUE2Q1IsU0FBekQ7QUFDRCxPQVZELE1BVU8sSUFBSUYsU0FBUyxLQUFiLEVBQW9CO0FBQ3pCO0FBQ0FFLG9CQUFZQSxVQUFVVSxPQUFWLENBQWtCLGlCQUFsQixFQUFxQyxJQUFyQyxDQUFaO0FBQ0QsT0FITSxNQUdBO0FBQ0wsY0FBTSxJQUFJQyxLQUFKLG9CQUEyQmIsSUFBM0IsQ0FBTjtBQUNEO0FBQ0QsYUFBT0UsU0FBUDtBQUNEO0FBbkJtRCxHQUF2QjtBQUFBLENBQS9COztBQXNCQSxlQUFlSCxzQkFBZiIsImZpbGUiOiJzdHJpcEluZGVudFRyYW5zZm9ybWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbi8qKlxuICogc3RyaXBzIGluZGVudGF0aW9uIGZyb20gYSB0ZW1wbGF0ZSBsaXRlcmFsXG4gKiBAcGFyYW0gIHtTdHJpbmd9IHR5cGUgPSAnaW5pdGlhbCcgLSB3aGV0aGVyIHRvIHJlbW92ZSBhbGwgaW5kZW50YXRpb24gb3IganVzdCBsZWFkaW5nIGluZGVudGF0aW9uLiBjYW4gYmUgJ2FsbCcgb3IgJ2luaXRpYWwnXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgLSBhIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyXG4gKi9cbmNvbnN0IHN0cmlwSW5kZW50VHJhbnNmb3JtZXIgPSAodHlwZSA9ICdpbml0aWFsJykgPT4gKHtcbiAgb25FbmRSZXN1bHQgKGVuZFJlc3VsdCkge1xuICAgIGlmICh0eXBlID09PSAnaW5pdGlhbCcpIHtcbiAgICAgIC8vIHJlbW92ZSB0aGUgc2hvcnRlc3QgbGVhZGluZyBpbmRlbnRhdGlvbiBmcm9tIGVhY2ggbGluZVxuICAgICAgY29uc3QgbWF0Y2ggPSBlbmRSZXN1bHQubWF0Y2goL15bIFxcdF0qKD89XFxTKS9nbSlcbiAgICAgIC8vIHJldHVybiBlYXJseSBpZiB0aGVyZSdzIG5vdGhpbmcgdG8gc3RyaXBcbiAgICAgIGlmIChtYXRjaCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZW5kUmVzdWx0XG4gICAgICB9XG4gICAgICBjb25zdCBpbmRlbnQgPSBNYXRoLm1pbiguLi5tYXRjaC5tYXAoZWwgPT4gZWwubGVuZ3RoKSlcbiAgICAgIGNvbnN0IHJlZ2V4cCA9IG5ldyBSZWdFeHAoJ15bIFxcXFx0XXsnICsgaW5kZW50ICsgJ30nLCAnZ20nKVxuICAgICAgZW5kUmVzdWx0ID0gaW5kZW50ID4gMCA/IGVuZFJlc3VsdC5yZXBsYWNlKHJlZ2V4cCwgJycpIDogZW5kUmVzdWx0XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnYWxsJykge1xuICAgICAgLy8gcmVtb3ZlIGFsbCBpbmRlbnRhdGlvbiBmcm9tIGVhY2ggbGluZVxuICAgICAgZW5kUmVzdWx0ID0gZW5kUmVzdWx0LnJlcGxhY2UoLyg/OlxcblteXFxTXFxuXSopL2csICdcXG4nKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gdHlwZTogJHt0eXBlfWApXG4gICAgfVxuICAgIHJldHVybiBlbmRSZXN1bHRcbiAgfVxufSlcblxuZXhwb3J0IGRlZmF1bHQgc3RyaXBJbmRlbnRUcmFuc2Zvcm1lclxuIl19