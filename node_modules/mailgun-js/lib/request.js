const https = require('https')
const http = require('http')
const ProxyAgent = require('proxy-agent')
const qs = require('querystring')
const fs = require('fs')
const Readable = require('stream').Readable
const FormData = require('form-data')
const Attachment = require('./attachment')
const retry = require('async').retry
const promisifyCall = require('promisify-call')

const debug = require('debug')('mailgun-js')

function isOk (i) {
  return typeof i !== 'undefined' && i !== null
}

function getDataValue (key, input) {
  if (isSpecialParam(key) && (typeof input === 'object')) {
    return JSON.stringify(input)
  } else if (typeof input === 'number' || typeof input === 'boolean') {
    return input.toString()
  }

  return input
}

function isSpecialParam (paramKey) {
  const key = paramKey.toLowerCase()

  return ((key === 'vars' || key === 'members' || key === 'recipient-variables') || (key.indexOf('v:') === 0))
}

function isMultiUnsubsribe (path, data) {
  return path.indexOf('/unsubscribes') && data && Array.isArray(data)
}

function prepareData (data) {
  const params = {}

  for (const key in data) {
    if (key !== 'attachment' && key !== 'inline' && isOk(data[key])) {
      const value = getDataValue(key, data[key])

      if (isOk(value)) {
        params[key] = value
      }
    } else {
      params[key] = data[key]
    }
  }

  return params
}

class Request {
  constructor (options) {
    this.host = options.host
    this.protocol = options.protocol
    this.port = options.port
    this.endpoint = options.endpoint
    this.auth = options.auth
    this.proxy = options.proxy
    this.timeout = options.timeout
    this.retry = options.retry || 1
  }

  _request (method, resource, data, fn) {
    let path = ''.concat(this.endpoint, resource)

    const params = prepareData(data)

    this.payload = ''

    const isMIME = path.indexOf('/messages.mime') >= 0

    this.headers = {}
    if (method === 'GET' || method === 'DELETE') {
      this.payload = qs.stringify(params)
      if (this.payload) path = path.concat('?', this.payload)
    } else {
      if (isMIME) {
        this.headers['Content-Type'] = 'multipart/form-data'
      } else if (method === 'POST' && isMultiUnsubsribe(path, data)) {
        this.headers['Content-Type'] = 'application/json'
      } else {
        this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }

      if (params && (params.attachment || params.inline || (isMIME && params.message))) {
        this.prepareFormData(params)
      } else {
        if (method === 'POST' && isMultiUnsubsribe(path, data)) {
          this.payload = JSON.stringify(data)
        } else {
          this.payload = qs.stringify(params)
        }

        if (this.payload) {
          this.headers['Content-Length'] = Buffer.byteLength(this.payload)
        } else {
          this.headers['Content-Length'] = 0
        }
      }
    }

    // check for MIME is true in case of messages GET
    if (method === 'GET' &&
      path.indexOf('/messages') >= 0 &&
      params && params.MIME === true) {
      this.headers.Accept = 'message/rfc2822'
    }

    debug('%s %s', method, path)

    const opts = {
      'hostname': this.host,
      'port': this.port,
      'protocol': this.protocol,
      path,
      method,
      'headers': this.headers,
      'auth': this.auth,
      'agent': false,
      'timeout': this.timeout
    }

    if (this.proxy) {
      opts.agent = new ProxyAgent(this.proxy)
    }

    if (typeof this.retry === 'object' || this.retry > 1) {
      retry(this.retry, (retryCb) => {
        this.callback = retryCb
        this.performRequest(opts)
      }, fn)
    } else {
      this.callback = fn
      this.performRequest(opts)
    }
  }

  request (method, resource, data, fn) {
    if (typeof data === 'function' && !fn) {
      fn = data
      data = {}
    }

    if (!data) {
      data = {}
    }

    return promisifyCall(this, this._request, method, resource, data, fn)
  }

  prepareFormData (data) {
    this.form = new FormData()

    for (const key in data) {
      if ({}.hasOwnProperty.call(data, key)) {
        const obj = data[key]

        if (isOk(obj)) {
          if (key === 'attachment' || key === 'inline') {
            if (Array.isArray(obj)) {
              for (let i = 0; i < obj.length; i++) {
                this.handleAttachmentObject(key, obj[i])
              }
            } else {
              this.handleAttachmentObject(key, obj)
            }
          } else if (key === 'message') {
            this.handleMimeObject(key, obj)
          } else if (Array.isArray(obj)) {
            obj.forEach((element) => {
              if (isOk(element)) {
                const value = getDataValue(key, element)

                if (isOk(value)) {
                  this.form.append(key, value)
                }
              }
            })
          } else {
            const value = getDataValue(key, obj)

            if (isOk(value)) {
              this.form.append(key, value)
            }
          }
        }
      }
    }

    this.headers = this.form.getHeaders()
  }

