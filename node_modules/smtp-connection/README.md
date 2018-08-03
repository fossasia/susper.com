# smtp-connection

SMTP client module. Connect to SMTP servers and send mail with it.

This module is the successor for the client part of the (now deprecated) SMTP module [simplesmtp](https://www.npmjs.com/package/simplesmtp). For matching SMTP server see [smtp-server](https://www.npmjs.com/package/smtp-server).

[![Build Status](https://secure.travis-ci.org/nodemailer/smtp-connection.svg)](http://travis-ci.org/nodemailer/smtp-connection) [![npm version](https://badge.fury.io/js/smtp-connection.svg)](http://badge.fury.io/js/smtp-connection)

## Usage

Install with npm

```
npm install smtp-connection
```

Require in your script

```
var SMTPConnection = require('smtp-connection');
```

### Create SMTPConnection instance

```javascript
var connection = new SMTPConnection(options);
```

Where

- **options** defines connection data

  - **options.port** is the port to connect to (defaults to 25 or 465)
  - **options.host** is the hostname or IP address to connect to (defaults to 'localhost')
  - **options.secure** defines if the connection should use SSL (if `true`) or not (if `false`)
  - **options.ignoreTLS** turns off STARTTLS support if true
  - **options.requireTLS** forces the client to use STARTTLS. Returns an error if upgrading the connection is not possible or fails.
  - **options.opportunisticTLS** tries to use STARTTLS and continues normally if it fails
  - **options.name** optional hostname of the client, used for identifying to the server
  - **options.localAddress** is the local interface to bind to for network connections
  - **options.connectionTimeout** how many milliseconds to wait for the connection to establish
  - **options.greetingTimeout** how many milliseconds to wait for the greeting after connection is established
  - **options.socketTimeout** how many milliseconds of inactivity to allow
  - **options.logger** optional [bunyan](https://github.com/trentm/node-bunyan) compatible logger instance. If set to `true` then logs to console. If value is not set or is `false` then nothing is logged
  - **options.debug** if set to true, then logs SMTP traffic, otherwise logs only transaction events
  - **options.authMethod** defines preferred authentication method, e.g. 'PLAIN'
  - **options.tls** defines additional options to be passed to the socket constructor, e.g. _{rejectUnauthorized: true}_
  - **options.socket** - initialized socket to use instead of creating a new one
  - **options.connection** - connected socket to use instead of creating and connecting a new one. If `secure` option is true, then socket is upgraded from plaintext to ciphertext

### Events

SMTPConnection instances are event emitters with the following events

- **'error'** _(err)_ emitted when an error occurs. Connection is closed automatically in this case.
- **'connect'** emitted when the connection is established
- **'end'** when the instance is destroyed

### connect

Establish the connection

```javascript
connection.connect(callback)
```

Where

- **callback** is the function to run once the connection is established. The function is added as a listener to the 'connect' event.

After the connect event the `connection` has the following properties:

- **connection.secure** - if `true` then the connection uses a TLS socket, otherwise it is using a cleartext socket. Connection can start out as cleartext but if available (or `requireTLS` is set to true) connection upgrade is tried

### login

If the server requires authentication you can login with

```javascript
connection.login(auth, callback)
```

Where

- **auth** is the authentication object

  - **auth.user** is the username
  - **auth.pass** is the password for the user
  - **auth.xoauth2** is the OAuth2 access token (preferred if both `pass` and `xoauth2` values are set) or an [XOAuth2](https://github.com/andris9/xoauth2) token generator object.

- **callback** is the callback to run once the authentication is finished. Callback has the following arguments

  - **err** and error object if authentication failed

If a [XOAuth2](https://github.com/andris9/xoauth2) token generator is used as the value for `auth.xoauth2` then you do not need to set `auth.user`. XOAuth2 generator generates required accessToken itself if it is missing or expired. In this case if the authentication fails, a new token is requeested and the authentication is retried. If it still fails, an error is returned.

**XOAuth2 Example**

```javascript
var generator = require('xoauth2').createXOAuth2Generator({
    user: '{username}',
    clientId: '{Client ID}',
    clientSecret: '{Client Secret}',
    refreshToken: '{refresh-token}'
});

// listen for token updates
// you probably want to store these to a db
generator.on('token', function(token){
    console.log('New token for %s: %s', token.user, token.accessToken);
});

// login
connection.login({
    xoauth2: generator
}, callback);
```

### Login using NTLM

`smtp-connection` has experimental support for NTLM authentication. You can try it out like this:

```javascript
connection.login({
    domain: 'windows-domain',
    workstation: 'windows-workstation',
    user: 'user@somedomain.com',
    pass: 'pass'
}, callback);
```

I do not have access to an actual server that supports NTLM authentication so this feature is untested and should be used carefully.

### send

Once the connection is authenticated (or just after connection is established if authentication is not required), you can send mail with

```javascript
connection.send(envelope, message, callback)
```

Where

- **envelope** is the envelope object to use

  - **envelope.from** is the sender address
  - **envelope.to** is the recipient address or an array of addresses
  - **envelope.size** is an optional value of the predicted size of the message in bytes. This value is used if the server supports the SIZE extension (RFC1870)
  - **envelope.use8BitMime** if `true` then inform the server that this message might contain bytes outside 7bit ascii range
  - **envelope.dsn** is the dsn options

    - **envelope.dsn.ret** return either the full message 'FULL' or only headers 'HDRS'
    - **envelope.dsn.envid** sender's 'envelope identifier' for tracking
    - **envelope.dsn.notify** when to send a DSN. Multiple options are OK - array or comma delimited. NEVER must appear by itself. Available options: 'NEVER', 'SUCCESS', 'FAILURE', 'DELAY'
    - **envelope.dsn.orcpt** original recipient

- **message** is either a String, Buffer or a Stream. All newlines are converted to \r\n and all dots are escaped automatically, no need to convert anything before.

- **callback** is the callback to run once the sending is finished or failed. Callback has the following arguments

  - **err** and error object if sending failed

    - **code** string code identifying the error, for example 'EAUTH' is returned when authentication fails
    - **response** is the last response received from the server (if the error is caused by an error response from the server)
    - **responseCode** is the numeric response code of the `response` string (if available)

  - **info** information object about accepted and rejected recipients

    - **accepted** an array of accepted recipient addresses. Normally this array should contain at least one address except when in LMTP mode. In this case the message itself might have succeeded but all recipients were rejected after sending the message.
    - **rejected** an array of rejected recipient addresses. This array includes both the addresses that were rejected before sending the message and addresses rejected after sending it if using LMTP
    - **rejectedErrors** if some recipients were rejected then this property holds an array of error objects for the rejected recipients
    - **response** is the last response received from the server

### quit

Use it for graceful disconnect

```javascript
connection.quit();
```

### close

Use it for less graceful disconnect

```javascript
connection.close();
```

### reset

Use it to reset current session (invokes RSET command)

```javascript
connection.reset(callback);
```

## License

**MIT**
