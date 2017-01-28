describe 'with successful spec disabled', ->
  beforeEach ->
    @reporter = new SpecReporter(displaySuccessfulSpec: false)

  describe 'when spec', ->
    it 'should not report success', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @it 'successful spec', =>
            @passed()
      ).outputs)
      .not.contains /successful spec/


  describe 'when suite', ->
    it 'should not display fully successful suite', ->
      outputs = new Test(@reporter, ->
        @describe 'suite', =>
          @it 'spec 1', =>
            @passed()
          @it 'spec 2', =>
            @passed()
      ).outputs

      expect(outputs).not.contains /suite/


    it 'should display failed suite', ->
      outputs = new Test(@reporter, ->
        @describe 'suite', =>
          @it 'failed spec', =>
            @failed()
          @it 'successful spec', =>
            @passed()
      ).outputs

      expect(outputs).contains /suite/
      expect(outputs).contains /failed spec/
      expect(outputs).not.contains /successful spec/
