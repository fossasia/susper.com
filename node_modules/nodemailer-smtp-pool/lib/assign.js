'use strict';

module.exports = assign;

/**
 * Copies properties from source objects to target objects
 */
function assign( /* target, ... sources */ ) {
    var args = Array.prototype.slice.call(arguments);
    var target = args.shift() || {};

    args.forEach(function (source) {
        Object.keys(source || {}).forEach(function (key) {
            if (['tls', 'auth'].indexOf(key) >= 0 && source[key] && typeof source[key] === 'object') {
                // tls and auth are special keys that need to be enumerated separately
                // other objects are passed as is
                if (!target[key]) {
                    // esnure that target has this key
                    target[key] = {};
                }
                Object.keys(source[key]).forEach(function (subKey) {
                    target[key][subKey] = source[key][subKey];
                });
            } else {
                target[key] = source[key];
            }
        });
    });
    return target;
}
