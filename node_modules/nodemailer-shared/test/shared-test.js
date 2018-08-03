/* eslint no-unused-expressions:0, no-invalid-this:0 */
/* globals beforeEach, afterEach, describe, it */

'use strict';

var chai = require('chai');
var expect = chai.expect;
var shared = require('../lib/shared');

var http = require('http');
var fs = require('fs');
var zlib = require('zlib');

chai.config.includeStack = true;

describe('Logger tests', function () {
    it('Should create a logger', function () {
        expect(typeof shared.getLogger({
            logger: false
        })).to.equal('object');
        expect(typeof shared.getLogger()).to.equal('object');
        expect(typeof shared.getLogger({
            logger: 'stri'
        })).to.equal('string');
    });
});

describe('Connection url parser tests', function () {
    it('Should parse connection url', function () {
        var url = 'smtps://user:pass@localhost:123?tls.rejectUnauthorized=false&name=horizon';
        expect(shared.parseConnectionUrl(url)).to.deep.equal({
            secure: true,
            port: 123,
            host: 'localhost',
            auth: {
                user: 'user',
                pass: 'pass'
            },
            tls: {
                rejectUnauthorized: false
            },
            name: 'horizon'
        });
    });

    it('should not choke on special symbols in auth', function () {
        var url = 'smtps://user%40gmail.com:%3Apasswith%25Char@smtp.gmail.com';
        expect(shared.parseConnectionUrl(url)).to.deep.equal({
            secure: true,
            host: 'smtp.gmail.com',
            auth: {
                user: 'user@gmail.com',
                pass: ':passwith%Char'
            }
        });
    });
});

