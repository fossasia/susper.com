# with-callback

A small helper function to bridge the gap when returning a promise from a function that takes a callback


Note that this module will not introduce any custom Promise implementation.
It will use the global `Promise` (requires node >= v4).


```js
import withCallback from 'with-callback';
// or const withCallback = require('with-callback');


// withCallback returns a promise and invokes the function with a callback
// used to fulfill the promise
function readFile(name) {
  return withCallback(callback => fs.readFile(name, callback));
}


// arguments can also be passed as an array
function readFile(name) {
  return withCallback([name], fs.readFile);
}


// A second function can be passed to withCallback to map all arguments
// passed to the callback to a single value used to resolve the promise.
function example(callback) {
  callback(null, 'a', 'b');
}
const promise = withCallback(example, (a, b) => [a, b]);
// promise resolves with ['a', 'b']
```
