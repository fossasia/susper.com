const isStream = require('is-stream')

/**
 * Creates an Attachment object.
 * @param {Object} options Buffer representing attachment data
 *                data  - one of:
 *                      - string representing the full file path
 *                      - buffer of the data
 *                      - readable interface (stream)
 *                filename - optionally the filename to be used for the attachment, should be used if passing
 *                           buffer or stream in the data param
 *                contentType - the content type for header info. Should be passed in if using stream for data
 *                knownLength - the known length of the data. Should be passed in if using stream for data
 * @constructor
 */
class Attachment {
  constructor (options) {
    const data = options.data

    if (data) {
      if (typeof data === 'string' || Buffer.isBuffer(data) || isStream(data)) {
        this.data = data
      }
    }

    this.filename = options.filename
    this.contentType = options.contentType
    this.knownLength = options.knownLength
  }

  getType () {
    if (this.data) {
      if (typeof this.data === 'string') {
        return 'path'
      } else if (Buffer.isBuffer(this.data)) {
        return 'buffer'
      } else if (isStream(this.data)) {
        return 'stream'
      }
    }

    return 'unknown'
  }
}

module.exports = Attachment
