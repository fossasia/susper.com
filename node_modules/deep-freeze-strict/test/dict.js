var test = require('tap').test;
var deepFreeze = require('../');

test('deep freeze', function (t) {
  "use strict";

  t.plan(3);

  var a = Object.create(null);
  a.x = 1;

  deepFreeze(a);
  var msg;
  try {
    a.x = 2;
  } catch (e) {
    msg = e.message;
  }
  t.ok(msg);
  t.ok(/^cannot assign to read only property/i.test(msg));
  t.equals(a.x, 1);
});
