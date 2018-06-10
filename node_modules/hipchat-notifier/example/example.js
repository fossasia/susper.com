// set the following environmental variables before executing;
//  HIPCHAT_TOKEN
//  HIPCHAT_ROOM


// instantiate a hipchat-notifier
//var hipchat = require('../index.js').make(
var hipchat = require('hipchat-notifier').make(
  process.env.HIPCHAT_ROOM,
  process.env.HIPCHAT_TOKEN
);

hipchat.setNotify = true;

// the pyramid of doom example, calls to hipchat are serial
hipchat.notice('this is a .notice()', function(err, response, body){
  hipchat.info('this is a .info()', function(err, response, body){
    hipchat.success('this is a .success()', function(err, response, body){
      hipchat.warning('this is a .warning()', function(err, response, body){
        hipchat.failure('this is a .failure()', function(err, response, body){


          // getters and setters are supported
          hipchat.setFrom('setter label');
          hipchat.setNotify(true);

          hipchat.setRoom(room);
          hipchat.setToken(token);
          hipchat.setHost('api.hipchat.com');

          // bombs away
          hipchat.notice('from setter label');

          // support passing an explicit API object, falls back to defaults.
          // allows sending HipChat cards &c. see:
          //    https://www.hipchat.com/docs/apiv2/method/send_room_notification

          var body = {
            from: 'random color label',
            message: '<p><em>this message</em> is a random color',
            color: 'random'
          };

          // bombs away deux!
          // callbacks are supported as 2nd argument
          hipchat.send(body, function(err, res, body){
            if(err) {
              throw new Error(err);
            }
            console.log('finished');
          });
        });
      });
    });
  });
});
