# buildmail

Low level rfc2822 message composer that streams output. Define your own mime tree, no magic included.

Ported from [MailBuild](https://github.com/whiteout-io/mailbuild) of the [emailjs.org](http://emailjs.org/) project. This port uses similar API but is for Node only and streams the output.

[![Build Status](https://secure.travis-ci.org/nodemailer/buildmail.svg)](http://travis-ci.org/nodemailer/buildmail)
<a href="http://badge.fury.io/js/buildmail"><img src="https://badge.fury.io/js/buildmail.svg" alt="NPM version" height="18"></a>

## Usage

Install with npm

    npm install buildmail

Require in your scripts

```javascript
var BuildMail = require('buildmail');
```

## API

Create a new `BuildMail` object with

```javascript
var builder = new BuildMail(contentType [, options]);
```

Where

  * **contentType** - define the content type for created node. Can be left blank for attachments (content type derived from `filename` option if available)
  * **options** - an optional options object
    * **filename** - *String* filename for an attachment node
    * **baseBoundary** - *String* shared part of the unique multipart boundary (generated randomly if not set)
    * **keepBcc** - *Boolean* If true keep the Bcc value in generated headers (default is to remove it)
    * **textEncoding** - set default content encoding, either 'base64' or 'quoted-printable'
    * **hostname** - optional hostname for default Message-Id values. Normally hostname from the `from` address is used but this might not be available
    * **disableUrlAccess** - if set to true then fails with an error when a node tries to load content from URL
    * **disableFileAccess** - if set to true then fails with an error when a node tries to load content from a file

## Methods

The same methods apply to the root node created with `new BuildMail()` and to any child nodes.

### createChild

Creates and appends a child node to the node object

```javascript
node.createChild(contentType, options)
```

The same arguments apply as with `new BuildMail()`. Created node object is returned.

**Example**

```javascript
new BuildMail('multipart/mixed').
    createChild('multipart/related').
        createChild('text/plain');
```

Generates the following mime tree:

```
multipart/mixed
  ↳ multipart/related
      ↳ text/plain
```

### appendChild

Appends an existing child node to the node object. Removes the node from an existing tree if needed.

```javascript
node.appendChild(childNode)
```

Where

  * **childNode** - child node to be appended

Method returns appended child node.

**Example**

```javascript
var childNode = new BuildMail('text/plain'),
    rootNode = new BuildMail('multipart/mixed');
rootnode.appendChild(childNode);
```

Generates the following mime tree:

```
multipart/mixed
  ↳ text/plain
```

## replace

Replaces current node with another node

```javascript
node.replace(replacementNode)
```

Where

  * **replacementNode** - node to replace the current node with

Method returns replacement node.

**Example**

```javascript
var rootNode = new BuildMail('multipart/mixed'),
    childNode = rootNode.createChild('text/plain');
childNode.replace(new BuildMail('text/html'));
```

Generates the following mime tree:

```
multipart/mixed
  ↳ text/html
```

## remove

Removes current node from the mime tree. Does not make a lot of sense for a root node.

```javascript
node.remove();
```

Method returns removed node.

**Example**

```javascript

var rootNode = new BuildMail('multipart/mixed'),
    childNode = rootNode.createChild('text/plain');
childNode.remove();
```

Generates the following mime tree:

```
multipart/mixed
```

## setHeader

Sets a header value. If the value for selected key exists, it is overwritten.

You can set multiple values as well by using `[{key:'', value:''}]` or
`{key: 'value'}` structures as the first argument.

```javascript
node.setHeader(key, value);
```

Where

  * **key** - *String|Array|Object* Header key or a list of key value pairs
  * **value** - *String* Header value

Method returns current node.

**Example**

```javascript
new BuildMail('text/plain').
    setHeader('content-disposition', 'inline').
    setHeader({
        'content-transfer-encoding': '7bit'
    }).
    setHeader([
        {key: 'message-id', value: 'abcde'}
```

Generates the following header:

```
Content-type: text/plain
Content-Disposition: inline
Content-Transfer-Encoding: 7bit
Message-Id: <abcde>
```

## addHeader

Adds a header value. If the value for selected key exists, the value is appended
as a new field and old one is not touched.

You can set multiple values as well by using `[{key:'', value:''}]` or
`{key: 'value'}` structures as the first argument.

```javascript
node.addHeader(key, value);
```

Where

  * **key** - *String|Array|Object* Header key or a list of key value pairs
  * **value** - *String* Header value or an array of strings to add the same key multiple times

Method returns current node.

**Example**

```javascript
new BuildMail('text/plain').
    addHeader('X-Spam', '1').
    setHeader({
        'x-spam': '2'
    }).
    setHeader([
        {key: 'x-spam', value: '3'}
    ]);
```

Generates the following header:

```
Content-type: text/plain
X-Spam: 1
X-Spam: 2
X-Spam: 3
```

## Prepared headers

Normally all headers are encoded and folded to meet the requirement of having plain-ASCII messages with lines no longer than 78 bytes. Sometimes it is preferable to not modify header values and pass these as provided. This can be achieved with the `prepared` option:

```javascript
new BuildMail('text/plain').
    addHeader('X-Long-Header', {
        prepared: true,
        value: 'a really long header or value with non-ascii characters 👮'
    });

// normal output:
// X-Long-Header: a really long header or value with non-ascii characters
//  =?UTF-8?Q?=F0=9F=91=AE?=

// output with the prepared option:
// X-Long-Header: a really long header or value with non-ascii characters 👮
```

## getHeader

Retrieves the first mathcing value of a selected key

```javascript
node.getHeader(key)
```

Where

  * **key** - *String* Key to search for

**Example**

```javascript
new BuildMail('text/plain').getHeader('content-type'); // text/plain
```

## buildHeaders

Builds the current header info into a header block that can be used in an e-mail

```javascript
var headers = node.buildHeaders()
```

**Example**

```javascript
new BuildMail('text/plain').
    addHeader('X-Spam', '1').
    setHeader({
        'x-spam': '2'
    }).
    setHeader([
        {key: 'x-spam', value: '3'}
    ]).buildHeaders();
```

returns the following String

```
Content-Type: text/plain
X-Spam: 3
Date: Sat, 21 Jun 2014 10:52:44 +0000
Message-Id: <1403347964894-790a5296-0eb7c7c7-6440334f@localhost>
MIME-Version: 1.0
```

If the node is the root node, then `Date` and `Message-Id` values are generated automatically if missing

## setContent

Sets body content for current node. If the value is a string and Content-Type is text/* then charset is set automatically.
If the value is a Buffer or a Stream you need to specify the charset yourself.

```javascript
node.setContent(body)
```

Where

  * **body** - *String|Buffer|Stream|Object* body content

If the value is an object, it should include one of the following properties

  * **path** - path to a file that will be used as the content
  * **href** - URL that will be used as the content

**Example**

```javascript
new BuildMail('text/plain').setContent('Hello world!');

new BuildMail('text/plain; charset=utf-8').setContent(fs.createReadStream('message.txt'));
```

## setRaw

Sets pre-generated output value for current node. When building the final message
then this value is returned instead of building a fresh rfc822 mime message from
normal input.

This also means that other methods (`getAddresses`, `getEnvelope` etc.) that use normal
input do not return valid values as the raw message is not parsed. You must set
envelope contents manually with `setEnvelope` and you probably should set the
*Message-Id* header (even though it wouldn't break anything if you would not set it).

```javascript
node.setRaw(message)
```

Where

  * **message** - *String|Buffer|Stream|Object* MIME message

If the value is an object, it should include one of the following properties

  * **path** - path to a file that will be used as the content
  * **href** - URL that will be used as the content

**Example**

```javascript
new BuildMail().setRaw(fs.createReadStream('message.eml'));
```


## build

Builds the rfc2822 message from the current node. If this is a root node, mandatory header fields are set if missing (Date, Message-Id, MIME-Version)

```javascript
node.build(callback)
```

Callback returns the rfc2822 message as a Buffer

**Example**

```javascript
new BuildMail('text/plain').setContent('Hello world!').build(function(err, mail){
    console.log(mail.toString('ascii'));
});
```

Returns the following string:

```
Content-type: text/plain
Date: <current datetime>
Message-Id: <generated value>
MIME-Version: 1.0

Hello world!
```

## createReadStream

If you manage large attachments you probably do not want to generate but stream the message.

```javascript
var stream = node.createReadStream(options)
```

Where

  * **options** - *Object* optional Stream options (ie. `highWaterMark`)

**Example**

```javascript
var message = new BuildMail();
message.addHeader({
    from: 'From <from@example.com>',
    to: 'receiver1@example.com',
    cc: 'receiver2@example.com'
});
message.setContent(fs.createReadStream('message.txt'));
message.createReadStream().pipe(fs.createWriteStream('message.eml'));
```

## transform

If you want to modify the created stream, you can add transform streams that the output will be piped through.

```javascript
node.transform(transformStream)
```

Where

  * **transformStream** - *Stream* or *Function* Transform stream that the output will go through before returing with `createReadStream`. If the value is a function the function should return a transform stream object when called.

**Example**

```javascript
var PassThrough = require('stream').PassThrough;
var message = new BuildMail();
message.addHeader({
    from: 'From <from@example.com>',
    to: 'receiver1@example.com',
    cc: 'receiver2@example.com'
});
message.setContent(fs.createReadStream('message.txt'));
message.transform(new PassThrough()); // add a stream that the output will be piped through
message.createReadStream().pipe(fs.createWriteStream('message.eml'));
```

## setEnvelope

Set envelope object to use. If one is not set, it is generated based ong the headers.

```javascript
node.setEnvelope(envelope)
```

Where

  * **envelope** is an envelope object in the form of `{from:'address', to: ['addresses']}`

## getEnvelope

Generates a SMTP envelope object. Makes sense only for root node.

```javascript
var envelope = node.generateEnvelope()
```

Method returns the envelope in the form of `{from:'address', to: ['addresses']}`

**Example**

```javascript
new BuildMail().
    addHeader({
        from: 'From <from@example.com>',
        to: 'receiver1@example.com',
        cc: 'receiver2@example.com'
    }).
    getEnvelope();
```

Returns the following object:

```javascript
{
    from: 'from@example.com',
    to: ['receiver1@example.com', 'receiver2@example.com']
}
```

## messageId

Returns Message-Id value. If it does not exist then generates one.

```javascript
var messageId = node.messageId();
```

Method returns the Message-Id value `<unique-message-id@example.com`

**Example**

```javascript
new BuildMail().
    addHeader({
        from: 'From <from@example.com>'
    }).
    messageId();
```

Returns the following value:

```javascript
"<1453237212620-0657660b-8df9255d-18bcdcb5@example.com>"
```

## getAddresses

Returns an address container object. Includes all parsed addresses from From, Sender, To, Cc, Bcc and Reply-To fields.

While `getEnvelope()` returns 'from' value as a single address (the first one encountered) then `getAddresses` return all values as arrays, including `from`. Additionally while `getEnvelope` returns only `from` and a combined `to` value then `getAddresses` returns all fields separately.

Possbile return values (all arrays in the form of `[{name:'', address:''}]`):

  * **from**
  * **sender**
  * **'reply-to'**
  * **to**
  * **cc**
  * **bcc**

If no addresses were found for a particular field, the field is not set in the response object.

**Example**

```javascript
new BuildMail().
    addHeader({
        from: 'From <from@example.com>',
        to: '"Receiver" receiver1@example.com',
        cc: 'receiver2@example.com'
    }).
    getAddresses();
```

Returns the following object:

```javascript
{
    from: [{
        name: 'From',
        address: 'from@example.com'
    }],
    to: [{
        name: 'Receiver',
        address: 'receiver1@example.com'
    }],
    cc: [{
        name: '',
        address: 'receiver2@example.com'
    }]
}
```

## Notes

### Addresses

When setting address headers (`From`, `To`, `Cc`, `Bcc`) use of unicode is allowed. If needed
the addresses are converted to punycode automatically.

### Attachments

For attachments you should minimally set `filename` option and `Content-Disposition` header. If filename is specified, you can leave content type blank - if content type is not set, it is detected from the filename.

```javascript
new BuildMail('multipart/mixed').
  createChild(false, {filename: 'image.png'}).
  setHeader('Content-Disposition', 'attachment');
```

Obviously you might want to add `Content-Id` header as well if you want to reference this attachment from the HTML content.

### MIME structure

Most probably you only need to deal with the following multipart types when generating messages:

  * **multipart/alternative** - includes the same content in different forms (usually text/plain + text/html)
  * **multipart/related** - includes main node and related nodes (eg. text/html + referenced attachments). Also requires a `type` parameter that indicates the Content-Type of the *root* element in the node
  * **multipart/mixed** - includes other multipart nodes and attachments, or single content node and attachments

**Examples**

One content node and an attachment

```
multipart/mixed
  ↳ text/plain
  ↳ image/png
```

Content node with referenced attachment (eg. image with `Content-Type` referenced by `cid:` url in the HTML)

```
multipart/related
  ↳ text/html
  ↳ image/png
```

Plaintext and HTML alternatives

```
multipart/alternative
  ↳ text/html
  ↳ text/plain
```

One content node with referenced attachment and a regular attachment

```
multipart/mixed
  ↳ multipart/related
    ↳ text/plain
    ↳ image/png
  ↳ application/x-zip
```

Alternative content with referenced attachment for HTML and a regular attachment

```
multipart/mixed
  ↳ multipart/alternative
    ↳ text/plain
    ↳ multipart/related
      ↳ text/html
      ↳ image/png
  ↳ application/x-zip
```

## License

**MIT**
