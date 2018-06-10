'use strict';

var wellknown = require('./index');

module.exports['Find by key'] = function(test) {
    test.ok(wellknown('Gmail'));
    test.done();
};

module.exports['Find by alias'] = function(test) {
    test.ok(wellknown('Google Mail'));
    test.done();
};

module.exports['Find by domain'] = function(test) {
    test.ok(wellknown('GoogleMail.com'));
    test.done();
};

module.exports['No match'] = function(test) {
    test.ok(!wellknown('zzzzzz'));
    test.done();
};
