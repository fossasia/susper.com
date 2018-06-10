/* eslint no-unused-expressions:0 */
/* globals beforeEach, describe, it */

'use strict';

var chai = require('chai');
var expect = chai.expect;
var createMessageQueue = require('../lib/message-queue');
chai.config.includeStack = true;

describe('Message Queue Tests', function () {
    var queue;

    beforeEach(function () {
        queue = createMessageQueue();
    });

    it('Should Add item to queue', function () {
        expect(queue._instantQueue).to.deep.equal([]);
        queue.insert('value1');
        expect(queue._instantQueue).to.deep.equal(['value1']);
        queue.insert('value2');
        expect(queue._instantQueue).to.deep.equal(['value2', 'value1']);
    });

    it('Should Pull items from a queue', function (done) {
        queue.insert('value1');
        queue.insert('value2');

        queue.get(function (value) {
            expect(value).to.be.equal('value1');

            queue.get(function (value) {
                expect(value).to.be.equal('value2');
                expect(queue._instantQueue).to.deep.equal([]);
                done();
            });
        });
    });

    it('Should Add delayed items', function (done) {
        queue.insert('value1', 300);
        queue.insert('value2', 100);
        queue.insert('value3');

        queue.get(function (value) {
            expect(value).to.be.equal('value3');

            queue.get(function (value) {
                expect(value).to.be.equal('value2');

                queue.get(function (value) {
                    expect(value).to.be.equal('value1');
                    done();
                });
            });
        });
    });
});
