slack-node-sdk
==============

[![Build Status](https://travis-ci.org/clonn/slack-node-sdk.svg?branch=master)](https://travis-ci.org/clonn/slack-node-sdk)

[Slack](https://slack.com/) Node SDK, full support for Webhook and the Slack API, continuously updated.

## Install

    npm install slack-node

## Slack Webhook usage

At first, you have to apply [Slack webhook](https://my.slack.com/services/new/incoming-webhook).
and copy `webhook url`

### Webhook usage

Code example:

```javascript
var Slack = require('slack-node');

webhookUri = "__uri___";

slack = new Slack();
slack.setWebhook(webhookUri);

slack.webhook({
  channel: "#general",
  username: "webhookbot",
  text: "This is posted to #general and comes from a bot named webhookbot."
}, function(err, response) {
  console.log(response);
});
```

Use icon emoji, you can give a Slack defined emoji, or use image from URL.


```javascript
var Slack = require('slack-node');

webhookUri = "__uri___";

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
```

Otherwise, you can check usage from [example](https://github.com/clonn/slack-node-sdk/tree/master/example)

## Slack API support

First you have to apply an API from [SLACK API page](https://api.slack.com/),

 * [https://api.slack.com/](https://api.slack.com/)

The method, please reference [Slack API page](https://api.slack.com/)

example code,

```javascript
var Slack = require('slack-node');
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
```

## Changelog

 * 0.1.7
  * slack-node no longer crashes if Slack returns HTML instead of JSON.

 * 0.1.6
  * support ES6, promise function.

 * 0.1.3
  * use [requestretry](https://www.npmjs.com/package/requestretry) replace request. thanks for [timjrobinson](https://github.com/clonn/slack-node-sdk/pull/11)
  * update test
  * fixed emoji error
  * fixed return error crash when run time.

 * 0.1.0
  * fixed test type error
  * support new [slack webhook](https://api.slack.com/incoming-webhooks).

 * 0.0.95
  * fixed webhook function and test
  * support file upload function

 * 0.0.93
  * return header and status

 * 0.0.92
  * merge slack emoji for webhook
  * pass request full request object

 * 0.0.9
  * pass parameters bug fixed
