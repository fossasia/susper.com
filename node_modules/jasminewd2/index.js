/**
 * Adapts Jasmine-Node tests to work better with WebDriverJS. Borrows
 * heavily from the mocha WebDriverJS adapter at
 * https://code.google.com/p/selenium/source/browse/javascript/node/selenium-webdriver/testing/index.js
 */

var webdriver = require('selenium-webdriver');

/**
 * Wraps a function so that all passed arguments are ignored.
 * @param {!Function} fn The function to wrap.
 * @return {!Function} The wrapped function.
 */
function seal(fn) {
  return function() {
    fn();
  };
}

/**
 * Validates that the parameter is a function.
 * @param {Object} functionToValidate The function to validate.
 * @throws {Error}
 * @return {Object} The original parameter.
 */
function validateFunction(functionToValidate) {
  if (functionToValidate && Object.prototype.toString.call(functionToValidate) === '[object Function]') {
    return functionToValidate;
  } else {
    throw Error(functionToValidate + ' is not a function');
  }
}

/**
 * Validates that the parameter is a number.
 * @param {Object} numberToValidate The number to validate.
 * @throws {Error}
 * @return {Object} The original number.
 */
function validateNumber(numberToValidate) {
  if (!isNaN(numberToValidate)) {
    return numberToValidate;
  } else {
    throw Error(numberToValidate + ' is not a number');
  }
}

/**
 * Validates that the parameter is a string.
 * @param {Object} stringToValidate The string to validate.
 * @throws {Error}
 * @return {Object} The original string.
 */
function validateString(stringtoValidate) {
  if (typeof stringtoValidate == 'string' || stringtoValidate instanceof String) {
    return stringtoValidate;
  } else {
    throw Error(stringtoValidate + ' is not a string');
  }
}

/**
 * Wraps a function so it runs inside a webdriver.promise.ControlFlow and
 * waits for the flow to complete before continuing.
 * @param {!Function} globalFn The function to wrap.
 * @return {!Function} The new function.
 */
function wrapInControlFlow(flow, globalFn, fnName) {
  return function() {
    var driverError = new Error();
    driverError.stack = driverError.stack.replace(/ +at.+jasminewd.+\n/, '');

    function asyncTestFn(fn, description) {
      description = description ? ('("' + description + '")') : '';
      return function(done) {
        var async = fn.length > 0;
        testFn = fn.bind(this);

        flow.execute(function controlFlowExecute() {
          return new webdriver.promise.Promise(function(fulfill, reject) {
            if (async) {
              // If testFn is async (it expects a done callback), resolve the promise of this
              // test whenever that callback says to.  Any promises returned from testFn are
              // ignored.
              var proxyDone = fulfill;
              proxyDone.fail = function(err) {
                var wrappedErr = new Error(err);
                reject(wrappedErr);
              };
              testFn(proxyDone);
            } else {
              // Without a callback, testFn can return a promise, or it will
              // be assumed to have completed synchronously.
              fulfill(testFn());
            }
          }, flow);
        }, 'Run ' + fnName + description + ' in control flow').then(seal(done), function(err) {
          if (!err) {
            err = new Error('Unknown Error');
            err.stack = '';
          }
          err.stack = err.stack + '\nFrom asynchronous test: \n' + driverError.stack;
          done.fail(err);
        });
      };
    }

    var description, func, timeout;
    switch (fnName) {
      case 'it':
      case 'fit':
        description = validateString(arguments[0]);
        if (!arguments[1]) {
          return globalFn(description);
        }
        func = validateFunction(arguments[1]);
        if (!arguments[2]) {
          return globalFn(description, asyncTestFn(func, description));
        } else {
          timeout = validateNumber(arguments[2]);
          return globalFn(description, asyncTestFn(func, description), timeout);
        }
        break;
      case 'beforeEach':
      case 'afterEach':
      case 'beforeAll':
      case 'afterAll':
        func = validateFunction(arguments[0]);
        if (!arguments[1]) {
          globalFn(asyncTestFn(func));
        } else {
          timeout = validateNumber(arguments[1]);
          globalFn(asyncTestFn(func), timeout);
        }
        break;
      default:
        throw Error('invalid function: ' + fnName);
    }
  };
}

/**
 * Initialize the JasmineWd adapter with a particlar webdriver instance. We
 * pass webdriver here instead of using require() in order to ensure Protractor
 * and Jasminews are using the same webdriver instance.
 * @param {Object} flow. The ControlFlow to wrap tests in.
 */
