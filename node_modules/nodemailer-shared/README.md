# nodemailer-shared

Shared methods for the [Nodemailer](https://github.com/nodemailer/nodemailer) stack.

## Methods

  * `parseConnectionUrl(str)` parses a connection url into a nodemailer configuration object
  * `getLogger(options)` returns a bunyan compatible logger instance
  * `callbackPromise(resolve, reject)` returns a promise-resolving function suitable for using as a callback
  * `resolveContent(data, key, callback)` converts a key of a data object from stream/url/path to a buffer

## License

**MIT**
