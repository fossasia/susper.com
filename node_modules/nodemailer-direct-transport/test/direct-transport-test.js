/* eslint no-unused-expressions:0 */
/* globals afterEach, beforeEach, describe, it */

'use strict';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var net = require('net');
var chai = require('chai');
var expect = chai.expect;
var directTransport = require('../lib/direct-transport');
var SMTPServer = require('smtp-server').SMTPServer;
chai.config.includeStack = true;

var PORT_NUMBER = 8712;

function MockBuilder(envelope, message) {
    this.envelope = envelope;
    this.message = message;
    this._headers = [];
}

MockBuilder.prototype.getEnvelope = function () {
    return this.envelope;
};

MockBuilder.prototype.createReadStream = function () {
    return this.message;
};

MockBuilder.prototype.getHeader = function () {
    return 'teretere';
};

describe('SMTP Transport Tests', function () {
    this.timeout(100 * 1000); // eslint-disable-line

    var server;
    var retryCount = 0;

    beforeEach(function (done) {
        server = new SMTPServer({
            disabledCommands: ['STARTTLS', 'AUTH'],

            onData: function (stream, session, callback) {
                stream.on('data', function () {});
                stream.on('end', function () {
                    var err;
                    if (/retry@/.test(session.envelope.mailFrom.address) && retryCount++ < 3) {
                        err = new Error('Please try again later');
                        err.responseCode = 451;
                        return callback(err);
                    } else {
                        return callback(null, 'OK');
                    }
                });
            },

            onMailFrom: function (address, session, callback) {
                if (/invalid@/.test(address.address)) {
                    return callback(new Error('Invalid sender'));
                }
                return callback(); // Accept the address
            },
            onRcptTo: function (address, session, callback) {
                if (/invalid@/.test(address.address)) {
                    return callback(new Error('Invalid recipient'));
                }
                return callback(); // Accept the address
            },
            logger: false
        });

        server.listen(PORT_NUMBER, done);
    });

    afterEach(function (done) {
        server.close(done);
    });

    it('Should expose version number', function () {
        var client = directTransport();
        expect(client.name).to.exist;
        expect(client.version).to.exist;
    });

    it('Should send mail', function (done) {
        var client = directTransport({
            port: PORT_NUMBER,
            logger: false,
            debug: true
        });

        var chunks = [];
        var message = new Array(1024).join('teretere, vana kere\n');

        server.on('data', function (connection, chunk) {
            chunks.push(chunk);
        });

        server.on('dataReady', function (connection, callback) {
            var body = Buffer.concat(chunks);
            expect(body.toString()).to.equal(message.trim().replace(/\n/g, '\r\n'));
            callback(null, true);
        });

        client.send({
            data: {},
            message: new MockBuilder({
                from: 'test@[127.0.0.1]',
                to: ['test@[127.0.0.1]']
            }, message)
        }, function (err, info) {
            expect(err).to.not.exist;
            expect(info.accepted).to.deep.equal(['test@[127.0.0.1]']);
            done();
        });
    });

    it('Should retry mail', function (done) {
        var client = directTransport({
            port: PORT_NUMBER,
            retryDelay: 1000,
            logger: false,
            debug: true
        });

        client.send({
            data: {},
            message: new MockBuilder({
                from: 'retry@[127.0.0.1]',
                to: ['test@[127.0.0.1]', 'test2@[127.0.0.1]']
            }, 'test')
        }, function (err, info) {
            expect(err).to.not.exist;
            expect(info.pending.length).to.equal(1);
            done();
        });
    });

    it('Should reject mail', function (done) {
        var client = directTransport({
            port: PORT_NUMBER,
            retryDelay: 1000,
            logger: false,
            debug: true
        });

        client.send({
            data: {},
            message: new MockBuilder({
                from: 'invalid@[127.0.0.1]',
                to: ['test@[127.0.0.1]', 'test2@[127.0.0.1]']
            }, 'test')
        }, function (err) {
            expect(err).to.exist;
            expect(err.errors[0].recipients).to.deep.equal(['test@[127.0.0.1]', 'test2@[127.0.0.1]']);
            done();
        });
    });

    it('Should resolve MX', function (done) {
        var client = directTransport({
            port: PORT_NUMBER,
            retryDelay: 1000,
            logger: false,
            debug: true
        });

        client._resolveMx('kreata.ee', function (err, list) {
            expect(err).to.not.exist;
            expect(list.sort(function (a, b) {
                return a.priority - b.priority;
            })).to.deep.equal([{
                exchange: 'aspmx.l.google.com',
                priority: 10
            }, {
                exchange: 'alt1.aspmx.l.google.com',
                priority: 20
            }, {
                exchange: 'alt2.aspmx.l.google.com',
                priority: 30
            }]);
            done();
        });
    });

    it('Should resolve A', function (done) {
        var client = directTransport({
            port: PORT_NUMBER,
            retryDelay: 1000,
            logger: false,
            debug: true
        });

        client._resolveMx('localhost.kreata.ee', function (err, list) {
            expect(err).to.not.exist;
            expect(list).to.deep.equal([{
                priority: 0,
                exchange: '127.0.0.1'
            }]);
            done();
        });
    });

    it('Should send mail to next alternative MX', function (done) {
        var client = directTransport({
            port: PORT_NUMBER,
            logger: false,
            debug: false
        });

        var chunks = [];
        var message = new Array(1024).join('teretere, vana kere\n');

        server.on('data', function (connection, chunk) {
            chunks.push(chunk);
        });

        server.on('dataReady', function (connection, callback) {
            var body = Buffer.concat(chunks);
            expect(body.toString()).to.equal(message.trim().replace(/\n/g, '\r\n'));
            callback(null, true);
        });

        client._resolveMx = function (mx, callback) {
            callback(null, [{
                priority: 1,
                exchange: '255.255.255.255'
            }, {
                priority: 2,
                exchange: '127.0.0.1'
            }]);
        };

        client.send({
            data: {},
            message: new MockBuilder({
                from: 'test@test',
                to: ['test@test']
            }, message)
        }, function (err, info) {
            expect(err).to.not.exist;
            expect(info.accepted).to.deep.equal(['test@test']);
            done();
        });
    });

    it('Should send mail using proxied socket', function (done) {
        var client = directTransport({
            port: 25,
            logger: false,
            debug: true,
            getSocket: function (options, callback) {
                var socket = net.connect(PORT_NUMBER, 'localhost');
                var errHandler = function (err) {
                    callback(err);
                };
                socket.on('error', errHandler);
                socket.on('connect', function () {
                    socket.removeListener('error', errHandler);
                    callback(null, {
                        connection: socket
                    });
                });
            }
        });

        var chunks = [],
            message = new Array(1024).join('teretere, vana kere\n');

        server.on('data', function (connection, chunk) {
            chunks.push(chunk);
        });

        server.on('dataReady', function (connection, callback) {
            var body = Buffer.concat(chunks);
            expect(body.toString()).to.equal(message.trim().replace(/\n/g, '\r\n'));
            callback(null, true);
        });

        client.send({
            data: {},
            message: new MockBuilder({
                from: 'test@[127.0.0.1]',
                to: ['test@[127.0.0.1]']
            }, message)
        }, function (err, info) {
            expect(err).to.not.exist;
            expect(info.accepted).to.deep.equal(['test@[127.0.0.1]']);
            done();
        });
    });
});
