# mem [![Build Status](https://travis-ci.org/sindresorhus/mem.svg?branch=master)](https://travis-ci.org/sindresorhus/mem)

> [Memoize](https://en.wikipedia.org/wiki/Memoization) functions - An optimization used to speed up consecutive function calls by caching the result of calls with identical input

Requires at least Node.js 0.12, unless you provide your own `cache` store.


## Install

```
$ npm install --save mem
```


## Usage

```js
const mem = require('mem');

let i = 0;
const counter = () => ++i;
const memoized = mem(counter);

memoized('foo');
//=> 1

// cached as it's the same arguments
memoized('foo');
//=> 1

// not cached anymore as the arguments changed
memoized('bar');
//=> 2

memoized('bar');
//=> 2
```

##### Works fine with promise returning functions

```js
const mem = require('mem');

let i = 0;
const counter = () => Promise.resolve(++i);
const memoized = mem(counter);

memoized().then(a => {
	console.log(a);
	//=> 1

	memoized().then(b => {
		// the return value didn't increase as it's cached
		console.log(b);
		//=> 1
	});
});
```

```js
const mem = require('mem');
const got = require('got');
const memGot = mem(got, {maxAge: 1000});

memGot('sindresorhus.com').then(() => {
	// this call is cached
	memGot('sindresorhus.com').then(() => {
		setTimeout(() => {
			// this call is not cached as the cache has expired
			memGot('sindresorhus.com').then(() => {});
		}, 2000);
	});
});
```


## API

### mem(input, [options])

#### input

Type: `function`

Function to be memoized.

#### options

##### maxAge

Type: `number`  
Default: `Infinity`

Milliseconds until the cache expires.

##### cacheKey

Type: `function`  

Determines the cache key for storing the result based on the function arguments. By default, if there's only one argument and it's a [primitive](https://developer.mozilla.org/en-US/docs/Glossary/Primitive) it's used directly as a key, otherwise it's all the function arguments JSON stringified as an array.

You could for example change it to only cache on the first argument `x => JSON.stringify(x)`.

##### cache

Type: `object`  
Default: `new Map()`

Use a different cache storage. Must implement the following methods: `.has(key)`, `.get(key)`, `.set(key, value)`. You could for example use a `WeakMap` instead.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
