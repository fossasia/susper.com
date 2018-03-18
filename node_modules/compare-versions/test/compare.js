var assert = require('assert');
var compare = require('..');
var cmp = {
    '1': '>',
    '0': '=',
    '-1': '<'
};

describe('compare versions', function () {
    it('should compare three-segment versions correctly', function () {
        assert.equal(compare('10.1.8', '10.0.4'),  1);
        assert.equal(compare('10.0.1', '10.0.1'),  0);
        assert.equal(compare('10.1.1', '10.2.2'), -1);
    });

    it('should compare two-segment versions correctly', function () {
        assert.equal(compare('10.8', '10.4'),  1);
        assert.equal(compare('10.1', '10.1'),  0);
        assert.equal(compare('10.1', '10.2'), -1);
    });

    it('should compare single-segment versions correctly', function () {
        assert.equal(compare('10', '9'),  1);
        assert.equal(compare('10', '10'),  0);
        assert.equal(compare('9', '10'), -1);
    });

    it('should compare versions with different number of digits in same group', function () {
        assert.equal(compare('11.0.10', '11.0.2'), 1);
        assert.equal(compare('11.0.2', '11.0.10'), -1);
    });

    it('should compare versions with different number of digits in different groups', function () {
        assert.equal(compare('11.1.10', '11.0'), 1);
    });

    it('should compare versions with different number of digits', function () {
        assert.equal(compare('1.1.1', '1'), 1);
        assert.equal(compare('1.0.0', '1'), 0);
        assert.equal(compare('1.0', '1.4.1'), -1);
    });

    describe('pre-release versions', function () {
        [
            ['1.0.0-alpha.1', '1.0.0-alpha', 1],
            ['1.0.0-alpha', '1.0.0-alpha.1', -1],
            ['1.0.0-alpha.1', '1.0.0-alpha.beta', -1],
            ['1.0.0-alpha.beta', '1.0.0-beta', -1],
            ['1.0.0-beta', '1.0.0-beta.2', -1],
            ['1.0.0-beta.2', '1.0.0-beta.11', -1],
            ['1.0.0-beta.11', '1.0.0-rc.1', -1],
            ['1.0.0-rc.1', '1.0.0', -1],
            ['1.0.0-alpha', '1', -1]
        ].forEach(function (data) {
            it('should return ' + data[0] + ' ' + cmp[data[2]] + ' ' + data[1], function () {
                assert.equal(compare(data[0], data[1]), data[2]);
            });
        });
    });

    it('should ignore build metadata', function () {
        assert.equal(compare('1.4.0-build.3928', '1.4.0-build.3928+sha.a8d9d4f'), 0);
        assert.equal(compare('1.4.0-build.3928+sha.b8dbdb0', '1.4.0-build.3928+sha.a8d9d4f'), 0);
    });

    it('should ignore leading `v`', function () {
        assert.equal(compare('v1.0.0', '1.0.0'), 0);
        assert.equal(compare('v1.0.0', 'v1.0.0'), 0);
        assert.equal(compare('v1.0.0', 'v1.0.0'), 0);
        assert.equal(compare('v1.0.0-alpha', '1.0.0-alpha'), 0);
    });

    it('should ignore leading `0`', function () {
        [
            ['01.0.0', '1.0.0', 0],
            ['1.01.0', '1.01.0', 0],
            ['1.0.03', '1.0.3', 0],
            ['1.0.03-alpha', '1.0.3-alpha', 0],
            ['v01.0.0', '1.0.0', 0],
            ['v01.0.0', '2.0.0', -1],
        ].forEach(function (data) {
            assert.equal(compare(data[0], data[1]), data[2]);
        });
    });

    it('should throw on invalid input', function () {
        [
            [42, /Invalid argument expected string/],
            [{}, /Invalid argument expected string/],
            [[], /Invalid argument expected string/],
            [function () {}, /Invalid argument expected string/],
            ['6.3.', /Invalid argument not valid semver/],
        ].forEach(function (data) {
            assert.throws(function () {
                compare(data[0], data[0]);
            }, data[1]);
        });
    });
});