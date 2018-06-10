var Slack = require('../lib');
//check https://api.slack.com/web
apiToken = "-- api token --";

slack = new Slack(apiToken);

slack.api("users.list", function(err, response) {
  console.log(response);
});

slack.api('chat.postMessage', {
  text:'hello from nodejs', 
  channel:'#general'
}, function(err, response){
  console.log(response);
});