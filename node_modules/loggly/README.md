# node-loggly

[![Version npm](https://img.shields.io/npm/v/loggly.svg?style=flat-square)](https://www.npmjs.com/package/loggly)[![npm Downloads](https://img.shields.io/npm/dm/loggly.svg?style=flat-square)](https://www.npmjs.com/package/loggly)[![Build Status](https://img.shields.io/travis/winstonjs/node-loggly/master.svg?style=flat-square)](https://travis-ci.org/winstonjs/node-loggly)[![Dependencies](https://img.shields.io/david/winstonjs/node-loggly.svg?style=flat-square)](https://david-dm.org/winstonjs/node-loggly)

[![NPM](https://nodei.co/npm/loggly.png?downloads=true&downloadRank=true)](https://nodei.co/npm/loggly/)

A client implementation for Loggly in node.js. Check out Loggly's [Node logging documentation](https://www.loggly.com/docs/nodejs-logs/) for more.

## Usage

The `node-loggly` library is compliant with the [Loggly API][api]. Using `node-loggly` is easy for a variety of scenarios: logging, working with devices and inputs, searching, and facet searching.

### Getting Started
Before we can do anything with Loggly, we have to create a client with valid credentials. We will authenticate for you automatically:

``` js
  var loggly = require('loggly');

  var client = loggly.createClient({
    token: "your-really-long-input-token",
    subdomain: "your-subdomain",
    auth: {
      username: "your-username",
      password: "your-password"
    },
    //
    // Optional: Tag to send with EVERY log message
    //
    tags: ['global-tag']
  });
```

### Logging
There are two ways to send log information to Loggly via node-loggly. The first is to simply call client.log with an appropriate input token:

``` js
  client.log('127.0.0.1 - Theres no place like home', function (err, result) {
    // Do something once you've logged
  });
```

Note that the callback in the above example is optional, if you prefer the 'fire and forget' method of logging:

``` js
  client.log('127.0.0.1 - Theres no place like home');
```

### Logging with Tags

If you're using Loggly's [tags](https://www.loggly.com/docs/tags/) functionality, simply include an array of tags as the second argument to the `log` method:

``` js
  client.log('127.0.0.1 - Theres no place like home', [ 'dorothy' ], function (err, result) {
    // Do something once you've logged
  });
```

*note* Tags passed into the log function will be merged with any global tags you may have defined.


### Logging Shallow JSON Objects as a String
In addition to logging pure strings it is also possible to pass shallow JSON object literals (i.e. no nested objects) to client.log(..) or input.log(..) methods, which will get converted into the [Loggly recommended string representation][sending-data]. So

``` js
  var source = {
    foo: 1,
    bar: 2,
    buzz: 3
  };

  input.log(source);
```

will be logged as:

```
  foo=1,bar=2,buzz=3
```

### Logging JSON Objects
It is also possible to log complex objects using the new JSON capabilities of Loggly. To enable JSON functionality in the client simply add 'json: true' to the configuration:

``` js
  var config = {
    subdomain: "your-subdomain",
    auth: {
      username: "your-username",
      password: "your-password"
    },
    json: true
  };
```

When the json flag is enabled, objects will be converted to JSON using JSON.stringify before being transmitted to Loggly. So

``` js
  var source = {
    foo: 1,
    bar: 2,
    buzz: {
      sheep: 'jumped',
      times: 10
    }
  };

  input.log(source);
```

will be logged as:

``` json
  { "foo": 1, "bar": 2, "buzz": {"sheep": "jumped", "times": 10 }}
```

### Logging arrays
It is possible to send arrays, which will result in one single request to Loggly.

``` js
  input.log([ {iam:'number 1'}, {iam:'number 2'} ])
```

### Searching
[Searching][search-api] with node-loggly is easy. All you have to do is use the search() method defined on each Loggly client:

``` js
  var util = require('util');

  client.search('404', function (err, results) {
    // Inspect the result set
    console.dir(results.events);
  });
```

The search() method can also take an Object parameter that allows you to set additional search parameters such as: rows, from, until, etc.

``` js
  var util = require('util');

  client.search({ query: '404', rows: 10 })
    .run(function (err, results) {
      // Inspect the result set
      console.dir(results.events);
    });
```

See the [Loggly search guide][search] for more details on how to effectively search through your Loggly logs.

## Installation

### Installing npm (node package manager)
``` bash
  $ curl http://npmjs.org/install.sh | sh
```

### Installing node-loggly
``` bash
  $ npm install loggly
```

## Run Tests
All of the node-loggly tests are written in [vows][vows], and cover all of the use cases described above. You will need to add your Loggly username, password, subdomain, and a two test inputs to test/data/test-config.json before running tests. When configuring the test inputs on Loggly, the first test input should be named 'test' using the HTTP service. The second input should be name 'test_json' using the HTTP service with the JSON logging option enabled:

``` js
  {
    "token": "your-really-long-token-you-got-when-you-created-an-http-input",
    "subdomain": "your-subdomain",
    "auth": {
      "username": "your-username",
      "password": "your-password"
    }
  }
```

Once you have valid Loggly credentials you can run tests with [vows][vows]:

``` bash
  $ npm test
```

#### Author: [Charlie Robbins](http://www.github.com/indexzero)
#### Contributors: [Marak Squires](http://github.com/marak), [hij1nx](http://github.com/hij1nx), [Kord Campbell](http://loggly.com), [Erik Hedenström](http://github.com/ehedenst),

[api]: http://www.loggly.com/docs/api-overview/
[sending-data]: http://www.loggly.com/docs/api-sending-data/
[search-api]: http://www.loggly.com/docs/api-retrieving-data/
[search]: http://www.loggly.com/docs/search-overview/
[vows]: http://vowsjs.org
