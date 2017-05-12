describe 'with spec result prefixes', ->
  describe 'set to empty strings', ->
    beforeEach ->
      @reporter = new SpecReporter(displayPendingSpec: true, prefixes: {success: '', failure: '', pending: ''})

    describe 'when spec', ->
      it 'should report success', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'successful spec', =>
              @passed()
        ).outputs)
        .not.contains /✓/


      it 'should report failure', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs)
        .not.contains /✗/


      it 'should report pending', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @xit 'pending spec', =>
        ).outputs)
        .not.contains /\*/


  describe 'set to valid strings', ->
    beforeEach ->
      @reporter = new SpecReporter({displayPendingSpec: true, prefixes: {success: 'Pass ', failure: 'Fail ', pending: 'Pend '}})

    describe 'when spec', ->
      it 'should report success', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'successful spec', =>
              @passed()
        ).outputs

        expect(outputs).not.contains /✓/
        expect(outputs).contains /Pass /


      it 'should report failure', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        ).outputs

        expect(outputs).not.contains /✗/
        expect(outputs).contains /Fail /


      it 'should report pending', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @xit 'pending spec', =>
        ).outputs

        expect(outputs).not.contains /\*/
        expect(outputs).contains /Pend /
