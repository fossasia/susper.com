'use strict';

var services = require('./services.json');
var normalized = {};

Object.keys(services).forEach(function(key) {
    var service = services[key];

    normalized[normalizeKey(key)] = normalizeService(service);

    [].concat(service.aliases || []).forEach(function(alias) {
        normalized[normalizeKey(alias)] = normalizeService(service);
    });

    [].concat(service.domains || []).forEach(function(domain) {
        normalized[normalizeKey(domain)] = normalizeService(service);
    });
});

function normalizeKey(key) {
    return key.replace(/[^a-zA-Z0-9.\-]/g, '').toLowerCase();
}

function normalizeService(service) {
    var filter = ['domains', 'aliases'];
    var response = {};

    Object.keys(service).forEach(function(key) {
        if (filter.indexOf(key) < 0) {
            response[key] = service[key];
        }
    });

    return response;
}

/**
 * Resolves SMTP config for given key. Key can be a name (like 'Gmail'), alias (like 'Google Mail') or
 * an email address (like 'test@googlemail.com').
 *
 * @param {String} key [description]
 * @returns {Object} SMTP config or false if not found
 */
module.exports = function(key) {
    key = normalizeKey(key.split('@').pop());
    return normalized[key] || false;
};