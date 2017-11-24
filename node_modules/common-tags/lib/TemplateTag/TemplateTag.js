'use strict';

/**
 * @class TemplateTag
 * @classdesc Consumes a pipeline of composable transformer plugins and produces a template tag.
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = require('babel-runtime/helpers/taggedTemplateLiteral');

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['', ''], ['', '']);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    (0, _classCallCheck3.default)(this, TemplateTag);

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


  (0, _createClass3.default)(TemplateTag, [{
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

exports.default = TemplateTag;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9UZW1wbGF0ZVRhZy9UZW1wbGF0ZVRhZy5qcyJdLCJuYW1lcyI6WyJUZW1wbGF0ZVRhZyIsInRyYW5zZm9ybWVycyIsInRhZyIsImFyZ3MiLCJpbnRlcmltVGFnIiwiYmluZCIsInNoaWZ0IiwidHJhbnNmb3JtRW5kUmVzdWx0IiwicmVkdWNlIiwicHJvY2Vzc1N1YnN0aXR1dGlvbnMiLCJsZW5ndGgiLCJBcnJheSIsImlzQXJyYXkiLCJtYXAiLCJ0cmFuc2Zvcm1lciIsInByZXZpb3VzVGFnIiwidGVtcGxhdGUiLCJzdWJzdGl0dXRpb25zIiwicmVzdWx0U29GYXIiLCJyZW1haW5pbmdQYXJ0Iiwic3Vic3RpdHV0aW9uIiwidHJhbnNmb3JtU3Vic3RpdHV0aW9uIiwiY2IiLCJyZXMiLCJ0cmFuc2Zvcm0iLCJvblN1YnN0aXR1dGlvbiIsImVuZFJlc3VsdCIsIm9uRW5kUmVzdWx0Il0sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQUlxQkEsVztBQUNuQjs7Ozs7O0FBTUEseUJBQThCO0FBQUE7O0FBQUEsc0NBQWRDLFlBQWM7QUFBZEEsa0JBQWM7QUFBQTs7QUFBQTs7QUFBQSxTQXlCOUJDLEdBekI4QixHQXlCeEIsWUFBYTtBQUFBLHlDQUFUQyxJQUFTO0FBQVRBLFlBQVM7QUFBQTs7QUFDakI7QUFDQTtBQUNBO0FBQ0EsVUFBSSxPQUFPQSxLQUFLLENBQUwsQ0FBUCxLQUFtQixVQUF2QixFQUFtQztBQUNqQyxlQUFPLE1BQUtDLFVBQUwsQ0FBZ0JDLElBQWhCLFFBQTJCRixLQUFLRyxLQUFMLEVBQTNCLENBQVA7QUFDRDs7QUFFRDtBQUNBLGFBQU8sTUFBS0Msa0JBQUwsQ0FDTEosS0FBS0csS0FBTCxHQUFhRSxNQUFiLENBQW9CLE1BQUtDLG9CQUFMLENBQTBCSixJQUExQixRQUFxQ0YsSUFBckMsQ0FBcEIsQ0FESyxDQUFQO0FBR0QsS0FyQzZCOztBQUM1QjtBQUNBLFFBQUlGLGFBQWFTLE1BQWIsSUFBdUJDLE1BQU1DLE9BQU4sQ0FBY1gsYUFBYSxDQUFiLENBQWQsQ0FBM0IsRUFBMkQ7QUFDekRBLHFCQUFlQSxhQUFhLENBQWIsQ0FBZjtBQUNEOztBQUVEO0FBQ0EsU0FBS0EsWUFBTCxHQUFvQkEsYUFBYVksR0FBYixDQUFpQixVQUFDQyxXQUFELEVBQWlCO0FBQ3BELGFBQU8sT0FBT0EsV0FBUCxLQUF1QixVQUF2QixHQUNIQSxhQURHLEdBRUhBLFdBRko7QUFHRCxLQUptQixDQUFwQjs7QUFNQTtBQUNBLFdBQU8sS0FBS1osR0FBWjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozs7OztBQXNCQTs7Ozs7Ozs7K0JBUVlhLFcsRUFBYUMsUSxFQUE0QjtBQUFBLHlDQUFmQyxhQUFlO0FBQWZBLHFCQUFlO0FBQUE7O0FBQ25ELGFBQU8sS0FBS2YsR0FBWixrQkFBa0JhLDhCQUFZQyxRQUFaLFNBQXlCQyxhQUF6QixFQUFsQjtBQUNEOztBQUVEOzs7Ozs7Ozs7Ozt5Q0FRc0JBLGEsRUFBZUMsVyxFQUFhQyxhLEVBQWU7QUFDL0QsVUFBTUMsZUFBZSxLQUFLQyxxQkFBTCxDQUNuQkosY0FBY1gsS0FBZCxFQURtQixFQUVuQlksV0FGbUIsQ0FBckI7QUFJQSxhQUFPQSxjQUFjRSxZQUFkLEdBQTZCRCxhQUFwQztBQUNEOztBQUVEOzs7Ozs7Ozs7OzBDQU91QkMsWSxFQUFjRixXLEVBQWE7QUFDaEQsVUFBTUksS0FBSyxTQUFMQSxFQUFLLENBQUNDLEdBQUQsRUFBTUMsU0FBTjtBQUFBLGVBQW9CQSxVQUFVQyxjQUFWLEdBQzNCRCxVQUFVQyxjQUFWLENBQXlCRixHQUF6QixFQUE4QkwsV0FBOUIsQ0FEMkIsR0FFM0JLLEdBRk87QUFBQSxPQUFYO0FBR0EsYUFBTyxLQUFLdEIsWUFBTCxDQUFrQk8sTUFBbEIsQ0FBeUJjLEVBQXpCLEVBQTZCRixZQUE3QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7Ozt1Q0FNb0JNLFMsRUFBVztBQUM3QixVQUFNSixLQUFLLFNBQUxBLEVBQUssQ0FBQ0MsR0FBRCxFQUFNQyxTQUFOO0FBQUEsZUFBb0JBLFVBQVVHLFdBQVYsR0FDM0JILFVBQVVHLFdBQVYsQ0FBc0JKLEdBQXRCLENBRDJCLEdBRTNCQSxHQUZPO0FBQUEsT0FBWDtBQUdBLGFBQU8sS0FBS3RCLFlBQUwsQ0FBa0JPLE1BQWxCLENBQXlCYyxFQUF6QixFQUE2QkksU0FBN0IsQ0FBUDtBQUNEOzs7OztrQkFuR2tCMUIsVyIsImZpbGUiOiJUZW1wbGF0ZVRhZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG4vKipcbiAqIEBjbGFzcyBUZW1wbGF0ZVRhZ1xuICogQGNsYXNzZGVzYyBDb25zdW1lcyBhIHBpcGVsaW5lIG9mIGNvbXBvc2FibGUgdHJhbnNmb3JtZXIgcGx1Z2lucyBhbmQgcHJvZHVjZXMgYSB0ZW1wbGF0ZSB0YWcuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlbXBsYXRlVGFnIHtcbiAgLyoqXG4gICAqIGNvbnN0cnVjdHMgYSB0ZW1wbGF0ZSB0YWdcbiAgICogQGNvbnN0cnVjdHMgVGVtcGxhdGVUYWdcbiAgICogQHBhcmFtICB7Li4uT2JqZWN0fSBbLi4udHJhbnNmb3JtZXJzXSAtIGFuIGFycmF5IG9yIGFyZ3VtZW50cyBsaXN0IG9mIHRyYW5zZm9ybWVyc1xuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gICAgICAgICAgICAgICAgICAgIC0gYSB0ZW1wbGF0ZSB0YWdcbiAgICovXG4gIGNvbnN0cnVjdG9yICguLi50cmFuc2Zvcm1lcnMpIHtcbiAgICAvLyBpZiBmaXJzdCBhcmd1bWVudCBpcyBhbiBhcnJheSwgZXh0cnVkZSBpdCBhcyBhIGxpc3Qgb2YgdHJhbnNmb3JtZXJzXG4gICAgaWYgKHRyYW5zZm9ybWVycy5sZW5ndGggJiYgQXJyYXkuaXNBcnJheSh0cmFuc2Zvcm1lcnNbMF0pKSB7XG4gICAgICB0cmFuc2Zvcm1lcnMgPSB0cmFuc2Zvcm1lcnNbMF1cbiAgICB9XG5cbiAgICAvLyBpZiBhbnkgdHJhbnNmb3JtZXJzIGFyZSBmdW5jdGlvbnMsIHRoaXMgbWVhbnMgdGhleSBhcmUgbm90IGluaXRpYXRlZCAtIGF1dG9tYXRpY2FsbHkgaW5pdGlhdGUgdGhlbVxuICAgIHRoaXMudHJhbnNmb3JtZXJzID0gdHJhbnNmb3JtZXJzLm1hcCgodHJhbnNmb3JtZXIpID0+IHtcbiAgICAgIHJldHVybiB0eXBlb2YgdHJhbnNmb3JtZXIgPT09ICdmdW5jdGlvbidcbiAgICAgICAgPyB0cmFuc2Zvcm1lcigpXG4gICAgICAgIDogdHJhbnNmb3JtZXJcbiAgICB9KVxuXG4gICAgLy8gcmV0dXJuIGFuIEVTMjAxNSB0ZW1wbGF0ZSB0YWdcbiAgICByZXR1cm4gdGhpcy50YWdcbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBsaWVzIGFsbCB0cmFuc2Zvcm1lcnMgdG8gYSB0ZW1wbGF0ZSBsaXRlcmFsIHRhZ2dlZCB3aXRoIHRoaXMgbWV0aG9kLlxuICAgKiBJZiBhIGZ1bmN0aW9uIGlzIHBhc3NlZCBhcyB0aGUgZmlyc3QgYXJndW1lbnQsIGFzc3VtZXMgdGhlIGZ1bmN0aW9uIGlzIGEgdGVtcGxhdGUgdGFnXG4gICAqIGFuZCBhcHBsaWVzIGl0IHRvIHRoZSB0ZW1wbGF0ZSwgcmV0dXJuaW5nIGEgdGVtcGxhdGUgdGFnLlxuICAgKiBAcGFyYW0gIHsoRnVuY3Rpb258QXJyYXk8U3RyaW5nPil9IGFyZ3NbMF0gLSBFaXRoZXIgYSB0ZW1wbGF0ZSB0YWcgb3IgYW4gYXJyYXkgY29udGFpbmluZyB0ZW1wbGF0ZSBzdHJpbmdzIHNlcGFyYXRlZCBieSBpZGVudGlmaWVyXG4gICAqIEBwYXJhbSAgey4uLip9IFthcmdzWzFdXSAgICAgICAgICAgICAgICAgICAtIE9wdGlvbmFsIGxpc3Qgb2Ygc3Vic3RpdHV0aW9uIHZhbHVlcy5cbiAgICogQHJldHVybiB7KFN0cmluZ3xGdW5jdGlvbil9ICAgICAgICAgICAgICAgIC0gRWl0aGVyIGFuIGludGVybWVkaWFyeSB0YWcgZnVuY3Rpb24gb3IgdGhlIHJlc3VsdHMgb2YgcHJvY2Vzc2luZyB0aGUgdGVtcGxhdGUuXG4gICAqL1xuICB0YWcgPSAoLi4uYXJncykgPT4ge1xuICAgIC8vIGlmIHRoZSBmaXJzdCBhcmd1bWVudCBwYXNzZWQgaXMgYSBmdW5jdGlvbiwgYXNzdW1lIGl0IGlzIGEgdGVtcGxhdGUgdGFnIGFuZCByZXR1cm5cbiAgICAvLyBhbiBpbnRlcm1lZGlhcnkgdGFnIHRoYXQgcHJvY2Vzc2VzIHRoZSB0ZW1wbGF0ZSB1c2luZyB0aGUgYWZvcmVtZW50aW9uZWQgdGFnLCBwYXNzaW5nIHRoZVxuICAgIC8vIHJlc3VsdCB0byBvdXIgdGFnXG4gICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnRlcmltVGFnLmJpbmQodGhpcywgYXJncy5zaGlmdCgpKVxuICAgIH1cblxuICAgIC8vIGVsc2UsIHJldHVybiBhIHRyYW5zZm9ybWVkIGVuZCByZXN1bHQgb2YgcHJvY2Vzc2luZyB0aGUgdGVtcGxhdGUgd2l0aCBvdXIgdGFnXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtRW5kUmVzdWx0KFxuICAgICAgYXJncy5zaGlmdCgpLnJlZHVjZSh0aGlzLnByb2Nlc3NTdWJzdGl0dXRpb25zLmJpbmQodGhpcywgYXJncykpXG4gICAgKVxuICB9XG5cbiAgLyoqXG4gICAqIEFuIGludGVybWVkaWFyeSB0ZW1wbGF0ZSB0YWcgdGhhdCByZWNlaXZlcyBhIHRlbXBsYXRlIHRhZyBhbmQgcGFzc2VzIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgdGVtcGxhdGUgd2l0aCB0aGUgcmVjZWl2ZWRcbiAgICogdGVtcGxhdGUgdGFnIHRvIG91ciBvd24gdGVtcGxhdGUgdGFnLlxuICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gICAgICAgIG5leHRUYWcgICAgICAgICAgLSB0aGUgcmVjZWl2ZWQgdGVtcGxhdGUgdGFnXG4gICAqIEBwYXJhbSAge0FycmF5PFN0cmluZz59ICAgdGVtcGxhdGUgICAgICAgICAtIHRoZSB0ZW1wbGF0ZSB0byBwcm9jZXNzXG4gICAqIEBwYXJhbSAgey4uLip9ICAgICAgICAgICAgLi4uc3Vic3RpdHV0aW9ucyAtIGBzdWJzdGl0dXRpb25zYCBpcyBhbiBhcnJheSBvZiBhbGwgc3Vic3RpdHV0aW9ucyBpbiB0aGUgdGVtcGxhdGVcbiAgICogQHJldHVybiB7Kn0gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC0gdGhlIGZpbmFsIHByb2Nlc3NlZCB2YWx1ZVxuICAgKi9cbiAgaW50ZXJpbVRhZyAocHJldmlvdXNUYWcsIHRlbXBsYXRlLCAuLi5zdWJzdGl0dXRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMudGFnYCR7cHJldmlvdXNUYWcodGVtcGxhdGUsIC4uLnN1YnN0aXR1dGlvbnMpfWBcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBidWxrIHByb2Nlc3Npbmcgb24gdGhlIHRhZ2dlZCB0ZW1wbGF0ZSwgdHJhbnNmb3JtaW5nIGVhY2ggc3Vic3RpdHV0aW9uIGFuZCB0aGVuXG4gICAqIGNvbmNhdGVuYXRpbmcgdGhlIHJlc3VsdGluZyB2YWx1ZXMgaW50byBhIHN0cmluZy5cbiAgICogQHBhcmFtICB7QXJyYXk8Kj59IHN1YnN0aXR1dGlvbnMgLSBhbiBhcnJheSBvZiBhbGwgcmVtYWluaW5nIHN1YnN0aXR1dGlvbnMgcHJlc2VudCBpbiB0aGlzIHRlbXBsYXRlXG4gICAqIEBwYXJhbSAge1N0cmluZ30gICByZXN1bHRTb0ZhciAgIC0gdGhpcyBpdGVyYXRpb24ncyByZXN1bHQgc3RyaW5nIHNvIGZhclxuICAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgcmVtYWluaW5nUGFydCAtIHRoZSB0ZW1wbGF0ZSBjaHVuayBhZnRlciB0aGUgY3VycmVudCBzdWJzdGl0dXRpb25cbiAgICogQHJldHVybiB7U3RyaW5nfSAgICAgICAgICAgICAgICAgLSB0aGUgcmVzdWx0IG9mIGpvaW5pbmcgdGhpcyBpdGVyYXRpb24ncyBwcm9jZXNzZWQgc3Vic3RpdHV0aW9uIHdpdGggdGhlIHJlc3VsdFxuICAgKi9cbiAgcHJvY2Vzc1N1YnN0aXR1dGlvbnMgKHN1YnN0aXR1dGlvbnMsIHJlc3VsdFNvRmFyLCByZW1haW5pbmdQYXJ0KSB7XG4gICAgY29uc3Qgc3Vic3RpdHV0aW9uID0gdGhpcy50cmFuc2Zvcm1TdWJzdGl0dXRpb24oXG4gICAgICBzdWJzdGl0dXRpb25zLnNoaWZ0KCksXG4gICAgICByZXN1bHRTb0ZhclxuICAgIClcbiAgICByZXR1cm4gcmVzdWx0U29GYXIgKyBzdWJzdGl0dXRpb24gKyByZW1haW5pbmdQYXJ0XG4gIH1cblxuICAvKipcbiAgICogV2hlbiBhIHN1YnN0aXR1dGlvbiBpcyBlbmNvdW50ZXJlZCwgaXRlcmF0ZXMgdGhyb3VnaCBlYWNoIHRyYW5zZm9ybWVyIGFuZCBhcHBsaWVzIHRoZSB0cmFuc2Zvcm1lcidzXG4gICAqIGBvblN1YnN0aXR1dGlvbmAgbWV0aG9kIHRvIHRoZSBzdWJzdGl0dXRpb24uXG4gICAqIEBwYXJhbSAgeyp9ICAgICAgc3Vic3RpdHV0aW9uIC0gVGhlIGN1cnJlbnQgc3Vic3RpdHV0aW9uXG4gICAqIEBwYXJhbSAge1N0cmluZ30gcmVzdWx0U29GYXIgIC0gVGhlIHJlc3VsdCB1cCB0byBhbmQgZXhjbHVkaW5nIHRoaXMgc3Vic3RpdHV0aW9uLlxuICAgKiBAcmV0dXJuIHsqfSAgICAgICAgICAgICAgICAgICAtIFRoZSBmaW5hbCByZXN1bHQgb2YgYXBwbHlpbmcgYWxsIHN1YnN0aXR1dGlvbiB0cmFuc2Zvcm1hdGlvbnMuXG4gICAqL1xuICB0cmFuc2Zvcm1TdWJzdGl0dXRpb24gKHN1YnN0aXR1dGlvbiwgcmVzdWx0U29GYXIpIHtcbiAgICBjb25zdCBjYiA9IChyZXMsIHRyYW5zZm9ybSkgPT4gdHJhbnNmb3JtLm9uU3Vic3RpdHV0aW9uXG4gICAgICA/IHRyYW5zZm9ybS5vblN1YnN0aXR1dGlvbihyZXMsIHJlc3VsdFNvRmFyKVxuICAgICAgOiByZXNcbiAgICByZXR1cm4gdGhpcy50cmFuc2Zvcm1lcnMucmVkdWNlKGNiLCBzdWJzdGl0dXRpb24pXG4gIH1cblxuICAvKipcbiAgICogSXRlcmF0ZXMgdGhyb3VnaCBlYWNoIHRyYW5zZm9ybWVyLCBhcHBseWluZyB0aGUgdHJhbnNmb3JtZXIncyBgb25FbmRSZXN1bHRgIG1ldGhvZCB0byB0aGVcbiAgICogdGVtcGxhdGUgbGl0ZXJhbCBhZnRlciBhbGwgc3Vic3RpdHV0aW9ucyBoYXZlIGZpbmlzaGVkIHByb2Nlc3NpbmcuXG4gICAqIEBwYXJhbSAge1N0cmluZ30gZW5kUmVzdWx0IC0gVGhlIHByb2Nlc3NlZCB0ZW1wbGF0ZSwganVzdCBiZWZvcmUgaXQgaXMgcmV0dXJuZWQgZnJvbSB0aGUgdGFnXG4gICAqIEByZXR1cm4ge1N0cmluZ30gICAgICAgICAgIC0gVGhlIGZpbmFsIHJlc3VsdHMgb2YgcHJvY2Vzc2luZyBlYWNoIHRyYW5zZm9ybWVyXG4gICAqL1xuICB0cmFuc2Zvcm1FbmRSZXN1bHQgKGVuZFJlc3VsdCkge1xuICAgIGNvbnN0IGNiID0gKHJlcywgdHJhbnNmb3JtKSA9PiB0cmFuc2Zvcm0ub25FbmRSZXN1bHRcbiAgICAgID8gdHJhbnNmb3JtLm9uRW5kUmVzdWx0KHJlcylcbiAgICAgIDogcmVzXG4gICAgcmV0dXJuIHRoaXMudHJhbnNmb3JtZXJzLnJlZHVjZShjYiwgZW5kUmVzdWx0KVxuICB9XG59XG4iXX0=