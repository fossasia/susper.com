describe 'with pending spec enabled', ->
  beforeEach ->
    @reporter = new SpecReporter(displayPendingSpec: true)

  describe 'when spec', ->
    it 'should report pending', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @xit 'pending spec', =>
      ).outputs)
      .contains /\* pending spec/
