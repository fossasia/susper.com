var Slack = require('../lib');

webhookUri = "-- api token --";

slack = new Slack();
slack.setWebhook(webhookUri);

// slack emoji
slack.webhook({
  channel: "#general",
  username: "webhookbot",
  icon_emoji: ":ghost:",
  text: "test message, test message"
}, function(err, response) {
  console.log(response);
});

// URL image
slack.webhook({
  channel: "#general",
  username: "webhookbot",
  icon_emoji: "http://icons.iconarchive.com/icons/rokey/popo-emotions/128/after-boom-icon.png",
  text: "test message, test message"
}, function(err, response) {
  console.log(response);
});