describe 'with failed spec disabled', ->
  beforeEach ->
    @reporter = new SpecReporter(displayFailedSpec: false)

  describe 'when spec', ->
    it 'should not report failed', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @it 'failed spec', =>
            @failed()
      ).outputs)
      .not.contains /failed spec/


  describe 'when suite', ->
    it 'should not display fully failed suite', ->
      expect(new Test(@reporter, ->
        @describe 'failed suite', =>
          @it 'spec 1', =>
            @failed()
          @it 'spec 2', =>
            @failed()
      ).outputs).not.contains /failed suite/


    it 'should display not fully failed suite', ->
      outputs = new Test(@reporter, ->
        @describe 'failed suite', =>
          @it 'successful spec', =>
            @passed()
          @it 'failed spec', =>
            @failed()
      ).outputs

      expect(outputs).contains /failed suite/
      expect(outputs).contains /successful spec/
      expect(outputs).not.contains /failed spec/
