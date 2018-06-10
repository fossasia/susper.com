var Slack = require('../lib');

webhookUri = "-- api token --";

slack = new Slack();
slack.setWebhook(webhookUri);

slack.webhook({
  channel: "#general",
  username: "webhookbot",
  text: "This is posted to #general and comes from a bot named webhookbot."
}, function(err, response) {
  console.log(response);
});