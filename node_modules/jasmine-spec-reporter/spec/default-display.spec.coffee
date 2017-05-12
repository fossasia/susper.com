describe 'with default display', ->
  beforeEach ->
    @reporter = new SpecReporter()

  describe 'when jasmine started', ->
    it 'should report start', ->
      expect(new Test(@reporter, ->
        # no spec needed
      ).outputs)
      .contains /Spec started/


  describe 'when spec', ->
    it 'should report success', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @it 'successful spec', =>
            @passed()
      ).outputs)
      .contains /✓ successful spec/


    it 'should report failure', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @it 'failed spec', =>
            @failed()
      ).outputs)
      .contains /✗ failed spec/


    it 'should not report pending', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @xit 'pending spec', =>
      ).outputs)
      .not.contains /pending spec/


  describe 'when failed spec', ->
    it 'should display with error messages', ->
      outputs = new Test(@reporter, ->
        @describe 'suite', =>
          @it 'failed spec', =>
            @expect(true).toBe false
            @passed()
            @expect(2).toBe 1
      ).outputs

      expect(outputs).not.contains /passed assertion/
      expect(outputs).contains [
        '    ✗ failed spec'
        '      - Expected true to be false.'
        '      - Expected 2 to be 1.'
        ''
      ]


  describe 'when suite', ->
    it 'should display top level suite', ->
      expect(new Test(@reporter, ->
        @it 'spec 1', =>
          @passed()
        @it 'spec 2', =>
          @passed()
      ).outputs).contains [
        '  Top level suite'
        '    ✓ spec 1'
        '    ✓ spec 2'
        ''
      ]


    it 'should display multiple specs', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @it 'spec 1', =>
            @passed()
          @it 'spec 2', =>
            @passed()
      ).outputs).contains [
        ''
        '  suite'
        '    ✓ spec 1'
        '    ✓ spec 2'
        ''
      ]


    it 'should display multiple suites', ->
      expect(new Test(@reporter, ->
        @describe 'suite 1', =>
          @it 'spec 1', =>
            @passed()
        @describe 'suite 2', =>
          @it 'spec 2', =>
            @passed()
      ).outputs).contains [
        ''
        '  suite 1'
        '    ✓ spec 1'
        ''
        '  suite 2'
        '    ✓ spec 2'
        ''
      ]


    it 'should display nested suite at first position', ->
      expect(new Test(@reporter, ->
        @describe 'suite 1', =>
          @describe 'suite 2', =>
            @it 'spec 1', =>
              @passed()
          @it 'spec 2', =>
            @passed()
      ).outputs).contains [
        ''
        '  suite 1'
        ''
        '    suite 2'
        '      ✓ spec 1'
        ''
        '    ✓ spec 2'
        ''
      ]


    it 'should display nested suite at last position', ->
      expect(new Test(@reporter, ->
        @describe 'suite 1', =>
          @it 'spec 1', =>
            @passed()
          @describe 'suite 2', =>
            @it 'spec 2', =>
              @passed()
      ).outputs).contains [
        ''
        '  suite 1'
        '    ✓ spec 1'
        ''
        '    suite 2'
        '      ✓ spec 2'
        ''
      ]


    it 'should display multiple nested suites', ->
      expect(new Test(@reporter, ->
        @describe 'suite 1', =>
          @describe 'suite 2', =>
            @it 'spec 2', =>
              @passed()
          @describe 'suite 3', =>
            @it 'spec 3', =>
              @passed()
      ).outputs).contains [
        ''
        '  suite 1'
        ''
        '    suite 2'
        '      ✓ spec 2'
        ''
        '    suite 3'
        '      ✓ spec 3'
        ''
      ]

    it 'should not display empty suite', ->
      outputs = new Test(@reporter, ->
        @describe 'suite 1', =>
          @it 'spec 1', =>
            @passed()
        @describe 'empty suite', =>
      ).outputs
      expect(outputs).contains [
        '  suite 1'
        '    ✓ spec 1'
        ''
      ]
      expect(outputs).not.contains /empty suite/

  describe 'summary', ->
    it 'should report success', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @it 'spec', =>
            @passed()
      ).summary)
      .contains 'Executed 1 of 1 spec SUCCESS in {time}.'


    it 'should report failure', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @it 'spec', =>
            @failed()
      ).summary)
      .contains 'Executed 1 of 1 spec (1 FAILED) in {time}.'


    it 'should report failures summary', ->
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


    it 'should report failures summary', ->
      expect(new Test(@reporter, ->
        @describe 'suite 1', =>
          @xit 'spec 1', =>
            @expect(true).toBe false
          @describe 'suite 2', =>
            @it 'spec 2', =>
              @pending('Will work soon')
              @expect(2).toBe 1
      ).summary).contains [
        /.*/
        /Pending/
        /.*/
        ''
        '1) suite 1 spec 1'
        '  Temporarily disabled with xit'
        ''
        '2) suite 1 suite 2 spec 2'
        '  Will work soon'
        ''
      ]


    it 'should report pending with success', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @xit 'spec', =>
          @it 'spec', =>
            @pending()
      ).summary)
      .contains 'Executed 0 of 2 specs SUCCESS (2 PENDING) in {time}.'


    it 'should report pending with failure', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @xit 'spec', =>
          @it 'spec', =>
            @failed()
      ).summary)
      .toContain 'Executed 1 of 2 specs (1 FAILED) (1 PENDING) in {time}.'


    it 'should report skipped with success', ->
      expect(new Test(@reporter, ->
        @describe 'suite', =>
          @it 'spec', =>
          @fit 'spec', =>
            @passed()
      ).summary)
      .toContain 'Executed 1 of 2 specs SUCCESS (1 SKIPPED) in {time}.'


    it 'should report skipped with failure and pending', ->
      expect(new Test(@reporter, ->
        @fdescribe 'suite', =>
          @xit 'spec', =>
          @it 'spec', =>
            @failed()
        @describe 'suite', =>
          @it 'spec', =>
          @xit 'spec', =>
      ).summary)
      .toContain 'Executed 1 of 4 specs (1 FAILED) (1 PENDING) (2 SKIPPED) in {time}.'