function initJasmineWd(flow) {
  if (jasmine.JasmineWdInitialized) {
    throw Error('JasmineWd already initialized when init() was called');
  }
  jasmine.JasmineWdInitialized = true;

  global.it = wrapInControlFlow(flow, global.it, 'it');
  global.fit = wrapInControlFlow(flow, global.fit, 'fit');
  global.beforeEach = wrapInControlFlow(flow, global.beforeEach, 'beforeEach');
  global.afterEach = wrapInControlFlow(flow, global.afterEach, 'afterEach');
  global.beforeAll = wrapInControlFlow(flow, global.beforeAll, 'beforeAll');
  global.afterAll = wrapInControlFlow(flow, global.afterAll, 'afterAll');

  // On timeout, the flow should be reset. This will prevent webdriver tasks
  // from overflowing into the next test and causing it to fail or timeout
  // as well. This is done in the reporter instead of an afterEach block
  // to ensure that it runs after any afterEach() blocks with webdriver tasks
  // get to complete first.
  jasmine.getEnv().addReporter(new OnTimeoutReporter(function() {
    console.warn('A Jasmine spec timed out. Resetting the WebDriver Control Flow.');
    flow.reset();
  }));
}

var originalExpect = global.expect;
global.expect = function(actual) {
  if (actual instanceof webdriver.WebElement) {
    throw Error('expect called with WebElement argument, expected a Promise. ' +
        'Did you mean to use .getText()?');
  }
  return originalExpect(actual);
};

/**
 * Creates a matcher wrapper that resolves any promises given for actual and
 * expected values, as well as the `pass` property of the result.
 */
jasmine.Expectation.prototype.wrapCompare = function(name, matcherFactory) {
  return function() {
    var expected = Array.prototype.slice.call(arguments, 0),
      expectation = this,
      matchError = new Error("Failed expectation");

    matchError.stack = matchError.stack.replace(/ +at.+jasminewd.+\n/, '');

    if (!webdriver.promise.isPromise(expectation.actual) &&
        !webdriver.promise.isPromise(expected)) {
      compare(expectation.actual, expected);
    } else {
      webdriver.promise.when(expectation.actual).then(function(actual) {
        return webdriver.promise.all(expected).then(function(expected) {
          return compare(actual, expected);
        });
      });
    }

    function compare(actual, expected) {
      var args = expected.slice(0);
      args.unshift(actual);

      var matcher = matcherFactory(expectation.util, expectation.customEqualityTesters);
      var matcherCompare = matcher.compare;

      if (expectation.isNot) {
        matcherCompare = matcher.negativeCompare || defaultNegativeCompare;
      }

      var result = matcherCompare.apply(null, args);

      if (webdriver.promise.isPromise(result.pass)) {
       return webdriver.promise.when(result.pass).then(compareDone);
      } else {
       return compareDone(result.pass);
      }

      function compareDone(pass) {
       var message = '';

       if (!pass) {
        if (!result.message) {
         args.unshift(expectation.isNot);
         args.unshift(name);
         message = expectation.util.buildFailureMessage.apply(null, args);
        } else {
         if (Object.prototype.toString.apply(result.message) === '[object Function]') {
          message = result.message();
         } else {
          message = result.message;
         }
        }
       }

       if (expected.length == 1) {
        expected = expected[0];
       }
       var res = {
        matcherName: name,
        passed: pass,
        message: message,
        actual: actual,
        expected: expected,
        error: matchError
       };
       expectation.addExpectationResult(pass, res);
      }

      function defaultNegativeCompare() {
        var result = matcher.compare.apply(null, args);
        if (webdriver.promise.isPromise(result.pass)) {
          result.pass = result.pass.then(function(pass) {
            return !pass;
          });
        } else {
          result.pass = !result.pass;
        }
        return result;
      }
    }
  };
};

// Re-add core matchers so they are wrapped.
jasmine.Expectation.addCoreMatchers(jasmine.matchers);

/**
 * A Jasmine reporter which does nothing but execute the input function
 * on a timeout failure.
 */
var OnTimeoutReporter = function(fn) {
  this.callback = fn;
};

OnTimeoutReporter.prototype.specDone = function(result) {
  if (result.status === 'failed') {
    for (var i = 0; i < result.failedExpectations.length; i++) {
      var failureMessage = result.failedExpectations[i].message;

      if (failureMessage.match(/Timeout/)) {
        this.callback();
      }
    }
  }
};

module.exports.init = initJasmineWd;
