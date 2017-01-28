describe 'with failures summary disabled', ->
  beforeEach ->
    @reporter = new SpecReporter(displayFailuresSummary: false)

  describe 'when summary', ->
    it 'should not report failures summary', ->
      expect(new Test(@reporter, ->
        @describe 'suite 1', =>
          @it 'spec 1', =>
            @failed()
          @describe 'suite 2', =>
            @it 'spec 2', =>
              @failed()
      ).summary).not.contains /Failures/
