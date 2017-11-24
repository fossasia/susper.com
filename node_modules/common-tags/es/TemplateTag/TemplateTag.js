'use strict';

/**
 * @class TemplateTag
 * @classdesc Consumes a pipeline of composable transformer plugins and produces a template tag.
 */

import _taggedTemplateLiteral from 'babel-runtime/helpers/taggedTemplateLiteral';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';

var _templateObject = _taggedTemplateLiteral(['', ''], ['', '']);

var TemplateTag = function () {
  /**
   * constructs a template tag
   * @constructs TemplateTag
   * @param  {...Object} [...transformers] - an array or arguments list of transformers
   * @return {Function}                    - a template tag
   */
  function TemplateTag() {
    var _this = this;

    for (var _len = arguments.length, transformers = Array(_len), _key = 0; _key < _len; _key++) {
      transformers[_key] = arguments[_key];
    }

    _classCallCheck(this, TemplateTag);

    this.tag = function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      // if the first argument passed is a function, assume it is a template tag and return
      // an intermediary tag that processes the template using the aforementioned tag, passing the
      // result to our tag
      if (typeof args[0] === 'function') {
        return _this.interimTag.bind(_this, args.shift());
      }

      // else, return a transformed end result of processing the template with our tag
      return _this.transformEndResult(args.shift().reduce(_this.processSubstitutions.bind(_this, args)));
    };

    // if first argument is an array, extrude it as a list of transformers
    if (transformers.length && Array.isArray(transformers[0])) {
      transformers = transformers[0];
    }

    // if any transformers are functions, this means they are not initiated - automatically initiate them
    this.transformers = transformers.map(function (transformer) {
      return typeof transformer === 'function' ? transformer() : transformer;
    });

    // return an ES2015 template tag
    return this.tag;
  }

  /**
   * Applies all transformers to a template literal tagged with this method.
   * If a function is passed as the first argument, assumes the function is a template tag
   * and applies it to the template, returning a template tag.
   * @param  {(Function|Array<String>)} args[0] - Either a template tag or an array containing template strings separated by identifier
   * @param  {...*} [args[1]]                   - Optional list of substitution values.
   * @return {(String|Function)}                - Either an intermediary tag function or the results of processing the template.
   */


  _createClass(TemplateTag, [{
    key: 'interimTag',


    /**
     * An intermediary template tag that receives a template tag and passes the result of calling the template with the received
     * template tag to our own template tag.
     * @param  {Function}        nextTag          - the received template tag
     * @param  {Array<String>}   template         - the template to process
     * @param  {...*}            ...substitutions - `substitutions` is an array of all substitutions in the template
     * @return {*}                                - the final processed value
     */
    value: function interimTag(previousTag, template) {
      for (var _len3 = arguments.length, substitutions = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        substitutions[_key3 - 2] = arguments[_key3];
      }

      return this.tag(_templateObject, previousTag.apply(undefined, [template].concat(substitutions)));
    }

    /**
     * Performs bulk processing on the tagged template, transforming each substitution and then
     * concatenating the resulting values into a string.
     * @param  {Array<*>} substitutions - an array of all remaining substitutions present in this template
     * @param  {String}   resultSoFar   - this iteration's result string so far
     * @param  {String}   remainingPart - the template chunk after the current substitution
     * @return {String}                 - the result of joining this iteration's processed substitution with the result
     */

  }, {
    key: 'processSubstitutions',
    value: function processSubstitutions(substitutions, resultSoFar, remainingPart) {
      var substitution = this.transformSubstitution(substitutions.shift(), resultSoFar);
      return resultSoFar + substitution + remainingPart;
    }

    /**
     * When a substitution is encountered, iterates through each transformer and applies the transformer's
     * `onSubstitution` method to the substitution.
     * @param  {*}      substitution - The current substitution
     * @param  {String} resultSoFar  - The result up to and excluding this substitution.
     * @return {*}                   - The final result of applying all substitution transformations.
     */

  }, {
    key: 'transformSubstitution',
    value: function transformSubstitution(substitution, resultSoFar) {
      var cb = function cb(res, transform) {
        return transform.onSubstitution ? transform.onSubstitution(res, resultSoFar) : res;
      };
      return this.transformers.reduce(cb, substitution);
    }

    /**
     * Iterates through each transformer, applying the transformer's `onEndResult` method to the
     * template literal after all substitutions have finished processing.
     * @param  {String} endResult - The processed template, just before it is returned from the tag
     * @return {String}           - The final results of processing each transformer
     */

  }, {
    key: 'transformEndResult',
    value: function transformEndResult(endResult) {
      var cb = function cb(res, transform) {
        return transform.onEndResult ? transform.onEndResult(res) : res;
      };
      return this.transformers.reduce(cb, endResult);
    }
  }]);

  return TemplateTag;
}();

