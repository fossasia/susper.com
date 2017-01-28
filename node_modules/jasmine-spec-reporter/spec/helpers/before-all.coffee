beforeAll ->
  require('./test-helper.coffee')
  addMatchers()
  global.SpecReporter = require('../../src/jasmine-spec-reporter.js')
  global.TestProcessor = require('./test-processor.js')
