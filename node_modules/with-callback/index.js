"use strict";


function withCallback(args, closure, value_mapper) {
  return new Promise(function(resolve, reject) {
    if (Array.isArray(args)) {
      args = args.slice();
    }
    else {
      value_mapper = closure;
      closure = args;
      args = null;
    }

    function cb(err, value) {
      if (err) {
        reject(err);
        return;
      }

      if (!value_mapper) {
        resolve(value);
        return;
      }

      try {
        resolve(value_mapper.apply(undefined, Array.prototype.slice.call(arguments, 1)));
      }
      catch (e) {
        reject(e);
      }
    }

    if (args) {
      args.push(cb);
      closure.apply(undefined, args);
    }
    else {
      closure(cb);
    }
  });
}


exports = withCallback;
exports.default = exports;
module.exports = exports;
Object.defineProperty(exports, '__esModule', { value: true });
