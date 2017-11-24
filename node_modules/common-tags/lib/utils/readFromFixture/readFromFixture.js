'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readFromFixture;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _node = require('when/node');

var _node2 = _interopRequireDefault(_node);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * reads the text contents of <name>.txt in the fixtures folder
 * relative to the caller module's test file
 * @param  {String} name - the name of the fixture you want to read
 * @return {Promise<String>} - the retrieved fixture's file contents
 */
function readFromFixture(dirname, name) {
  return _node2.default.call(_fs2.default.readFile, _path2.default.join(dirname, 'fixtures/' + name + '.txt'), 'utf8').then(function (contents) {
    return contents.replace(/\r\n/g, '\n').trim();
  });
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy9yZWFkRnJvbUZpeHR1cmUvcmVhZEZyb21GaXh0dXJlLmpzIl0sIm5hbWVzIjpbInJlYWRGcm9tRml4dHVyZSIsImRpcm5hbWUiLCJuYW1lIiwiY2FsbCIsInJlYWRGaWxlIiwiam9pbiIsInRoZW4iLCJjb250ZW50cyIsInJlcGxhY2UiLCJ0cmltIl0sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7a0JBWXdCQSxlOztBQVZ4Qjs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7QUFNZSxTQUFTQSxlQUFULENBQTBCQyxPQUExQixFQUFtQ0MsSUFBbkMsRUFBeUM7QUFDdEQsU0FBTyxlQUFLQyxJQUFMLENBQVUsYUFBR0MsUUFBYixFQUF1QixlQUFLQyxJQUFMLENBQVVKLE9BQVYsZ0JBQStCQyxJQUEvQixVQUF2QixFQUFtRSxNQUFuRSxFQUNKSSxJQURJLENBQ0MsVUFBQ0MsUUFBRDtBQUFBLFdBQWNBLFNBQVNDLE9BQVQsQ0FBaUIsT0FBakIsRUFBMEIsSUFBMUIsRUFBZ0NDLElBQWhDLEVBQWQ7QUFBQSxHQURELENBQVA7QUFFRCIsImZpbGUiOiJyZWFkRnJvbUZpeHR1cmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuaW1wb3J0IGZzIGZyb20gJ2ZzJ1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBub2RlIGZyb20gJ3doZW4vbm9kZSdcblxuLyoqXG4gKiByZWFkcyB0aGUgdGV4dCBjb250ZW50cyBvZiA8bmFtZT4udHh0IGluIHRoZSBmaXh0dXJlcyBmb2xkZXJcbiAqIHJlbGF0aXZlIHRvIHRoZSBjYWxsZXIgbW9kdWxlJ3MgdGVzdCBmaWxlXG4gKiBAcGFyYW0gIHtTdHJpbmd9IG5hbWUgLSB0aGUgbmFtZSBvZiB0aGUgZml4dHVyZSB5b3Ugd2FudCB0byByZWFkXG4gKiBAcmV0dXJuIHtQcm9taXNlPFN0cmluZz59IC0gdGhlIHJldHJpZXZlZCBmaXh0dXJlJ3MgZmlsZSBjb250ZW50c1xuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByZWFkRnJvbUZpeHR1cmUgKGRpcm5hbWUsIG5hbWUpIHtcbiAgcmV0dXJuIG5vZGUuY2FsbChmcy5yZWFkRmlsZSwgcGF0aC5qb2luKGRpcm5hbWUsIGBmaXh0dXJlcy8ke25hbWV9LnR4dGApLCAndXRmOCcpXG4gICAgLnRoZW4oKGNvbnRlbnRzKSA9PiBjb250ZW50cy5yZXBsYWNlKC9cXHJcXG4vZywgJ1xcbicpLnRyaW0oKSlcbn1cbiJdfQ==