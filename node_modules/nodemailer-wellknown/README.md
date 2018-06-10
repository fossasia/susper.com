# Nodemailer Well-Known Services

Returns SMTP configuration for well-known services

## Usage

Install with npm

    npm install nodemailer-wellknown

Require in your script

```javascript
var wellknown = require('nodemailer-wellknown');
```

Resolve SMTP settings

```javascript
var config = wellknown('Gmail');
// { host: 'smtp.gmail.com',
//   port: 465,
//   secure: true }
```

## Supported services

Service names are case insensitive

  * **'1und1'**
  * **'AOL'**
  * **'DebugMail.io'**
  * **'DynectEmail'**
  * **'FastMail'**
  * **'GandiMail'**
  * **'Gmail'**
  * **'Godaddy'**
  * **'GodaddyAsia'**
  * **'GodaddyEurope'**
  * **'hot.ee'**
  * **'Hotmail'**
  * **'iCloud'**
  * **'mail.ee'**
  * **'Mail.ru'**
  * **'Mailgun'**
  * **'Mailjet'**
  * **'Mandrill'**
  * **'Naver'**
  * **'OpenMailBox'**
  * **'Postmark'**
  * **'QQ'**
  * **'QQex'**
  * **'SendCloud'**
  * **'SendGrid'**
  * **'SES'**
  * **'SES-US-EAST-1'**
  * **'SES-US-WEST-2'**
  * **'SES-EU-WEST-1'**
  * **'Sparkpost'**
  * **'Yahoo'**
  * **'Yandex'**
  * **'Zoho'**

### Example usage with Nodemailer

> **NB!** This repo might be updated more often than Nodemailer itself, so in case
> a wellknown host is not working, check that you have the latest version of
> nodemailer-wellknown installed in your node_modules. Otherwise the data you try
> to use might be still missing.

```javascript
var transporter = nodemailer.createTransport({
     service: 'postmark' // <- resolved as 'Postmark' from the wellknown info
     auth: {...}
});
```

## License

**MIT**
