# SMTP transport module for Nodemailer

Applies for Nodemailer v1.x and not for v0.x where transports are built-in.

## Usage

Install with npm

    npm install nodemailer-smtp-pool

Require to your script

```javascript
var nodemailer = require('nodemailer');
var smtpPool = require('nodemailer-smtp-pool');
```

Create a Nodemailer transport object

```javascript
var transporter = nodemailer.createTransport(smtpPool(options))
```

Where

  * **options** defines connection data
    * **options.port** is the port to connect to (defaults to 25 or 465)
    * **options.host** is the hostname or IP address to connect to (defaults to 'localhost')
    * **options.secure** defines if the connection should use SSL (if `true`) or not (if `false`)
    * **options.auth** defines authentication data (see [authentication](#authentication) section below)
    * **options.ignoreTLS** turns off STARTTLS support if true
    * **options.name** optional hostname of the client, used for identifying to the server
    * **options.localAddress** is the local interface to bind to for network connections
    * **options.connectionTimeout** how many milliseconds to wait for the connection to establish
    * **options.greetingTimeout** how many milliseconds to wait for the greeting after connection is established
    * **options.socketTimeout** how many milliseconds of inactivity to allow
    * **options.logger** optional [bunyan](https://github.com/trentm/node-bunyan) compatible logger instance. If set to `true` then logs to console. If value is not set or is `false` then nothing is logged
    * **options.debug** if set to true, then logs SMTP traffic, otherwise logs only transaction events
    * **options.authMethod** defines preferred authentication method, eg. 'PLAIN'
    * **options.tls** defines additional options to be passed to the socket constructor, eg. *{rejectUnauthorized: true}*
    * **maxConnections** (defaults to 5) is the count of maximum simultaneous connections to make against the SMTP server
    * **maxMessages** (defaults to 100) limits the message count to be sent using a single connection. After maxMessages messages the connection is dropped and a new one is created for the following messages
    * **rateLimit** (defaults to `false`) limits the message count to be sent in a second. Once rateLimit is reached, sending is paused until the end of the second. This limit is shared between connections, so if one connection uses up the limit, then other connections are paused as well
    * **getSocket** optional method that is called every time a new connection is made against the SMTP server. This method can provide an existing socket to be used instead of creating a new one

Alternatively you can use connection url with protocol 'smtp:' or 'smtps:'. Use query arguments for additional configuration values.

Pooled SMTP transport uses the same options as [SMTP transport](https://github.com/andris9/nodemailer-smtp-transport) with the addition of **maxConnections** and **maxMessages**.

**Example**

```javascript
var transport = nodemailer.createTransport(smtpPool({
    host: 'localhost',
    port: 25,
    auth: {
        user: 'username',
        pass: 'password'
    },
    // use up to 5 parallel connections
    maxConnections: 5,
    // do not send more than 10 messages per connection
    maxMessages: 10,
    // no not send more than 5 messages in a second
    rateLimit: 5
}));
```

Or with connection url (gmail)

```javascript
var transporter = nodemailer.createTransport(
    smtpTransport('smtps://username%40gmail.com:password@smtp.gmail.com')
);
```

## Events

The following events are emitted by this transport

### Event: 'idle'

Emitted if there are free slots in the connection pool.
Check with `.isIdle()` method if these free slots are still available.
Using this method makes sense if you maintain your own queue (for example pull from some queue service).

```javascript
var messages = [...'list of messages'];
transporter.on('idle', function(){
    // send next messages from the pending queue
    while(transporter.isIdle() && messages.length){
        transporter.send(messages.shift());
    }
});
```

## Authentication

If authentication data is not present, the connection is considered authenticated from the start.

Set authentcation data with `options.auth`

Where

  * **auth** is the authentication object
    * **auth.user** is the username
    * **auth.pass** is the password for the user
    * **auth.xoauth2** is the OAuth2 access token (preferred if both `pass` and `xoauth2` values are set) or an [XOAuth2](https://github.com/andris9/xoauth2) token generator object.

If a [XOAuth2](https://github.com/andris9/xoauth2) token generator is used as the value for `auth.xoauth2` then you do not need to set the value for `auth.user`. XOAuth2 generator generates required `accessToken` itself if it is missing or expired. In this case if the authentication fails, a new token is requested and the authentication is retried once. If it still fails, an error is returned.

Install xoauth2 module to use XOauth2 token generators (not included by default)

    npm install xoauth2 --save

**XOAuth2 Example**

> **NB!** The correct OAuth2 scope for Gmail is `https://mail.google.com/`

```javascript
var generator = require('xoauth2').createXOAuth2Generator({
    user: '{username}',
    clientId: '{Client ID}',
    clientSecret: '{Client Secret}',
    refreshToken: '{refresh-token}',
    accessToken: '{cached access token}' // optional
});

// listen for token updates
// you probably want to store these to a db
generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});

// login
var transport = nodemailer.createTransport(smtpPool({
    service: 'gmail',
    auth: {
        xoauth2: generator
    },
    maxConnections: 5,
    maxMessages: 10
}));
```

## Using well-known services

If you do not want to specify the hostname, port and security settings for a well known service, you can use it by its name (case insensitive).

```javascript
smtpPool({
    service: 'gmail',
    auth: ..
});
```

See the list of all supported services [here](https://github.com/andris9/nodemailer-wellknown#supported-services).

## Close the pool

Close all connections with `close()`

```javascript
transport.close();
```

## Verify connection configuration

You can verify your configuration with `verify(callback)` call. If it returns an error, then something is not correct, otherwise the server is ready to accept messages.

```javascript
// verify connection configuration
transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Server is ready to take our messages');
   }
});
```

## License

**MIT**
