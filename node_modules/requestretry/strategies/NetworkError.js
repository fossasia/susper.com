'use strict';

var RETRIABLE_ERRORS = ['ECONNRESET', 'ENOTFOUND', 'ESOCKETTIMEDOUT', 'ETIMEDOUT', 'ECONNREFUSED', 'EHOSTUNREACH', 'EPIPE', 'EAI_AGAIN'];
var _ = require('lodash');

/**
 * @param  {Null | Object} err
 * @param  {Object} response
 * @return {Boolean} true if the request had a network error
 */
function NetworkError(err /*, response*/ ) {
  return err && _.includes(RETRIABLE_ERRORS, err.code);
}

NetworkError.RETRIABLE_ERRORS = RETRIABLE_ERRORS;
module.exports = NetworkError;
