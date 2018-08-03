# promisify-call

[![npm version](https://img.shields.io/npm/v/promisify-call.svg?style=flat-square)](https://www.npmjs.com/package/promisify-call)
[![build status](https://img.shields.io/travis/bojand/promisify-call/master.svg?style=flat-square)](https://travis-ci.org/bojand/promisify-call)

Promisify a function call so users can call a function with a callback or get a promise.
* **2.0** works only with native `Promise` so requires Node >= 4.0.
* **1.0** uses [Bluebird](www.bluebirdjs.com) and should work with older Node.js

## Installation

`npm install promisify-call`

## Usage

```js
function _uppercase(param, fn) {
  setTimeout(() => {
    return fn(null, param.toUpperCase());
  }, 50);
}

function uppercase(param, fn) {
  return promisifyCall(this, _uppercase, ...arguments);
}

// now we can call it using callback-style
uppercase('foo', (err, res) => {
  console.log(res); // FOO
});

// OR promise style
const res = await uppercase('foo');
console.log(res); // FOO
```

## API Reference

<a name="promisifyCall"></a>

### promisifyCall(ctx, fn, args) ⇒ <code>undefined</code> &#124; <code>\*</code> &#124; <code>Promise</code>
Promisifies the call to <code>fn</code> if appropriate given the arguments.
Calls the function <code>fn</code> either using callback style if last argument is a function.
If last argument is not a function, <code>fn</code> is called returning a promise.
This lets you create API that can be called in either fashions.

**Kind**: global function  
**Returns**: <code>undefined</code> &#124; <code>\*</code> &#124; <code>Promise</code> - Promise if promisified  

| Param | Type | Description |
| --- | --- | --- |
| ctx | <code>Object</code> | context / this |
| fn | <code>function</code> | The function to call |
| args | <code>arguments</code> | Arguments |

## License

Copyright 2015 Bojan D.

Licensed under the MIT License.