export default TemplateTag;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9UZW1wbGF0ZVRhZy9UZW1wbGF0ZVRhZy5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInRyYW5zZm9ybWVycyIsInRhZyIsImFyZ3MiLCJpbnRlcmltVGFnIiwiYmluZCIsInNoaWZ0IiwidHJhbnNmb3JtRW5kUmVzdWx0IiwicmVkdWNlIiwicHJvY2Vzc1N1YnN0aXR1dGlvbnMiLCJsZW5ndGgiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJ0cmFuc2Zvcm1lciIsInByZXZpb3VzVGFnIiwidGVtcGxhdGUiLCJzdWJzdGl0dXRpb25zIiwicmVzdWx0U29GYXIiLCJyZW1haW5pbmdQYXJ0Iiwic3Vic3RpdHV0aW9uIiwidHJhbnNmb3JtU3Vic3RpdHV0aW9uIiwiY2IiLCJyZXMiLCJ0cmFuc2Zvcm0iLCJvblN1YnN0aXR1dGlvbiIsImVuZFJlc3VsdCIsIm9uRW5kUmVzdWx0Il0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7SUFJcUJBLFc7QUFDbkI7Ozs7OztBQU1BLHlCQUE4QjtBQUFBOztBQUFBLHNDQUFkQyxZQUFjO0FBQWRBLGtCQUFjO0FBQUE7O0FBQUE7O0FBQUEsU0F5QjlCQyxHQXpCOEIsR0F5QnhCLFlBQWE7QUFBQSx5Q0FBVEMsSUFBUztBQUFUQSxZQUFTO0FBQUE7O0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLFVBQUksT0FBT0EsS0FBSyxDQUFMLENBQVAsS0FBbUIsVUFBdkIsRUFBbUM7QUFDakMsZUFBTyxNQUFLQyxVQUFMLENBQWdCQyxJQUFoQixRQUEyQkYsS0FBS0csS0FBTCxFQUEzQixDQUFQO0FBQ0Q7O0FBRUQ7QUFDQSxhQUFPLE1BQUtDLGtCQUFMLENBQ0xKLEtBQUtHLEtBQUwsR0FBYUUsTUFBYixDQUFvQixNQUFLQyxvQkFBTCxDQUEwQkosSUFBMUIsUUFBcUNGLElBQXJDLENBQXBCLENBREssQ0FBUDtBQUdELEtBckM2Qjs7QUFDNUI7QUFDQSxRQUFJRixhQUFhUyxNQUFiLElBQXVCQyxNQUFNQyxPQUFOLENBQWNYLGFBQWEsQ0FBYixDQUFkLENBQTNCLEVBQTJEO0FBQ3pEQSxxQkFBZUEsYUFBYSxDQUFiLENBQWY7QUFDRDs7QUFFRDtBQUNBLFNBQUtBLFlBQUwsR0FBb0JBLGFBQWFZLEdBQWIsQ0FBaUIsVUFBQ0MsV0FBRCxFQUFpQjtBQUNwRCxhQUFPLE9BQU9BLFdBQVAsS0FBdUIsVUFBdkIsR0FDSEEsYUFERyxHQUVIQSxXQUZKO0FBR0QsS0FKbUIsQ0FBcEI7O0FBTUE7QUFDQSxXQUFPLEtBQUtaLEdBQVo7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7Ozs7QUFzQkE7Ozs7Ozs7OytCQVFZYSxXLEVBQWFDLFEsRUFBNEI7QUFBQSx5Q0FBZkMsYUFBZTtBQUFmQSxxQkFBZTtBQUFBOztBQUNuRCxhQUFPLEtBQUtmLEdBQVosa0JBQWtCYSw4QkFBWUMsUUFBWixTQUF5QkMsYUFBekIsRUFBbEI7QUFDRDs7QUFFRDs7Ozs7Ozs7Ozs7eUNBUXNCQSxhLEVBQWVDLFcsRUFBYUMsYSxFQUFlO0FBQy9ELFVBQU1DLGVBQWUsS0FBS0MscUJBQUwsQ0FDbkJKLGNBQWNYLEtBQWQsRUFEbUIsRUFFbkJZLFdBRm1CLENBQXJCO0FBSUEsYUFBT0EsY0FBY0UsWUFBZCxHQUE2QkQsYUFBcEM7QUFDRDs7QUFFRDs7Ozs7Ozs7OzswQ0FPdUJDLFksRUFBY0YsVyxFQUFhO0FBQ2hELFVBQU1JLEtBQUssU0FBTEEsRUFBSyxDQUFDQyxHQUFELEVBQU1DLFNBQU47QUFBQSxlQUFvQkEsVUFBVUMsY0FBVixHQUMzQkQsVUFBVUMsY0FBVixDQUF5QkYsR0FBekIsRUFBOEJMLFdBQTlCLENBRDJCLEdBRTNCSyxHQUZPO0FBQUEsT0FBWDtBQUdBLGFBQU8sS0FBS3RCLFlBQUwsQ0FBa0JPLE1BQWxCLENBQXlCYyxFQUF6QixFQUE2QkYsWUFBN0IsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7Ozs7dUNBTW9CTSxTLEVBQVc7QUFDN0IsVUFBTUosS0FBSyxTQUFMQSxFQUFLLENBQUNDLEdBQUQsRUFBTUMsU0FBTjtBQUFBLGVBQW9CQSxVQUFVRyxXQUFWLEdBQzNCSCxVQUFVRyxXQUFWLENBQXNCSixHQUF0QixDQUQyQixHQUUzQkEsR0FGTztBQUFBLE9BQVg7QUFHQSxhQUFPLEtBQUt0QixZQUFMLENBQWtCTyxNQUFsQixDQUF5QmMsRUFBekIsRUFBNkJJLFNBQTdCLENBQVA7QUFDRDs7Ozs7O2VBbkdrQjFCLFciLCJmaWxlIjoiVGVtcGxhdGVUYWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuLyoqXG4gKiBAY2xhc3MgVGVtcGxhdGVUYWdcbiAqIEBjbGFzc2Rlc2MgQ29uc3VtZXMgYSBwaXBlbGluZSBvZiBjb21wb3NhYmxlIHRyYW5zZm9ybWVyIHBsdWdpbnMgYW5kIHByb2R1Y2VzIGEgdGVtcGxhdGUgdGFnLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW1wbGF0ZVRhZyB7XG4gIC8qKlxuICAgKiBjb25zdHJ1Y3RzIGEgdGVtcGxhdGUgdGFnXG4gICAqIEBjb25zdHJ1Y3RzIFRlbXBsYXRlVGFnXG4gICAqIEBwYXJhbSAgey4uLk9iamVjdH0gWy4uLnRyYW5zZm9ybWVyc10gLSBhbiBhcnJheSBvciBhcmd1bWVudHMgbGlzdCBvZiB0cmFuc2Zvcm1lcnNcbiAgICogQHJldHVybiB7RnVuY3Rpb259ICAgICAgICAgICAgICAgICAgICAtIGEgdGVtcGxhdGUgdGFnXG4gICAqL1xuICBjb25zdHJ1Y3RvciAoLi4udHJhbnNmb3JtZXJzKSB7XG4gICAgLy8gaWYgZmlyc3QgYXJndW1lbnQgaXMgYW4gYXJyYXksIGV4dHJ1ZGUgaXQgYXMgYSBsaXN0IG9mIHRyYW5zZm9ybWVyc1xuICAgIGlmICh0cmFuc2Zvcm1lcnMubGVuZ3RoICYmIEFycmF5LmlzQXJyYXkodHJhbnNmb3JtZXJzWzBdKSkge1xuICAgICAgdHJhbnNmb3JtZXJzID0gdHJhbnNmb3JtZXJzWzBdXG4gICAgfVxuXG4gICAgLy8gaWYgYW55IHRyYW5zZm9ybWVycyBhcmUgZnVuY3Rpb25zLCB0aGlzIG1lYW5zIHRoZXkgYXJlIG5vdCBpbml0aWF0ZWQgLSBhdXRvbWF0aWNhbGx5IGluaXRpYXRlIHRoZW1cbiAgICB0aGlzLnRyYW5zZm9ybWVycyA9IHRyYW5zZm9ybWVycy5tYXAoKHRyYW5zZm9ybWVyKSA9PiB7XG4gICAgICByZXR1cm4gdHlwZW9mIHRyYW5zZm9ybWVyID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gdHJhbnNmb3JtZXIoKVxuICAgICAgICA6IHRyYW5zZm9ybWVyXG4gICAgfSlcblxuICAgIC8vIHJldHVybiBhbiBFUzIwMTUgdGVtcGxhdGUgdGFnXG4gICAgcmV0dXJuIHRoaXMudGFnXG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyBhbGwgdHJhbnNmb3JtZXJzIHRvIGEgdGVtcGxhdGUgbGl0ZXJhbCB0YWdnZWQgd2l0aCB0aGlzIG1ldGhvZC5cbiAgICogSWYgYSBmdW5jdGlvbiBpcyBwYXNzZWQgYXMgdGhlIGZpcnN0IGFyZ3VtZW50LCBhc3N1bWVzIHRoZSBmdW5jdGlvbiBpcyBhIHRlbXBsYXRlIHRhZ1xuICAgKiBhbmQgYXBwbGllcyBpdCB0byB0aGUgdGVtcGxhdGUsIHJldHVybmluZyBhIHRlbXBsYXRlIHRhZy5cbiAgICogQHBhcmFtICB7KEZ1bmN0aW9ufEFycmF5PFN0cmluZz4pfSBhcmdzWzBdIC0gRWl0aGVyIGEgdGVtcGxhdGUgdGFnIG9yIGFuIGFycmF5IGNvbnRhaW5pbmcgdGVtcGxhdGUgc3RyaW5ncyBzZXBhcmF0ZWQgYnkgaWRlbnRpZmllclxuICAgKiBAcGFyYW0gIHsuLi4qfSBbYXJnc1sxXV0gICAgICAgICAgICAgICAgICAgLSBPcHRpb25hbCBsaXN0IG9mIHN1YnN0aXR1dGlvbiB2YWx1ZXMuXG4gICAqIEByZXR1cm4geyhTdHJpbmd8RnVuY3Rpb24pfSAgICAgICAgICAgICAgICAtIEVpdGhlciBhbiBpbnRlcm1lZGlhcnkgdGFnIGZ1bmN0aW9uIG9yIHRoZSByZXN1bHRzIG9mIHByb2Nlc3NpbmcgdGhlIHRlbXBsYXRlLlxuICAgKi9cbiAgdGFnID0gKC4uLmFyZ3MpID0+IHtcbiAgICAvLyBpZiB0aGUgZmlyc3QgYXJndW1lbnQgcGFzc2VkIGlzIGEgZnVuY3Rpb24sIGFzc3VtZSBpdCBpcyBhIHRlbXBsYXRlIHRhZyBhbmQgcmV0dXJuXG4gICAgLy8gYW4gaW50ZXJtZWRpYXJ5IHRhZyB0aGF0IHByb2Nlc3NlcyB0aGUgdGVtcGxhdGUgdXNpbmcgdGhlIGFmb3JlbWVudGlvbmVkIHRhZywgcGFzc2luZyB0aGVcbiAgICAvLyByZXN1bHQgdG8gb3VyIHRhZ1xuICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHRoaXMuaW50ZXJpbVRhZy5iaW5kKHRoaXMsIGFyZ3Muc2hpZnQoKSlcbiAgICB9XG5cbiAgICAvLyBlbHNlLCByZXR1cm4gYSB0cmFuc2Zvcm1lZCBlbmQgcmVzdWx0IG9mIHByb2Nlc3NpbmcgdGhlIHRlbXBsYXRlIHdpdGggb3VyIHRhZ1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybUVuZFJlc3VsdChcbiAgICAgIGFyZ3Muc2hpZnQoKS5yZWR1Y2UodGhpcy5wcm9jZXNzU3Vic3RpdHV0aW9ucy5iaW5kKHRoaXMsIGFyZ3MpKVxuICAgIClcbiAgfVxuXG4gIC8qKlxuICAgKiBBbiBpbnRlcm1lZGlhcnkgdGVtcGxhdGUgdGFnIHRoYXQgcmVjZWl2ZXMgYSB0ZW1wbGF0ZSB0YWcgYW5kIHBhc3NlcyB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIHRlbXBsYXRlIHdpdGggdGhlIHJlY2VpdmVkXG4gICAqIHRlbXBsYXRlIHRhZyB0byBvdXIgb3duIHRlbXBsYXRlIHRhZy5cbiAgICogQHBhcmFtICB7RnVuY3Rpb259ICAgICAgICBuZXh0VGFnICAgICAgICAgIC0gdGhlIHJlY2VpdmVkIHRlbXBsYXRlIHRhZ1xuICAgKiBAcGFyYW0gIHtBcnJheTxTdHJpbmc+fSAgIHRlbXBsYXRlICAgICAgICAgLSB0aGUgdGVtcGxhdGUgdG8gcHJvY2Vzc1xuICAgKiBAcGFyYW0gIHsuLi4qfSAgICAgICAgICAgIC4uLnN1YnN0aXR1dGlvbnMgLSBgc3Vic3RpdHV0aW9uc2AgaXMgYW4gYXJyYXkgb2YgYWxsIHN1YnN0aXR1dGlvbnMgaW4gdGhlIHRlbXBsYXRlXG4gICAqIEByZXR1cm4geyp9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAtIHRoZSBmaW5hbCBwcm9jZXNzZWQgdmFsdWVcbiAgICovXG4gIGludGVyaW1UYWcgKHByZXZpb3VzVGFnLCB0ZW1wbGF0ZSwgLi4uc3Vic3RpdHV0aW9ucykge1xuICAgIHJldHVybiB0aGlzLnRhZ2Ake3ByZXZpb3VzVGFnKHRlbXBsYXRlLCAuLi5zdWJzdGl0dXRpb25zKX1gXG4gIH1cblxuICAvKipcbiAgICogUGVyZm9ybXMgYnVsayBwcm9jZXNzaW5nIG9uIHRoZSB0YWdnZWQgdGVtcGxhdGUsIHRyYW5zZm9ybWluZyBlYWNoIHN1YnN0aXR1dGlvbiBhbmQgdGhlblxuICAgKiBjb25jYXRlbmF0aW5nIHRoZSByZXN1bHRpbmcgdmFsdWVzIGludG8gYSBzdHJpbmcuXG4gICAqIEBwYXJhbSAge0FycmF5PCo+fSBzdWJzdGl0dXRpb25zIC0gYW4gYXJyYXkgb2YgYWxsIHJlbWFpbmluZyBzdWJzdGl0dXRpb25zIHByZXNlbnQgaW4gdGhpcyB0ZW1wbGF0ZVxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgcmVzdWx0U29GYXIgICAtIHRoaXMgaXRlcmF0aW9uJ3MgcmVzdWx0IHN0cmluZyBzbyBmYXJcbiAgICogQHBhcmFtICB7U3RyaW5nfSAgIHJlbWFpbmluZ1BhcnQgLSB0aGUgdGVtcGxhdGUgY2h1bmsgYWZ0ZXIgdGhlIGN1cnJlbnQgc3Vic3RpdHV0aW9uXG4gICAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgICAgICAgIC0gdGhlIHJlc3VsdCBvZiBqb2luaW5nIHRoaXMgaXRlcmF0aW9uJ3MgcHJvY2Vzc2VkIHN1YnN0aXR1dGlvbiB3aXRoIHRoZSByZXN1bHRcbiAgICovXG4gIHByb2Nlc3NTdWJzdGl0dXRpb25zIChzdWJzdGl0dXRpb25zLCByZXN1bHRTb0ZhciwgcmVtYWluaW5nUGFydCkge1xuICAgIGNvbnN0IHN1YnN0aXR1dGlvbiA9IHRoaXMudHJhbnNmb3JtU3Vic3RpdHV0aW9uKFxuICAgICAgc3Vic3RpdHV0aW9ucy5zaGlmdCgpLFxuICAgICAgcmVzdWx0U29GYXJcbiAgICApXG4gICAgcmV0dXJuIHJlc3VsdFNvRmFyICsgc3Vic3RpdHV0aW9uICsgcmVtYWluaW5nUGFydFxuICB9XG5cbiAgLyoqXG4gICAqIFdoZW4gYSBzdWJzdGl0dXRpb24gaXMgZW5jb3VudGVyZWQsIGl0ZXJhdGVzIHRocm91Z2ggZWFjaCB0cmFuc2Zvcm1lciBhbmQgYXBwbGllcyB0aGUgdHJhbnNmb3JtZXInc1xuICAgKiBgb25TdWJzdGl0dXRpb25gIG1ldGhvZCB0byB0aGUgc3Vic3RpdHV0aW9uLlxuICAgKiBAcGFyYW0gIHsqfSAgICAgIHN1YnN0aXR1dGlvbiAtIFRoZSBjdXJyZW50IHN1YnN0aXR1dGlvblxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IHJlc3VsdFNvRmFyICAtIFRoZSByZXN1bHQgdXAgdG8gYW5kIGV4Y2x1ZGluZyB0aGlzIHN1YnN0aXR1dGlvbi5cbiAgICogQHJldHVybiB7Kn0gICAgICAgICAgICAgICAgICAgLSBUaGUgZmluYWwgcmVzdWx0IG9mIGFwcGx5aW5nIGFsbCBzdWJzdGl0dXRpb24gdHJhbnNmb3JtYXRpb25zLlxuICAgKi9cbiAgdHJhbnNmb3JtU3Vic3RpdHV0aW9uIChzdWJzdGl0dXRpb24sIHJlc3VsdFNvRmFyKSB7XG4gICAgY29uc3QgY2IgPSAocmVzLCB0cmFuc2Zvcm0pID0+IHRyYW5zZm9ybS5vblN1YnN0aXR1dGlvblxuICAgICAgPyB0cmFuc2Zvcm0ub25TdWJzdGl0dXRpb24ocmVzLCByZXN1bHRTb0ZhcilcbiAgICAgIDogcmVzXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtZXJzLnJlZHVjZShjYiwgc3Vic3RpdHV0aW9uKVxuICB9XG5cbiAgLyoqXG4gICAqIEl0ZXJhdGVzIHRocm91Z2ggZWFjaCB0cmFuc2Zvcm1lciwgYXBwbHlpbmcgdGhlIHRyYW5zZm9ybWVyJ3MgYG9uRW5kUmVzdWx0YCBtZXRob2QgdG8gdGhlXG4gICAqIHRlbXBsYXRlIGxpdGVyYWwgYWZ0ZXIgYWxsIHN1YnN0aXR1dGlvbnMgaGF2ZSBmaW5pc2hlZCBwcm9jZXNzaW5nLlxuICAgKiBAcGFyYW0gIHtTdHJpbmd9IGVuZFJlc3VsdCAtIFRoZSBwcm9jZXNzZWQgdGVtcGxhdGUsIGp1c3QgYmVmb3JlIGl0IGlzIHJldHVybmVkIGZyb20gdGhlIHRhZ1xuICAgKiBAcmV0dXJuIHtTdHJpbmd9ICAgICAgICAgICAtIFRoZSBmaW5hbCByZXN1bHRzIG9mIHByb2Nlc3NpbmcgZWFjaCB0cmFuc2Zvcm1lclxuICAgKi9cbiAgdHJhbnNmb3JtRW5kUmVzdWx0IChlbmRSZXN1bHQpIHtcbiAgICBjb25zdCBjYiA9IChyZXMsIHRyYW5zZm9ybSkgPT4gdHJhbnNmb3JtLm9uRW5kUmVzdWx0XG4gICAgICA/IHRyYW5zZm9ybS5vbkVuZFJlc3VsdChyZXMpXG4gICAgICA6IHJlc1xuICAgIHJldHVybiB0aGlzLnRyYW5zZm9ybWVycy5yZWR1Y2UoY2IsIGVuZFJlc3VsdClcbiAgfVxufVxuIl19