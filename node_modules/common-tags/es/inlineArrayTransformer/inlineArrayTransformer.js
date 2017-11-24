'use strict';

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

export default inlineArrayTransformer;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9pbmxpbmVBcnJheVRyYW5zZm9ybWVyL2lubGluZUFycmF5VHJhbnNmb3JtZXIuanMiXSwibmFtZXMiOlsiZGVmYXVsdHMiLCJzZXBhcmF0b3IiLCJjb25qdW5jdGlvbiIsInNlcmlhbCIsImlubGluZUFycmF5VHJhbnNmb3JtZXIiLCJvcHRzIiwib25TdWJzdGl0dXRpb24iLCJzdWJzdGl0dXRpb24iLCJyZXN1bHRTb0ZhciIsIkFycmF5IiwiaXNBcnJheSIsImFycmF5TGVuZ3RoIiwibGVuZ3RoIiwiaW5kZW50IiwibWF0Y2giLCJqb2luIiwic2VwYXJhdG9ySW5kZXgiLCJsYXN0SW5kZXhPZiIsInNsaWNlIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxJQUFNQSxXQUFXO0FBQ2ZDLGFBQVcsRUFESTtBQUVmQyxlQUFhLEVBRkU7QUFHZkMsVUFBUTs7QUFHVjs7Ozs7Ozs7QUFOaUIsQ0FBakIsQ0FjQSxJQUFNQyx5QkFBeUIsU0FBekJBLHNCQUF5QjtBQUFBLE1BQUNDLElBQUQsdUVBQVFMLFFBQVI7QUFBQSxTQUFzQjtBQUNuRE0sa0JBRG1ELDBCQUNuQ0MsWUFEbUMsRUFDckJDLFdBRHFCLEVBQ1I7QUFDekM7QUFDQSxVQUFJQyxNQUFNQyxPQUFOLENBQWNILFlBQWQsQ0FBSixFQUFpQztBQUMvQixZQUFNSSxjQUFjSixhQUFhSyxNQUFqQztBQUNBLFlBQU1YLFlBQVlJLEtBQUtKLFNBQXZCO0FBQ0EsWUFBTUMsY0FBY0csS0FBS0gsV0FBekI7QUFDQSxZQUFNQyxTQUFTRSxLQUFLRixNQUFwQjtBQUNBO0FBQ0E7QUFDQSxZQUFNVSxTQUFTTCxZQUFZTSxLQUFaLENBQWtCLGdCQUFsQixDQUFmO0FBQ0EsWUFBSUQsTUFBSixFQUFZO0FBQ1ZOLHlCQUFlQSxhQUFhUSxJQUFiLENBQWtCZCxZQUFZWSxPQUFPLENBQVAsQ0FBOUIsQ0FBZjtBQUNELFNBRkQsTUFFTztBQUNMTix5QkFBZUEsYUFBYVEsSUFBYixDQUFrQmQsWUFBWSxHQUE5QixDQUFmO0FBQ0Q7QUFDRDtBQUNBLFlBQUlDLGVBQWVTLGNBQWMsQ0FBakMsRUFBb0M7QUFDbEMsY0FBTUssaUJBQWlCVCxhQUFhVSxXQUFiLENBQXlCaEIsU0FBekIsQ0FBdkI7QUFDQU0seUJBQWVBLGFBQ1pXLEtBRFksQ0FDTixDQURNLEVBQ0hGLGNBREcsS0FDZ0JiLFNBQVNGLFNBQVQsR0FBcUIsRUFEckMsSUFDMkMsR0FEM0MsR0FFWEMsV0FGVyxHQUVHSyxhQUFhVyxLQUFiLENBQW1CRixpQkFBaUIsQ0FBcEMsQ0FGbEI7QUFHRDtBQUNGO0FBQ0QsYUFBT1QsWUFBUDtBQUNEO0FBekJrRCxHQUF0QjtBQUFBLENBQS9COztBQTRCQSxlQUFlSCxzQkFBZiIsImZpbGUiOiJpbmxpbmVBcnJheVRyYW5zZm9ybWVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnXG5cbmNvbnN0IGRlZmF1bHRzID0ge1xuICBzZXBhcmF0b3I6ICcnLFxuICBjb25qdW5jdGlvbjogJycsXG4gIHNlcmlhbDogZmFsc2Vcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBhcnJheSBzdWJzdGl0dXRpb24gdG8gYSBzdHJpbmcgY29udGFpbmluZyBhIGxpc3RcbiAqIEBwYXJhbSAge1N0cmluZ30gW29wdHMuc2VwYXJhdG9yID0gJyddIC0gdGhlIGNoYXJhY3RlciB0aGF0IHNlcGFyYXRlcyBlYWNoIGl0ZW1cbiAqIEBwYXJhbSAge1N0cmluZ30gW29wdHMuY29uanVuY3Rpb24gPSAnJ10gIC0gcmVwbGFjZSB0aGUgbGFzdCBzZXBhcmF0b3Igd2l0aCB0aGlzXG4gKiBAcGFyYW0gIHtCb29sZWFufSBbb3B0cy5zZXJpYWwgPSBmYWxzZV0gLSBpbmNsdWRlIHRoZSBzZXBhcmF0b3IgYmVmb3JlIHRoZSBjb25qdW5jdGlvbj8gKE94Zm9yZCBjb21tYSB1c2UtY2FzZSlcbiAqXG4gKiBAcmV0dXJuIHtPYmplY3R9ICAgICAgICAgICAgICAgICAgICAgLSBhIFRlbXBsYXRlVGFnIHRyYW5zZm9ybWVyXG4gKi9cbmNvbnN0IGlubGluZUFycmF5VHJhbnNmb3JtZXIgPSAob3B0cyA9IGRlZmF1bHRzKSA9PiAoe1xuICBvblN1YnN0aXR1dGlvbiAoc3Vic3RpdHV0aW9uLCByZXN1bHRTb0Zhcikge1xuICAgIC8vIG9ubHkgb3BlcmF0ZSBvbiBhcnJheXNcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzdWJzdGl0dXRpb24pKSB7XG4gICAgICBjb25zdCBhcnJheUxlbmd0aCA9IHN1YnN0aXR1dGlvbi5sZW5ndGhcbiAgICAgIGNvbnN0IHNlcGFyYXRvciA9IG9wdHMuc2VwYXJhdG9yXG4gICAgICBjb25zdCBjb25qdW5jdGlvbiA9IG9wdHMuY29uanVuY3Rpb25cbiAgICAgIGNvbnN0IHNlcmlhbCA9IG9wdHMuc2VyaWFsXG4gICAgICAvLyBqb2luIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXkgaW50byBhIHN0cmluZyB3aGVyZSBlYWNoIGl0ZW0gaXMgc2VwYXJhdGVkIGJ5IHNlcGFyYXRvclxuICAgICAgLy8gYmUgc3VyZSB0byBtYWludGFpbiBpbmRlbnRhdGlvblxuICAgICAgY29uc3QgaW5kZW50ID0gcmVzdWx0U29GYXIubWF0Y2goLyhcXG4/W15cXFNcXG5dKykkLylcbiAgICAgIGlmIChpbmRlbnQpIHtcbiAgICAgICAgc3Vic3RpdHV0aW9uID0gc3Vic3RpdHV0aW9uLmpvaW4oc2VwYXJhdG9yICsgaW5kZW50WzFdKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3Vic3RpdHV0aW9uID0gc3Vic3RpdHV0aW9uLmpvaW4oc2VwYXJhdG9yICsgJyAnKVxuICAgICAgfVxuICAgICAgLy8gaWYgY29uanVuY3Rpb24gaXMgc2V0LCByZXBsYWNlIHRoZSBsYXN0IHNlcGFyYXRvciB3aXRoIGNvbmp1bmN0aW9uLCBidXQgb25seSBpZiB0aGVyZSBpcyBtb3JlIHRoYW4gb25lIHN1YnN0aXR1dGlvblxuICAgICAgaWYgKGNvbmp1bmN0aW9uICYmIGFycmF5TGVuZ3RoID4gMSkge1xuICAgICAgICBjb25zdCBzZXBhcmF0b3JJbmRleCA9IHN1YnN0aXR1dGlvbi5sYXN0SW5kZXhPZihzZXBhcmF0b3IpXG4gICAgICAgIHN1YnN0aXR1dGlvbiA9IHN1YnN0aXR1dGlvblxuICAgICAgICAgIC5zbGljZSgwLCBzZXBhcmF0b3JJbmRleCkgKyAoc2VyaWFsID8gc2VwYXJhdG9yIDogJycpICsgJyAnICtcbiAgICAgICAgICAgIGNvbmp1bmN0aW9uICsgc3Vic3RpdHV0aW9uLnNsaWNlKHNlcGFyYXRvckluZGV4ICsgMSlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN1YnN0aXR1dGlvblxuICB9XG59KVxuXG5leHBvcnQgZGVmYXVsdCBpbmxpbmVBcnJheVRyYW5zZm9ybWVyXG4iXX0=