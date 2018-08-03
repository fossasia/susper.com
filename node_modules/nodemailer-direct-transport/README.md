# Direct SMTP transport module for Nodemailer

Applies for Nodemailer v1.x and not for v0.x where transports are built-in.

## Usage

Install with npm

    npm install nodemailer-direct-transport

Require to your script

```javascript
var nodemailer = require('nodemailer');
var directTransport = require('nodemailer-direct-transport');
```

Create a Nodemailer transport object

```javascript
var transporter = nodemailer.createTransport(directTransport(options))
```

Where

  * **options** defines connection data
    * **options.name** hostname to be used when introducing the client to the MX server
    * **options.logger** optional [bunyan](https://github.com/trentm/node-bunyan) compatible logger instance. If set to `true` then logs to console. If value is not set or is `false` then nothing is logged
    * **options.debug** if set to true, then logs SMTP traffic, otherwise logs only transaction events
    * **options.port** optional port to use for connecting to MX servers (defaults to MTA standard 25)
    * **options.retryDelay** optional timeout in ms for retrying failed messages (defaults to 15 minutes)
    * **getSocket** optional method that is called every time a new connection is made against the SMTP server. This method can provide an existing socket to be used instead of creating a new one

**Example**

```javascript
var transport = nodemailer.createTransport(directTransport({
    name: 'smtp.example.com' // should be the hostname machine IP address resolves to
}));
```

## send callback

Send callback includes the following arguments

  * **error** if the mail was not sent
    * **error.errors** is an array of error responses (one response for one MX exchange)
      * **error.errors[].recipients** an array of failed recipients
      * **error.errors[].response** Error response from the SMTP server
  * **info** if at least one mail was sent or is pending
    * **info.accepted** an array of recipients that were accepted
    * **info.rejected** an array of recipients that were rejected
    * **info.pending** an array of pending recipient objects (messages that were not rejected permanently and are retried later)
      * **info.pending[].recipients** an array of recipient addresses that are still pending
      * **info.pending[].response** Response from the SMTP server
    * **info.errors** An array of errors (for these exhanges that rejected mail)

## Issues

Direct transport is very inefficient as it queues all e-mails to be sent into memory. Additionally, if a message is not yet sent and the process is closed, all data about queued messages is lost. Thus direct transport is only suitable for low throughput systems, where the message can be processed immediately.

While not being 100% reliable (remember - if process exits, entire queue is lost), direct transport can still handle sending errors, graylisting and such. If a message can not be sent, it is re-queued and retried later.

## License

**MIT**