  handleMimeObject (key, obj) {
    if (typeof obj === 'string') {
      if (fs.existsSync(obj) && fs.statSync(obj).isFile()) {
        this.form.append('message', fs.createReadStream(obj))
      } else {
        this.form.append('message', Buffer.from(obj), {
          'filename': 'message.mime',
          'contentType': 'message/rfc822',
          'knownLength': obj.length
        })
      }
    } else if (obj instanceof Readable) {
      this.form.append('message', obj)
    }
  }

  handleAttachmentObject (key, obj) {
    if (!this.form) this.form = new FormData()

    if (Buffer.isBuffer(obj)) {
      debug('appending buffer to form data. key: %s', key)
      this.form.append(key, obj, {
        'filename': 'file'
      })
    } else if (typeof obj === 'string') {
      debug('appending stream to form data. key: %s obj: %s', key, obj)
      this.form.append(key, fs.createReadStream(obj))
    } else if ((typeof obj === 'object') && (obj.readable === true)) {
      debug('appending readable stream to form data. key: %s obj: %s', key, obj)
      this.form.append(key, obj)
    } else if ((typeof obj === 'object') && (obj instanceof Attachment)) {
      const attachmentType = obj.getType()

      if (attachmentType === 'path') {
        debug('appending attachment stream to form data. key: %s data: %s filename: %s', key, obj.data, obj.filename)
        this.form.append(key, fs.createReadStream(obj.data), {
          'filename': obj.filename || 'attached file'
        })
      } else if (attachmentType === 'buffer') {
        debug('appending attachment buffer to form data. key: %s filename: %s', key, obj.filename)
        const formOpts = {
          'filename': obj.filename || 'attached file'
        }

        if (obj.contentType) {
          formOpts.contentType = obj.contentType
        }

        if (obj.knownLength) {
          formOpts.knownLength = obj.knownLength
        }

        this.form.append(key, obj.data, formOpts)
      } else if (attachmentType === 'stream') {
        if (obj.knownLength && obj.contentType) {
          debug('appending attachment stream to form data. key: %s filename: %s', key, obj.filename)

          this.form.append(key, obj.data, {
            'filename': obj.filename || 'attached file',
            'contentType': obj.contentType,
            'knownLength': obj.knownLength
          })
        } else {
          debug('missing content type or length for attachment stream. key: %s', key)
        }
      }
    } else {
      debug('unknown attachment type. key: %s', key)
    }
  }

  handleResponse (res) {
    let chunks = ''
    let error

    res.on('data', (chunk) => {
      chunks += chunk
    })

    res.on('error', (err) => {
      error = err
    })

    res.on('end', () => {
      let body

      debug('response status code: %s content type: %s error: %s', res.statusCode, res.headers['content-type'], error)

      // FIXME: An ugly hack to overcome invalid response type in mailgun api (see http://bit.ly/1eF30fU).
      // We skip content-type validation for 'campaings' endpoint assuming it is JSON.
      const skipContentTypeCheck = res.req && res.req.path && res.req.path.match(/\/campaigns/)
      const isJSON = res.headers['content-type'] && res.headers['content-type'].indexOf('application/json') >= 0

      if (chunks && !error && (skipContentTypeCheck || isJSON)) {
        try {
          body = JSON.parse(chunks)
        } catch (e) {
          error = e
        }
      }

      if (process.env.DEBUG_MAILGUN_FORCE_RETRY) {
        error = new Error('Force retry error')
        delete process.env.DEBUG_MAILGUN_FORCE_RETRY
      }

      if (!error && res.statusCode !== 200) {
        let msg = body || chunks || res.statusMessage

        if (body) {
          msg = body.message || body.response
        }

        error = new Error(msg)
        error.statusCode = res.statusCode
      }

      return this.callback(error, body)
    })
  }

  performRequest (options) {
    const method = options.method

    if (this.form && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      let alreadyHandled = false
      this.form.submit(options, (err, res) => {
        if (alreadyHandled) {
          return
        }
        alreadyHandled = true

        if (err) {
          return this.callback(err)
        }

        return this.handleResponse(res)
      })
    } else {
      let req

      if (options.protocol === 'http:') {
        req = http.request(options, (res) => {
          return this.handleResponse(res)
        })
      } else {
        req = https.request(options, (res) => {
          return this.handleResponse(res)
        })
      }

      if (options.timeout) {
        req.setTimeout(options.timeout, () => {
          // timeout occurs
          req.abort()
        })
      }

      req.on('error', (e) => {
        return this.callback(e)
      })

      if (this.payload && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        req.write(this.payload)
      }

      req.end()
    }
  }
}

module.exports = Request
