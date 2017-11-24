'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var defaults = {
  separator: '',
  conjunction: '',
  serial: false

  /**
   * Converts an array substitution to a string containing a list
   * @param  {String} [opts.separator = ''] - the character that separates each item
   * @param  {String} [opts.conjunction = '']  - replace the last separator with this
   * @param  {Boolean} [opts.serial = false] - include the separator before the conjunction? (Oxford comma use-case)
   *
   * @return {Object}                     - a TemplateTag transformer
   */
};var inlineArrayTransformer = function inlineArrayTransformer() {
  var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaults;
  return {
    onSubstitution: function onSubstitution(substitution, resultSoFar) {
      // only operate on arrays
      if (Array.isArray(substitution)) {
        var arrayLength = substitution.length;
        var separator = opts.separator;
        var conjunction = opts.conjunction;
        var serial = opts.serial;
        // join each item in the array into a string where each item is separated by separator
        // be sure to maintain indentation
        var indent = resultSoFar.match(/(\n?[^\S\n]+)$/);
        if (indent) {
          substitution = substitution.join(separator + indent[1]);
        } else {
          substitution = substitution.join(separator + ' ');
        }
        // if conjunction is set, replace the last separator with conjunction, but only if there is more than one substitution
        if (conjunction && arrayLength > 1) {
          var separatorIndex = substitution.lastIndexOf(separator);
          substitution = substitution.slice(0, separatorIndex) + (serial ? separator : '') + ' ' + conjunction + substitution.slice(separatorIndex + 1);
        }
      }
      return substitution;
    }
  };
};

