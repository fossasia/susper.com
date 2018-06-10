# mailcomposer

**mailcomposer** is a Node.JS module for generating e-mail messages that can be streamed to SMTP or file.

> **NB!** This module is not backwards compatible with versions 0.x

[![Build Status](https://secure.travis-ci.org/andris9/mailcomposer.png)](http://travis-ci.org/andris9/mailcomposer)

## Support mailcomposer development

[![Donate to author](https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=DB26KWR2BQX5W)

## Installation

Install through NPM

    npm install mailcomposer

## Usage

### Include mailcomposer module

```javascript
var mailcomposer = require("mailcomposer");
```

### Create a new `MailComposer` instance

```javascript
var mail = mailcomposer(mailOptions);
```

Where `mailOptions` is an object that defines the components of the message, see below

## API

### createReadStream

To create a stream that outputs a raw rfc822 message from the defined input, use `createReadStream()`

```javascript
var mail = mailcomposer({from: '...', ...});
var stream = mail.createReadStream();
stream.pipe(process.stdout);
```

### build

To generate the message and return it with a callback use `build()`

```javascript
var mail = mailcomposer({from: '...', ...});
mail.build(function(err, message){
    process.stdout.write(message);
});
```

### E-mail message fields

The following are the possible fields of an e-mail message:

  - **from** - The e-mail address of the sender. All e-mail addresses can be plain `'sender@server.com'` or formatted `'Sender Name <sender@server.com>'`, see [here](#address-formatting) for details
  - **sender** - An e-mail address that will appear on the *Sender:* field
  - **to** - Comma separated list or an array of recipients e-mail addresses that will appear on the *To:* field
  - **cc** - Comma separated list or an array of recipients e-mail addresses that will appear on the *Cc:* field
  - **bcc** - Comma separated list or an array of recipients e-mail addresses that will appear on the *Bcc:* field
  - **replyTo** - An e-mail address that will appear on the *Reply-To:* field
  - **inReplyTo** - The message-id this message is replying
  - **references** - Message-id list (an array or space separated string)
  - **subject** - The subject of the e-mail
  - **text** - The plaintext version of the message as an Unicode string, Buffer, Stream or an object *{path: '...'}*
  - **html** - The HTML version of the message as an Unicode string, Buffer, Stream or an object *{path: '...'}*
  - **watchHtml** - Apple Watch specific HTML version of the message, same usage as with `text` and `html`
  - **icalEvent** - iCalendar event, same usage as with `text` and `html`. Event `method` attribute defaults to 'PUBLISH' or define it yourself: `{method: 'REQUEST', content: iCalString}`. This value is added as an additional alternative to html or text. Only utf-8 content is allowed
  - **headers** - An object or array of additional header fields (e.g. *{"X-Key-Name": "key value"}* or *[{key: "X-Key-Name", value: "val1"}, {key: "X-Key-Name", value: "val2"}]*)
  - **attachments** - An array of attachment objects  (see [below](#attachments) for details)
  - **alternatives** - An array of alternative text contents (in addition to text and html parts)  (see [below](#alternatives) for details)
  - **envelope** - optional SMTP envelope, if auto generated envelope is not suitable (see [below](#smtp-envelope) for details)
  - **messageId** - optional Message-Id value, random value will be generated if not set
  - **date** - optional Date value, current UTC string will be used if not set
  - **encoding** - optional transfer encoding for the textual parts
  - **raw** - if set then overwrites entire message output with this value. The value is not parsed, so you should still set address headers or the envelope value for the message to work
  - **textEncoding** - set explicitly which encoding to use for text parts (*quoted-printable* or *base64*). If not set then encoding is detected from text content (mostly ascii means *quoted-printable*, otherwise *base64*)
  - **disableUrlAccess** - if set to true then fails with an error when a node tries to load content from URL
  - **disableFileAccess** - if set to true then fails with an error when a node tries to load content from a file

All text fields (e-mail addresses, plaintext body, html body) use UTF-8 as the encoding.
Attachments are streamed as binary.

### Attachments

Attachment object consists of the following properties:

  * **filename** - filename to be reported as the name of the attached file, use of unicode is allowed. If you do not want to use a filename, set this value as `false`, otherwise a filename is generated automatically
  * **cid** - optional content id for using inline images in HTML message source. Using `cid` sets the default `contentDisposition` to `'inline'` and moves the attachment into a *multipart/related* mime node, so use it only if you actually want to use this attachment as an embedded image
  * **content** - String, Buffer or a Stream contents for the attachment
  * **encoding** - If set and `content` is string, then encodes the content to a Buffer using the specified encoding. Example values: `base64`, `hex`, `binary` etc. Useful if you want to use binary attachments in a JSON formatted e-mail object
  * **path** - path to a file or an URL (data uris are allowed as well) if you want to stream the file instead of including it (better for larger attachments)
  * **contentType** - optional content type for the attachment, if not set will be derived from the `filename` property
  * **contentTransferEncoding** - optional transfer encoding for the attachment, if not set it will be derived from the `contentType` property. Example values: `quoted-printable`, `base64`
  * **contentDisposition** - optional content disposition type for the attachment, defaults to 'attachment'
  * **headers** is an object of additional headers, similar to *message.headers* option `{'X-My-Header': 'value'}`
  * **raw** is an optional value that overrides entire node content in the mime message. If used then all other options set for this node are ignored. The value is either a string, a buffer, a stream or an attachment-like object (eg. provides `path` or `content`)

Attachments can be added as many as you want.

```javascript
var mailOptions = {
    ...
    attachments: [
        {   // utf-8 string as an attachment
            filename: 'text1.txt',
            content: 'hello world!'
        },
        {   // binary buffer as an attachment
            filename: 'text2.txt',
            content: new Buffer('hello world!','utf-8')
        },
        {   // file on disk as an attachment
            filename: 'text3.txt',
            path: '/path/to/file.txt' // stream this file
        },
        {   // filename and content type is derived from path
            path: '/path/to/file.txt'
        },
        {   // stream as an attachment
            filename: 'text4.txt',
            content: fs.createReadStream('file.txt')
        },
        {   // define custom content type for the attachment
            filename: 'text.bin',
            content: 'hello world!',
            contentType: 'text/plain'
        },
        {   // use URL as an attachment
            filename: 'license.txt',
            path: 'https://raw.github.com/andris9/Nodemailer/master/LICENSE'
        },
        {   // encoded string as an attachment
            filename: 'text1.txt',
            content: 'aGVsbG8gd29ybGQh',
            encoding: 'base64'
        },
        {   // data uri as an attachment
            path: 'data:text/plain;base64,aGVsbG8gd29ybGQ='
        }
    ]
}
```

### Alternatives

In addition to text and HTML, any kind of data can be inserted as an alternative content of the main body - for example a word processing document with the same text as in the HTML field. It is the job of the e-mail client to select and show the best fitting alternative to the reader. Usually this field is used for calendar events and such.

Alternative objects use the same options as [attachment objects](#attachments). The difference between an attachment and an alternative is the fact that attachments are placed into *multipart/mixed* or *multipart/related* parts of the message white alternatives are placed into *multipart/alternative* part.

**Usage example:**

```javascript
var mailOptions = {
    ...
    html: '<b>Hello world!</b>',
    alternatives: [
        {
            contentType: 'text/x-web-markdown',
            content: '**Hello world!**'
        }
    ]
}
```

Alternatives can be added as many as you want.

### Address Formatting

All the e-mail addresses can be plain e-mail addresses

```
foobar@blurdybloop.com
```

or with formatted name (includes unicode support)

```
"Ноде Майлер" <foobar@blurdybloop.com>
```

> Notice that all address fields (even `from`) are comma separated lists, so if you want to use a comma in the name part, make sure you enclose the name in double quotes: `"Майлер, Ноде" <foobar@blurdybloop.com>`

or as an address object (in this case you do not need to worry about the formatting, no need to use quotes etc.)

```
{
    name: 'Майлер, Ноде',
    address: 'foobar@blurdybloop.com'
}
```

All address fields accept comma separated list of e-mails or an array of
e-mails or an array of comma separated list of e-mails or address objects - use it as you like.
Formatting can be mixed.

```
...,
to: 'foobar@blurdybloop.com, "Ноде Майлер" <bar@blurdybloop.com>, "Name, User" <baz@blurdybloop.com>',
cc: ['foobar@blurdybloop.com', '"Ноде Майлер" <bar@blurdybloop.com>, "Name, User" <baz@blurdybloop.com>'],
bcc: ['foobar@blurdybloop.com', {name: 'Майлер, Ноде', address: 'foobar@blurdybloop.com'}]
...
```

You can even use unicode domains, these are automatically converted to punycode

```
'"Unicode Domain" <info@müriaad-polüteism.info>'
```

### SMTP envelope

SMTP envelope is usually auto generated from `from`, `to`, `cc` and `bcc` fields but
if for some reason you want to specify it yourself, you can do it with `envelope` property.

`envelope` is an object with the following params: `from`, `to`, `cc` and `bcc` just like
with regular mail options. You can also use the regular address format, unicode domains etc.

```javascript
mailOptions = {
    ...,
    from: 'mailer@kreata.ee',
    to: 'daemon@kreata.ee',
    envelope: {
        from: 'Daemon <deamon@kreata.ee>',
        to: 'mailer@kreata.ee, Mailer <mailer2@kreata.ee>'
    }
}
```

> Not all transports can use the `envelope` object, for example SES ignores it and uses the data from the From:, To: etc. headers.

### Using Embedded Images

Attachments can be used as embedded images in the HTML body. To use this feature, you need to set additional property of the attachment - `cid` (unique identifier of the file) which is a reference to the attachment file. The same `cid` value must be used as the image URL in HTML (using `cid:` as the URL protocol, see example below).

**NB!** the cid value should be as unique as possible!

```javascript
var mailOptions = {
    ...
    html: 'Embedded image: <img src="cid:unique@kreata.ee"/>',
    attachments: [{
        filename: 'image.png',
        path: '/path/to/file',
        cid: 'unique@kreata.ee' //same cid value as in the html img src
    }]
}
```

## License

**MIT**
