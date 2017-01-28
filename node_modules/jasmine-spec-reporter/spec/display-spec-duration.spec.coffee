describe 'with spec duration enabled', ->
  beforeEach ->
    @reporter = new SpecReporter(displaySpecDuration: true)

  describe 'when spec', ->
    it 'should report success', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @it 'successful spec', =>
            @passed()
      ).outputs)
      .contains /✓ successful spec \({time}\)/


    it 'should report failure', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @it 'failed spec', =>
            @failed()
      ).outputs)
      .contains /✗ failed spec \({time}\)/
