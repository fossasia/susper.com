describe 'with colors', ->
  describe 'default', ->
    beforeEach ->
      @reporter = new SpecReporter(displayPendingSpec: true)

    describe 'when spec', ->
      it 'should report success', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'successful spec', =>
              @passed()
        , true).outputs
        expect(outputs).not.contains '    ✓ successful spec'
        expect(outputs).contains '    ' + '✓ successful spec'.green


      it 'should report failure', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        , true).outputs
        expect(outputs).not.contains '    ✗ failed spec'
        expect(outputs).contains '    ' + '✗ failed spec'.red


      it 'should not report pending', ->
        outputs = new Test(@reporter, ->
          @describe 'suite', =>
            @xit 'pending spec', =>
        , true).outputs
        expect(outputs).not.contains '    * pending spec'
        expect(outputs).contains '    ' + '* pending spec'.yellow


  describe 'custom', ->
    beforeEach ->
      @reporter = new SpecReporter(displayPendingSpec: true, colors: {
        success: 'magenta',
        failure: 'white',
        pending: 'blue'
      })

    describe 'when spec', ->
      it 'should report success', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'successful spec', =>
              @passed()
        , true).outputs)
        .contains '    ' + '✓ successful spec'.magenta


      it 'should report failure', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        , true).outputs)
        .contains '    ' + '✗ failed spec'.white


      it 'should not report pending', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @xit 'pending spec', =>
        , true).outputs)
        .contains '    ' + '* pending spec'.blue


  describe 'disabled', ->
    beforeEach ->
      @reporter = new SpecReporter(displayPendingSpec: true, colors: false)

    describe 'when spec', ->
      it 'should report success', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'successful spec', =>
              @passed()
        , true).outputs)
        .contains '    ✓ successful spec'


      it 'should report failure', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @it 'failed spec', =>
              @failed()
        , true).outputs)
        .contains '    ✗ failed spec'


      it 'should not report pending', ->
        expect(new Test(@reporter, ->
          @describe 'suite', =>
            @xit 'pending spec', =>
        , true).outputs)
        .contains '    * pending spec'
