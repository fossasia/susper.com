var request = require('request');
var util = require('util');
var _ = require('lodash');

// exports
//////////

var HipChatNotifier = function(room, token, from, host, notify){
  this.room = room;
  this.token = token;
  this.from = from || '';
  this.host = host || 'api.hipchat.com';
  this.notify = notify || false;
};

module.exports = {
  'make': function(room, token, from, host, notify){
    return new HipChatNotifier(room, token, from, host, notify);
  }
};

// convenience
//////////////

HipChatNotifier.prototype.notice = function(message, callback){
  this.send.call(this, {'message': message, 'color': 'gray'}, callback);
};

HipChatNotifier.prototype.info = function(message, callback){
  this.send.call(this, {'message': message, 'color': 'yellow'}, callback);
};

HipChatNotifier.prototype.success = function(message, callback){
  this.send.call(this, {'message': message, 'color': 'green'}, callback);
};

HipChatNotifier.prototype.warning = function(message, callback){
  this.send.call(this, {'message': message, 'color': 'purple'}, callback);
};

HipChatNotifier.prototype.failure = function(message, callback){
  this.send.call(this, {'message': message, 'color': 'red'}, callback);
};


// prepare and send notification -- for body params, see:
//   https://www.hipchat.com/docs/apiv2/method/send_room_notification

HipChatNotifier.prototype.send = function(jsonBody, callback){

  if(!this.room) { throw new Error('hipchat-notifier: missing room'); }
  if(!this.token) { throw new Error('hipchat-notifier: missing token'); }

  var defaults = {
    message: 'bonjour!',
    from: this.from,
    color: 'random',
    message_format: /<[a-z][\s\S]*>/i.test(jsonBody.message) ? 'html' : 'text',
    notify: this.notify
  };

  request({
    method: 'POST',
    uri: util.format('https://%s/v2/room/%s/notification', this.host, this.room),
    auth: {
      bearer: this.token
    },
    json: _.assign(defaults, jsonBody),
  }, function(err, res, body){
    if(callback) {
      callback(err, res, body);
    }
  });
};

// gettersetters
////////////////

HipChatNotifier.prototype.setFrom = function(from){
  this.from = from;
};

HipChatNotifier.prototype.setRoom = function(room_id_or_name){
  this.room = room_id_or_name;
};

HipChatNotifier.prototype.setToken = function(token){
  this.token = token;
};

HipChatNotifier.prototype.setHost = function(host){
  this.host = host;
};

HipChatNotifier.prototype.setNotify = function(notify){
  this.notify = notify;
};
