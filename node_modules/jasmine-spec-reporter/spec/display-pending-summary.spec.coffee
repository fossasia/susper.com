describe 'with pending summary disabled', ->
  beforeEach ->
    @reporter = new SpecReporter(displayPendingSummary: false)

  describe 'when summary', ->
    it 'should not report pending summary', ->
      expect(new Test(@reporter, ->
        @describe 'suite 1', =>
          @xit 'spec 1', =>
            @failed()
          @describe 'suite 2', =>
            @it 'spec 2', =>
              @pending()
      ).summary).not.contains /Pending/
