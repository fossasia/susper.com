# nodemailer-fetch

Fetches HTTP URL contents for [nodemailer](https://github.com/nodemailer/nodemailer).

[![Build Status](https://secure.travis-ci.org/nodemailer/nodemailer-fetch.svg)](http://travis-ci.org/nodemailer/nodemailer-fetch)
<a href="http://badge.fury.io/js/nodemailer-fetch"><img src="https://badge.fury.io/js/nodemailer-fetch.svg" alt="NPM version" height="18"></a>

## Usage

```javascript
var fetch = require('nodemailer-fetch');
fetch('http://www.google.com/').pipe(process.stdout);
```

The method takes the destination URL as the first and optional options object as the second argument.

The defaults are the following:

  * Default method is GET
  * Basic auth is supported
  * Up to 5 redirects are followed (Basic auth gets lost after first redirect)
  * gzip is handled if present
  * Cookies are supported
  * No shared HTTP Agent
  * Invalid SSL certs are allowed. Can be overwritten with the `tls` option

### options

Possible options are the following:

  * **userAgent** a string defining the User Agent of the request (by default not set)
  * **cookie** a cookie string or an array of cookie strings where a cookie is the value used by 'Set-Cookie' header
  * **maxRedirects** how many redirects to allow (defaults to 5, set to 0 to disable redirects entirely)
  * **method** HTTP method to use, defaults to GET (if `body` is set defaults to POST)
  * **body** HTTP payload to send. If the value is an object it is converted to an *x-www-form-urlencoded* payload, other values are passed as is. Unlike authentication data payload and method is preserved between redirects
  * **contentType** optional content type for the HTTP payload. Defaults to *x-www-form-urlencoded*. If the value is `false` then Content-Type header is not set
  * **tls** optional object of TLS options
  * **timeout** (milliseconds) sets timeout for the connection. Returns an error if timeout occurs
  * **headers** custom headers as an object where key is the header key and value is either a string or an array of strings for multiple values

  ```javascript
  var fetch = require('nodemailer-fetch');
  fetch('http://www.google.com/', {
      cookie: [
          'cookie_name1=cookie_value1',
          'cookie_name2=cookie_value2; expires=Sun, 16 Jul 3567 06:23:41 GMT',
      ],
      userAgent: 'MyFetcher/1.0'
  }).pipe(process.stdout);
  ```

> Cookies are domain specific like normal browser cookies, so if a redirect happens to another domain, then cookies are not passed to it, HTTPS-only cookies are not passed to HTTP etc.

## License
**MIT**
