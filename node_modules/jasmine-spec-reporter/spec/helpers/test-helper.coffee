require('colors')

String.prototype.__defineGetter__ 'stripTime', ->
  this.replace /in (\d+\.?\d*|\.\d+) secs?/, 'in {time}' # replace time in summary
      .replace /\((\d+\.?\d*|\.\d+) secs?\)/, '({time})' # replace time in specs

typeIsArray = Array.isArray || ( value ) -> return {}.toString.call( value ) is '[object Array]'

equalOrMatch = (actual, expected) ->
  expected == actual || (expected.test && expected.test(actual))

addMatchers = ->
  beforeEach ->
    jasmine.addMatchers
      contains: ->
        compare: (actual, sequence) ->
          sequence = [sequence] unless typeIsArray sequence
          i = 0
          while i < actual.length - sequence.length + 1
            j = 0
            while j < sequence.length && equalOrMatch(actual[i + j], sequence[j])
              j++
            return pass: true if j == sequence.length
            i++
          pass: false

class Test
  constructor: (@reporter, @testFn, withColor = false) ->
    @init(withColor)
    @run()

  init: (withColor) ->
    @outputs = []
    @summary = []
    logInSummary = false
    console.log = (stuff) =>
      unless withColor
        stuff = stuff.stripColors.stripTime
      logInSummary = true if /^(Executed|\*\*\*\*\*\*\*)/.test stuff

      unless logInSummary
        @outputs.push stuff
      else
        @summary.push stuff

  run: ->
    env = new j$.Env()
    env.passed = ->
      env.expect(true).toBe(true)
    env.failed = ->
      env.expect(true).toBe(false)

    @testFn.apply(env)
    env.addReporter(@reporter)
    env.execute()

global.Test = Test
global.addMatchers = addMatchers
