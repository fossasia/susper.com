'use strict';
module.exports = function (fn, opts) {
	opts = opts || {};

	var cacheKey = opts.cacheKey || function (x) {
		if (arguments.length === 1 && (x === null || x === undefined || (typeof x !== 'function' && typeof x !== 'object'))) {
			return x;
		}

		return JSON.stringify(arguments);
	};

	var memoized = function () {
		var cache = memoized.__cache__;
		var key = cacheKey.apply(null, arguments);

		if (cache.has(key)) {
			var c = cache.get(key);

			if (typeof opts.maxAge !== 'number' || Date.now() < c.maxAge) {
				return c.data;
			}
		}

		var ret = fn.apply(null, arguments);

		cache.set(key, {
			data: ret,
			maxAge: Date.now() + (opts.maxAge || 0)
		});

		return ret;
	};

	memoized.displayName = fn.displayName || fn.name;
	memoized.__cache__ = opts.cache || new Map();

	return memoized;
};
