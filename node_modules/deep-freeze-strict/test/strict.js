var test = require('tap').test;
var deepFreeze = require('../');

test('deep freeze', function (t) {
  "use strict";

  t.plan(2);

  var a = {
    // a function
      b: function() {},
  };

  deepFreeze(a);
  try {
    a.x = 5;
  } catch (e) {
    t.ok('error thrown as expected');
  }
  t.equal(a.x, undefined);
});