describe('Resolver tests', function () {
    var port = 10337;
    var server;

    beforeEach(function (done) {
        server = http.createServer(function (req, res) {
            if (/redirect/.test(req.url)) {
                res.writeHead(302, {
                    Location: 'http://localhost:' + port + '/message.html'
                });
                res.end('Go to http://localhost:' + port + '/message.html');
            } else if (/compressed/.test(req.url)) {
                res.writeHead(200, {
                    'Content-Type': 'text/plain',
                    'Content-Encoding': 'gzip'
                });
                var stream = zlib.createGzip();
                stream.pipe(res);
                stream.write('<p>Tere, tere</p><p>vana kere!</p>\n');
                stream.end();
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/plain'
                });
                res.end('<p>Tere, tere</p><p>vana kere!</p>\n');
            }
        });

        server.listen(port, done);
    });

    afterEach(function (done) {
        server.close(done);
    });

    it('should set text from html string', function (done) {
        var mail = {
            data: {
                html: '<p>Tere, tere</p><p>vana kere!</p>\n'
            }
        };
        shared.resolveContent(mail.data, 'html', function (err, value) {
            expect(err).to.not.exist;
            expect(value).to.equal('<p>Tere, tere</p><p>vana kere!</p>\n');
            done();
        });
    });

    it('should set text from html buffer', function (done) {
        var mail = {
            data: {
                html: new Buffer('<p>Tere, tere</p><p>vana kere!</p>\n')
            }
        };
        shared.resolveContent(mail.data, 'html', function (err, value) {
            expect(err).to.not.exist;
            expect(value).to.deep.equal(mail.data.html);
            done();
        });
    });

    it('should set text from a html file', function (done) {
        var mail = {
            data: {
                html: {
                    path: __dirname + '/fixtures/message.html'
                }
            }
        };
        shared.resolveContent(mail.data, 'html', function (err, value) {
            expect(err).to.not.exist;
            expect(value).to.deep.equal(new Buffer('<p>Tere, tere</p><p>vana kere!</p>\n'));
            done();
        });
    });

    it('should set text from an html url', function (done) {
        var mail = {
            data: {
                html: {
                    path: 'http://localhost:' + port + '/message.html'
                }
            }
        };
        shared.resolveContent(mail.data, 'html', function (err, value) {
            expect(err).to.not.exist;
            expect(value).to.deep.equal(new Buffer('<p>Tere, tere</p><p>vana kere!</p>\n'));
            done();
        });
    });

    it('should set text from redirecting url', function (done) {
        var mail = {
            data: {
                html: {
                    path: 'http://localhost:' + port + '/redirect.html'
                }
            }
        };
        shared.resolveContent(mail.data, 'html', function (err, value) {
            expect(err).to.not.exist;
            expect(value).to.deep.equal(new Buffer('<p>Tere, tere</p><p>vana kere!</p>\n'));
            done();
        });
    });

    it('should set text from gzipped url', function (done) {
        var mail = {
            data: {
                html: {
                    path: 'http://localhost:' + port + '/compressed.html'
                }
            }
        };
        shared.resolveContent(mail.data, 'html', function (err, value) {
            expect(err).to.not.exist;
            expect(value).to.deep.equal(new Buffer('<p>Tere, tere</p><p>vana kere!</p>\n'));
            done();
        });
    });

    it('should set text from a html stream', function (done) {
        var mail = {
            data: {
                html: fs.createReadStream(__dirname + '/fixtures/message.html')
            }
        };
        shared.resolveContent(mail.data, 'html', function (err, value) {
            expect(err).to.not.exist;
            expect(mail).to.deep.equal({
                data: {
                    html: new Buffer('<p>Tere, tere</p><p>vana kere!</p>\n')
                }
            });
            expect(value).to.deep.equal(new Buffer('<p>Tere, tere</p><p>vana kere!</p>\n'));
            done();
        });
    });

    it('should return an error', function (done) {
        var mail = {
            data: {
                html: {
                    path: 'http://localhost:' + (port + 1000) + '/message.html'
                }
            }
        };
        shared.resolveContent(mail.data, 'html', function (err) {
            expect(err).to.exist;
            done();
        });
    });

    it('should return encoded string as buffer', function (done) {
        var str = '<p>Tere, tere</p><p>vana kere!</p>\n';
        var mail = {
            data: {
                html: {
                    encoding: 'base64',
                    content: new Buffer(str).toString('base64')
                }
            }
        };
        shared.resolveContent(mail.data, 'html', function (err, value) {
            expect(err).to.not.exist;
            expect(value).to.deep.equal(new Buffer(str));
            done();
        });
    });

    describe('data uri tests', function () {

        it('should resolve with mime type and base64', function (done) {
            var mail = {
                data: {
                    attachment: {
                        path: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
                    }
                }
            };
            shared.resolveContent(mail.data, 'attachment', function (err, value) {
                expect(err).to.not.exist;
                expect(value).to.deep.equal(new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==', 'base64'));
                done();
            });
        });

        it('should resolve with mime type and plaintext', function (done) {
            var mail = {
                data: {
                    attachment: {
                        path: 'data:image/png,tere%20tere'
                    }
                }
            };
            shared.resolveContent(mail.data, 'attachment', function (err, value) {
                expect(err).to.not.exist;
                expect(value).to.deep.equal(new Buffer('tere tere'));
                done();
            });
        });

        it('should resolve with plaintext', function (done) {
            var mail = {
                data: {
                    attachment: {
                        path: 'data:,tere%20tere'
                    }
                }
            };
            shared.resolveContent(mail.data, 'attachment', function (err, value) {
                expect(err).to.not.exist;
                expect(value).to.deep.equal(new Buffer('tere tere'));
                done();
            });
        });

        it('should resolve with mime type, charset and base64', function (done) {
            var mail = {
                data: {
                    attachment: {
                        path: 'data:image/png;charset=iso-8859-1;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
                    }
                }
            };
            shared.resolveContent(mail.data, 'attachment', function (err, value) {
                expect(err).to.not.exist;
                expect(value).to.deep.equal(new Buffer('iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==', 'base64'));
                done();
            });
        });
    });
});
