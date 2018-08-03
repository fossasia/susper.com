var inflection = require('inflection');


/* Construct a system of proxy objects based off
 * of an array of paths.
 *
 * @example:
 *   pathProxy.proxy(Client, [
 *     "/foo",
 *     "/foo/{id}/bar"
 *   ]);
 *
 * @param {Function} base A constructor to build the proxies on top of.
 * @param {Array} paths An array of paths to build a system of proxies from.
 *
 * @return {Function} The original constructor passed in as the first argument.
 */
exports.proxy = function proxy (base, paths) {
  var i;

  for (i = 0; i < paths.length; i++) {
    this.pathProxy(base, paths[i]);
  }

  return base;
}


/* Return a proxy object constructor for the the given path from the given
 * base.
 *
 * @example
 *   pathProxy.pathProxy(Client, "/apps/{id}/bar");
 *
 * @param {Function} base A constructor to build the proxy on top of.
 * @param {String} path The path to build the proxy object constructor for.
 *
 * @return {Function} A proxy object constructor for the given path. Not meant
 *  to be called immediately, but useful for attaching functions to its
 *  `prototype`.
 */
exports.pathProxy = function pathProxy (base, path) {
  var proxy = base,
      segments;

  path = path.split(/\//);
  segments = path.slice(1, path.length);

  segments.forEach(function (segment) {
    var constructor;

    segment = normalizeName(segment);

    if (proxy.prototype && proxy.prototype[segment]) {
      return proxy = proxy.prototype[segment]._constructor;
    }

    if (!segment.match(/{.*}/)) {
      constructor = function (base, params, pathSegments) {
        this.base         = base;
        this.params       = params;
        this.pathSegments = pathSegments;
        this.path         = "/" + pathSegments.join("/");
      };

      proxy.prototype[segment] = function (param) {
        var _base, params, pathSegments;

        if (this instanceof base) {
          _base = this;
        } else {
          _base = this.base;
        }

        params = this.params || [];
        if (param) params = params.concat(param)

        pathSegments = this.pathSegments || [];
        pathSegments = pathSegments.concat([segment, param]);
        pathSegments = pathSegments.filter(function (segment) { return segment });

        return new constructor(_base, params, pathSegments);
      };

      proxy.prototype[segment]._constructor = constructor;

      return proxy = constructor;
    }
  });

  return proxy;
}


function normalizeName (name) {
  name = name.toLowerCase();
  name = inflection.dasherize(name).replace(/-/g, '_');
  name = inflection.camelize(name, true);

  return name;
}
