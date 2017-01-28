describe 'with display stacktrace', ->
  describe '"all" enabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displayStacktrace: 'all')

    describe 'when failed spec', ->
      it 'should display with error messages with stacktraces', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs

        expect(outputs).not.contains /passed assertion/
        expect(outputs).contains [
          '    ✗ failed spec'
          '      - Expected true to be false.'
          /at Object\.<anonymous>/
          ''
        ]


    describe 'when summary', ->
      it 'should report failures summary with stacktraces', ->
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @it 'spec 1', =>
              @expect(true).toBe false
            @describe 'suite 2', =>
              @it 'spec 2', =>
                @expect(2).toBe 1
        ).summary).contains [
          /.*/
          /Failures/
          /.*/
          ''
          '1) suite 1 spec 1'
          '  - Expected true to be false.'
          /at Object\.<anonymous>/
          ''
          '2) suite 1 suite 2 spec 2'
          '  - Expected 2 to be 1.'
          /at Object\.<anonymous>/
          ''
        ]


  describe '"specs" enabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displayStacktrace: 'specs')

    describe 'when failed spec', ->
      it 'should display with error messages with stacktraces', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs

        expect(outputs).not.contains /passed assertion/
        expect(outputs).contains [
          '    ✗ failed spec'
          '      - Expected true to be false.'
          /at Object\.<anonymous>/
          ''
        ]


    describe 'when summary', ->
      it 'should not report stacktraces in failures summary', ->
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @it 'spec 1', =>
              @expect(true).toBe false
            @describe 'suite 2', =>
              @it 'spec 2', =>
                @expect(2).toBe 1
        ).summary).contains [
          /.*/
          /Failures/
          /.*/
          ''
          '1) suite 1 spec 1'
          '  - Expected true to be false.'
          ''
          '2) suite 1 suite 2 spec 2'
          '  - Expected 2 to be 1.'
          ''
        ]


  describe '"summary" enabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displayStacktrace: 'summary')

    describe 'when failed spec', ->
      it 'should not display stacktraces with error messages', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs

        expect(outputs).not.contains /passed assertion/
        expect(outputs).contains [
          '    ✗ failed spec'
          '      - Expected true to be false.'
          ''
        ]


    describe 'when summary', ->
      it 'should report failures summary with stacktraces', ->
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @it 'spec 1', =>
              @expect(true).toBe false
            @describe 'suite 2', =>
              @it 'spec 2', =>
                @expect(2).toBe 1
        ).summary).contains [
          /.*/
          /Failures/
          /.*/
          ''
          '1) suite 1 spec 1'
          '  - Expected true to be false.'
          /at Object\.<anonymous>/
          ''
          '2) suite 1 suite 2 spec 2'
          '  - Expected 2 to be 1.'
          /at Object\.<anonymous>/
          ''
        ]


  describe '"none" enabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displayStacktrace: 'none')

    describe 'when failed spec', ->
      it 'should not display stacktraces with error messages', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs

        expect(outputs).not.contains /passed assertion/
        expect(outputs).contains [
          '    ✗ failed spec'
          '      - Expected true to be false.'
          ''
        ]


    describe 'when summary', ->
      it 'should not report stacktraces in failures summary', ->
        expect(new Test(@reporter, ->
          @describe 'suite 1', =>
            @it 'spec 1', =>
              @expect(true).toBe false
            @describe 'suite 2', =>
              @it 'spec 2', =>
                @expect(2).toBe 1
        ).summary).contains [
          /.*/
          /Failures/
          /.*/
          ''
          '1) suite 1 spec 1'
          '  - Expected true to be false.'
          ''
          '2) suite 1 suite 2 spec 2'
          '  - Expected 2 to be 1.'
          ''
        ]
