# deep-freeze-strict

recursively `Object.freeze()` objects.

this fork works in strict mode, so when 
freezing a function you don't get the error:
```
> (function(){ "use strict"; deepFreeze(function(){}); })();

TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
```

# example

``` js
var deepFreeze = require('deep-freeze-strict');

deepFreeze(Buffer);
Buffer.x = 5;
console.log(Buffer.x === undefined);

Buffer.prototype.z = 3;
console.log(Buffer.prototype.z === undefined);
```

***

```
$ node example/deep.js
true
true
```

# methods

``` js
var deepFreeze = require('deep-freeze-strict')
```

## deepFreeze(obj)

Call `Object.freeze(obj)` recursively on all unfrozen properties of `obj` that
are functions or objects.

# license

public domain

Based in part on the code snippet from
[the MDN wiki page on Object.freeze()](https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Object/freeze),
which
[is released to the public domain](https://developer.mozilla.org/en-US/docs/Project:Copyrights).
