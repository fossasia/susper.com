describe 'with suite number enabled', ->
  beforeEach ->
    @reporter = new SpecReporter(displaySuiteNumber: true)

  describe 'when single suite', ->
    it 'should add suite number', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @it 'successful spec', =>
            @passed()
      ).outputs)
      .contains /1 suite/


  describe 'when multiple suite', ->
    it 'should add suite number', ->
      outputs = new Test(@reporter, ->
        @describe 'first suite', =>
          @it 'successful spec', =>
            @passed()
        @describe 'second suite', =>
          @it 'successful spec', =>
            @passed()
        @describe 'third suite', =>
          @it 'successful spec', =>
            @passed()
      ).outputs
      expect(outputs).contains /1 first suite/
      expect(outputs).contains /2 second suite/
      expect(outputs).contains /3 third suite/


  describe 'when multiple nested suite', ->
    it 'should add suite number', ->
      outputs = new Test(@reporter, ->
        @describe 'first suite', =>
          @describe 'first child suite', =>
            @describe 'first grandchild suite', =>
              @it 'successful spec', =>
                @passed()
            @describe 'second grandchild suite', =>
              @it 'successful spec', =>
                @passed()
          @describe 'second child suite', =>
            @it 'successful spec', =>
              @passed()
      ).outputs
      expect(outputs).contains /1 first suite/
      expect(outputs).contains /1.1 first child suite/
      expect(outputs).contains /1.1.1 first grandchild suite/
      expect(outputs).contains /1.1.2 second grandchild suite/
      expect(outputs).contains /1.2 second child suite/