exports.default = inlineArrayTransformer;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmxpbmVBcnJheVRyYW5zZm9ybWVyL2lubGluZUFycmF5VHJhbnNmb3JtZXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdHMiLCJzZXBhcmF0b3IiLCJjb25qdW5jdGlvbiIsInNlcmlhbCIsImlubGluZUFycmF5VHJhbnNmb3JtZXIiLCJvcHRzIiwib25TdWJzdGl0dXRpb24iLCJzdWJzdGl0dXRpb24iLCJyZXN1bHRTb0ZhciIsIkFycmF5IiwiaXNBcnJheSIsImFycmF5TGVuZ3RoIiwibGVuZ3RoIiwiaW5kZW50IiwibWF0Y2giLCJqb2luIiwic2VwYXJhdG9ySW5kZXgiLCJsYXN0SW5kZXhPZiIsInNsaWNlIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7QUFFQSxJQUFNQSxXQUFXO0FBQ2ZDLGFBQVcsRUFESTtBQUVmQyxlQUFhLEVBRkU7QUFHZkMsVUFBUTs7QUFHVjs7Ozs7Ozs7QUFOaUIsQ0FBakIsQ0FjQSxJQUFNQyx5QkFBeUIsU0FBekJBLHNCQUF5QjtBQUFBLE1BQUNDLElBQUQsdUVBQVFMLFFBQVI7QUFBQSxTQUFzQjtBQUNuRE0sa0JBRG1ELDBCQUNuQ0MsWUFEbUMsRUFDckJDLFdBRHFCLEVBQ1I7QUFDekM7QUFDQSxVQUFJQyxNQUFNQyxPQUFOLENBQWNILFlBQWQsQ0FBSixFQUFpQztBQUMvQixZQUFNSSxjQUFjSixhQUFhSyxNQUFqQztBQUNBLFlBQU1YLFlBQVlJLEtBQUtKLFNBQXZCO0FBQ0EsWUFBTUMsY0FBY0csS0FBS0gsV0FBekI7QUFDQSxZQUFNQyxTQUFTRSxLQUFLRixNQUFwQjtBQUNBO0FBQ0E7QUFDQSxZQUFNVSxTQUFTTCxZQUFZTSxLQUFaLENBQWtCLGdCQUFsQixDQUFmO0FBQ0EsWUFBSUQsTUFBSixFQUFZO0FBQ1ZOLHlCQUFlQSxhQUFhUSxJQUFiLENBQWtCZCxZQUFZWSxPQUFPLENBQVAsQ0FBOUIsQ0FBZjtBQUNELFNBRkQsTUFFTztBQUNMTix5QkFBZUEsYUFBYVEsSUFBYixDQUFrQmQsWUFBWSxHQUE5QixDQUFmO0FBQ0Q7QUFDRDtBQUNBLFlBQUlDLGVBQWVTLGNBQWMsQ0FBakMsRUFBb0M7QUFDbEMsY0FBTUssaUJBQWlCVCxhQUFhVSxXQUFiLENBQXlCaEIsU0FBekIsQ0FBdkI7QUFDQU0seUJBQWVBLGFBQ1pXLEtBRFksQ0FDTixDQURNLEVBQ0hGLGNBREcsS0FDZ0JiLFNBQVNGLFNBQVQsR0FBcUIsRUFEckMsSUFDMkMsR0FEM0MsR0FFWEMsV0FGVyxHQUVHSyxhQUFhVyxLQUFiLENBQW1CRixpQkFBaUIsQ0FBcEMsQ0FGbEI7QUFHRDtBQUNGO0FBQ0QsYUFBT1QsWUFBUDtBQUNEO0FBekJrRCxHQUF0QjtBQUFBLENBQS9COztrQkE0QmVILHNCIiwiZmlsZSI6ImlubGluZUFycmF5VHJhbnNmb3JtZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuY29uc3QgZGVmYXVsdHMgPSB7XG4gIHNlcGFyYXRvcjogJycsXG4gIGNvbmp1bmN0aW9uOiAnJyxcbiAgc2VyaWFsOiBmYWxzZVxufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIGFycmF5IHN1YnN0aXR1dGlvbiB0byBhIHN0cmluZyBjb250YWluaW5nIGEgbGlzdFxuICogQHBhcmFtICB7U3RyaW5nfSBbb3B0cy5zZXBhcmF0b3IgPSAnJ10gLSB0aGUgY2hhcmFjdGVyIHRoYXQgc2VwYXJhdGVzIGVhY2ggaXRlbVxuICogQHBhcmFtICB7U3RyaW5nfSBbb3B0cy5jb25qdW5jdGlvbiA9ICcnXSAgLSByZXBsYWNlIHRoZSBsYXN0IHNlcGFyYXRvciB3aXRoIHRoaXNcbiAqIEBwYXJhbSAge0Jvb2xlYW59IFtvcHRzLnNlcmlhbCA9IGZhbHNlXSAtIGluY2x1ZGUgdGhlIHNlcGFyYXRvciBiZWZvcmUgdGhlIGNvbmp1bmN0aW9uPyAoT3hmb3JkIGNvbW1hIHVzZS1jYXNlKVxuICpcbiAqIEByZXR1cm4ge09iamVjdH0gICAgICAgICAgICAgICAgICAgICAtIGEgVGVtcGxhdGVUYWcgdHJhbnNmb3JtZXJcbiAqL1xuY29uc3QgaW5saW5lQXJyYXlUcmFuc2Zvcm1lciA9IChvcHRzID0gZGVmYXVsdHMpID0+ICh7XG4gIG9uU3Vic3RpdHV0aW9uIChzdWJzdGl0dXRpb24sIHJlc3VsdFNvRmFyKSB7XG4gICAgLy8gb25seSBvcGVyYXRlIG9uIGFycmF5c1xuICAgIGlmIChBcnJheS5pc0FycmF5KHN1YnN0aXR1dGlvbikpIHtcbiAgICAgIGNvbnN0IGFycmF5TGVuZ3RoID0gc3Vic3RpdHV0aW9uLmxlbmd0aFxuICAgICAgY29uc3Qgc2VwYXJhdG9yID0gb3B0cy5zZXBhcmF0b3JcbiAgICAgIGNvbnN0IGNvbmp1bmN0aW9uID0gb3B0cy5jb25qdW5jdGlvblxuICAgICAgY29uc3Qgc2VyaWFsID0gb3B0cy5zZXJpYWxcbiAgICAgIC8vIGpvaW4gZWFjaCBpdGVtIGluIHRoZSBhcnJheSBpbnRvIGEgc3RyaW5nIHdoZXJlIGVhY2ggaXRlbSBpcyBzZXBhcmF0ZWQgYnkgc2VwYXJhdG9yXG4gICAgICAvLyBiZSBzdXJlIHRvIG1haW50YWluIGluZGVudGF0aW9uXG4gICAgICBjb25zdCBpbmRlbnQgPSByZXN1bHRTb0Zhci5tYXRjaCgvKFxcbj9bXlxcU1xcbl0rKSQvKVxuICAgICAgaWYgKGluZGVudCkge1xuICAgICAgICBzdWJzdGl0dXRpb24gPSBzdWJzdGl0dXRpb24uam9pbihzZXBhcmF0b3IgKyBpbmRlbnRbMV0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdWJzdGl0dXRpb24gPSBzdWJzdGl0dXRpb24uam9pbihzZXBhcmF0b3IgKyAnICcpXG4gICAgICB9XG4gICAgICAvLyBpZiBjb25qdW5jdGlvbiBpcyBzZXQsIHJlcGxhY2UgdGhlIGxhc3Qgc2VwYXJhdG9yIHdpdGggY29uanVuY3Rpb24sIGJ1dCBvbmx5IGlmIHRoZXJlIGlzIG1vcmUgdGhhbiBvbmUgc3Vic3RpdHV0aW9uXG4gICAgICBpZiAoY29uanVuY3Rpb24gJiYgYXJyYXlMZW5ndGggPiAxKSB7XG4gICAgICAgIGNvbnN0IHNlcGFyYXRvckluZGV4ID0gc3Vic3RpdHV0aW9uLmxhc3RJbmRleE9mKHNlcGFyYXRvcilcbiAgICAgICAgc3Vic3RpdHV0aW9uID0gc3Vic3RpdHV0aW9uXG4gICAgICAgICAgLnNsaWNlKDAsIHNlcGFyYXRvckluZGV4KSArIChzZXJpYWwgPyBzZXBhcmF0b3IgOiAnJykgKyAnICcgK1xuICAgICAgICAgICAgY29uanVuY3Rpb24gKyBzdWJzdGl0dXRpb24uc2xpY2Uoc2VwYXJhdG9ySW5kZXggKyAxKVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3Vic3RpdHV0aW9uXG4gIH1cbn0pXG5cbmV4cG9ydCBkZWZhdWx0IGlubGluZUFycmF5VHJhbnNmb3JtZXJcbiJdfQ==