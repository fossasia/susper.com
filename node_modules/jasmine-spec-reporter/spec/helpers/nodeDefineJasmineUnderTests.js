(function() {
  /**
   * Adaptation of jasmine `nodeDefineJasmineUnderTests.js` in order to test jasmine with jasmine.
   * See https://github.com/jasmine/jasmine/blob/master/CONTRIBUTING.md#self-testing
   */
  var j$Require = require('jasmine-core'),
    jasmineConsole = require('../../node_modules/jasmine-core/lib/console/console.js');

  global.getJasmineRequireObj = function () {
    return j$Require;
  };

  function extend(destination, source) {
    for (var property in source) destination[property] = source[property];
    return destination;
  }

  extend(j$Require, jasmineConsole);

  global.j$ = j$Require.core(j$Require);

  j$Require.console(j$Require, j$);
})();
