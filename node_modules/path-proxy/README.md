# path-proxy

Given an group of paths (say, from an API schema), you might need to create a
set of proxy objects for interacting with those paths. This is the situation I
found myself in while working on the [Node client for the Heroku API][heroku_client].

Given a set of paths and a base constructor function, path-proxy will create a
network of logical proxy objects based on the paths and attach it to the
constructor's prototype.

## Install

```sh
npm install path-proxy --save
```

## Usage

```javascript
var pathProxy = require('path-proxy');

function ApiClient() {}

pathProxy.proxy(ApiClient, [
  "/foo",
  "/foo/{id}/bar"
]);

var client = new ApiClient();
client.foo("qux").bar();
```

This may not appear all that useful—they're mostly just empty functions—until you
start mucking around with their prototypes:

```javascript
var BarProxy = pathProxy.pathProxy(ApiClient, "/foo/{id}/bar");
BarProxy.prototype.sayHello = function () {
  console.log("hello");
};

client.foo("qux").bar().sayHello(); // Logs "hello".
```

They also have access to a few useful attributes:

```javascript
var baz = client.foo("qux").bar("baz");
baz.params;       // ["qux", "baz"]
baz.pathSegments; // ["foo", "qux", "bar", "baz"]
baz.path;         // "/foo/qux/bar/baz"
```

And can access the instance of the base constructor they're based off of:

```javascript
ApiClient.prototype.delete = function (path, callback) {
  var message = this.name + " deleted at " + path;
  callback(message);
};

var client = new ApiClient();
client.name = "Jonathan";

BarProxy.prototype.delete = function (callback) {
  this.base.delete(this.path, callback);
};

// This:
client.foo("qux").bar("baz").delete(function (message) {
  // message == "Jonathan deleted at /foo/qux/bar/baz"
});

// Is equivalent to this:
client.delete("/foo/qux/bar/baz", function (message) {
  // message == "Jonathan deleted at /foo/qux/bar/baz"
});
```

## Tests

path-proxy uses jasmine-node for tests. To run them:

```sh
$ npm install
$ npm test
```

[heroku_client]: https://github.com/heroku/node-heroku-client
