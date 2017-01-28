# Changelog for jasminewd2

# 0.0.10

- ([ff2e624](https://github.com/angular/jasminewd/commit/ff2e624159344cd83b04c6a6648334ba12e78ea6))
  fix(webdriver): Pass in the control flow.

  BREAKING CHANGE: The control flow now needs to be passed in when using jasminewd. This fixes
  an issue where having multiple versions of selenium-webdriver in a package's dependency tree would
  result in jasminewd and protractor using different control flows. You now have to initialize
  jasminewd before you can use it, like so: `require('jasminewd2').init(webdriver.promise.controlFlow());`

  See https://github.com/angular/protractor/issues/3505

- ([db26b1a](https://github.com/angular/jasminewd/commit/db26b1a1e66477a6f526dac56ecaaa50d2cf4700))
  fix(stacktrace): do not crash if beforeEach block is rejected without any stated reason (#45)

# 0.0.9

- ([790c81e](https://github.com/angular/protractor/commit/790c81eb0aba880fffbdcb4e834eb2161141620c))
  fix(expectations): allow custom matchers to return a promise when actual is not a promise

  See angular/protractor#2964


# 0.0.8

- ([5abc745](https://github.com/angular/protractor/commit/5abc7457cd73a4a4ba70b3c9ceeadac6d42bbd76))
  chore(jasmine): update MatchFactory to allow message as function

- ([750898c](https://github.com/angular/protractor/commit/750898c90a1cc1bef09384b60ef6e15adfe734f7))
  fix(expectation): expectations without promises no longer add to task queue

  Instead, expectations without promises in either expected or actual are unchanged from the
  original Jasmine implementation.

  See https://github.com/angular/protractor/issues/2894

# 0.0.7

- ([55fd11e](https://github.com/angular/protractor/commit/55fd11e69c2f1ba8fba9a19a8acccbe933896084))
  fix(index): forward it's return value

- ([f4c30a0](https://github.com/angular/protractor/commit/f4c30a0023c6ec33b15df762226c3fe8e741d26e))
  fix: allow empty it functions

# 0.0.6

- ([4776c16](https://github.com/angular/jasminewd/commit/4776c16b9a9f3a9a3de8a8dddc0e051cb32331b4))
  chore(selenium-webdriver): update selenium webdriver to 2.47.0

  Update selenium-webdriver to 2.47.0 from 2.45.1. This update introduces a convoluted situation
  where some tests in Proractor's suite would hang - see
  https://github.com/angular/protractor/issues/2245

  This change includes a fix for those issues which removes the explicit
  `flow.execute` wrapper around `expect` calls. This appears not to introduce any issues to existing
  tests.

# 0.0.5

- ([037c7de](https://github.com/angular/jasminewd/commit/037c7de7fea4de068734b6fa250d145800863633))
  chore(dependencies): update Jasmine to 2.3.1

# 0.0.4

- ([8f8b8b3](https://github.com/angular/jasminewd/commit/8f8b8b39e779559fd3b29b138d7577658b8a64b7))
  tests(context): test that the `this` variable points to the right thing

  Note: this means that using `this.addMatchers` no longer works inside before blocks or specs. It
  should have been changed to `jamsine.addMatchers` since the upgrade to Jasmine 2. It was still
  working by accident up until the previous commit.

- ([c0f13d2](https://github.com/angular/jasminewd/commit/c0f13d254966c859db22d020a5390138dbf48e64))
  refactor(asyncTestFn): refactor async test wrapping to show more info

  Test wrapping for Jasmine 2 now more closely follows the test wrapping for Mocha at
  https://github.com/SeleniumHQ/selenium/blob/master/javascript/node/selenium-webdriver/testing/index.js

  This also adds more information to the task names in the control flow, for easier debugging.

# 0.0.3

- ([161e1fa](https://github.com/angular/jasminewd/commit/161e1fa48deaa5ea0f485027ea8ae41562864936))
  fix(errors): update webdriverjs, fix asynchronous error output

  Add some console logging, remove useless info about the last running task in the control flow, and
  fix error where problems reported from done.fail were getting pushed into the following spec.

  Closes #18

- ([fdb03a3](https://github.com/angular/jasminewd/commit/fdb03a388d4846952c09fb0ad75a37b46674c750))
  docs(readme): add note about jasmine 1 vs jasmine 2

- ([acaec8b](https://github.com/angular/jasminewd/commit/acaec8bdd157e9933d608c66204a52335fb46ee4))
  feat(index): add jasmine2.0 support
