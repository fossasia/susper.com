const tsscmp = require('tsscmp')
const crypto = require('crypto')

const Attachment = require('./attachment')
const Request = require('./request')
const builder = require('./build')
const resources = require('./schema').definitions

const mailgunExpirey = 15 * 60 * 1000
const mailgunHashType = 'sha256'
const mailgunSignatureEncoding = 'hex'

class Mailgun {
  constructor (options) {
    if (!options.apiKey) {
      throw new Error('apiKey value must be defined!')
    }
    this.username = 'api'
    this.apiKey = options.apiKey
    this.publicApiKey = options.publicApiKey
    this.domain = options.domain
    this.auth = [this.username, this.apiKey].join(':')
    this.mute = options.mute || false
    this.timeout = options.timeout

    this.host = options.host || 'api.mailgun.net'
    this.endpoint = options.endpoint || '/v3'
    this.protocol = options.protocol || 'https:'
    this.port = options.port || 443
    this.retry = options.retry || 1

    if (options.proxy) {
      this.proxy = options.proxy
    }

    this.options = {
      'host': this.host,
      'endpoint': this.endpoint,
      'protocol': this.protocol,
      'port': this.port,
      'auth': this.auth,
      'proxy': this.proxy,
      'timeout': this.timeout,
      'retry': this.retry
    }

    this.mailgunTokens = {}
  }

  getDomain (method, resource) {
    let d = this.domain

    // filter out API calls that do not require a domain specified
    if ((resource.indexOf('/routes') >= 0) ||
      (resource.indexOf('/lists') >= 0) ||
      (resource.indexOf('/address') >= 0) ||
      (resource.indexOf('/domains') >= 0)) {
      d = ''
    } else if ((resource.indexOf('/messages') >= 0) &&
      (method === 'GET' || method === 'DELETE')) {
      d = `domains/${this.domain}`
    }

    return d
  }

  getRequestOptions (resource) {
    let o = this.options

    // use public API key if we have it for the routes that require it
    if ((resource.indexOf('/address/validate') >= 0 ||
        (resource.indexOf('/address/parse') >= 0)) &&
      this.publicApiKey) {
      const copy = Object.assign({}, this.options)

      copy.auth = [this.username, this.publicApiKey].join(':')
      o = copy
    }

    return o
  }

  request (method, resource, data, fn) {
    let fullpath = resource
    const domain = this.getDomain(method, resource)

    if (domain) {
      fullpath = '/'.concat(domain, resource)
    }

    const req = new Request(this.options)

    return req.request(method, fullpath, data, fn)
  }

  post (path, data, fn) {
    const req = new Request(this.options)

    return req.request('POST', path, data, fn)
  }

  get (path, data, fn) {
    const req = new Request(this.options)

    return req.request('GET', path, data, fn)
  }

  delete (path, data, fn) {
    const req = new Request(this.options)

    return req.request('DELETE', path, data, fn)
  }

  put (path, data, fn) {
    const req = new Request(this.options)

    return req.request('PUT', path, data, fn)
  }

  validateWebhook (timestamp, token, signature) {
    const adjustedTimestamp = parseInt(timestamp, 10) * 1000
    const fresh = (Math.abs(Date.now() - adjustedTimestamp) < mailgunExpirey)

    if (!fresh) {
      if (!this.mute) {
        console.error('[mailgun] Stale Timestamp: this may be an attack')
        console.error('[mailgun] However, this is most likely your fault\n')
        console.error('[mailgun] run `ntpdate ntp.ubuntu.com` and check your system clock\n')
        console.error(`[mailgun] System Time: ${new Date().toString()}`)
        console.error(`[mailgun] Mailgun Time: ${new Date(adjustedTimestamp).toString()}`, timestamp)
        console.error(`[mailgun] Delta: ${Date.now() - adjustedTimestamp}`)
      }

      return false
    }

    if (this.mailgunTokens[token]) {
      if (!this.mute) {
        console.error('[mailgun] Replay Attack')
      }

      return false
    }

    this.mailgunTokens[token] = true

    const tokenTimeout = setTimeout(() => {
      delete this.mailgunTokens[token]
    }, mailgunExpirey + (5 * 1000))

    tokenTimeout.unref()

    return tsscmp(
      signature, crypto.createHmac(mailgunHashType, this.apiKey)
        .update(Buffer.from(timestamp + token, 'utf-8'))
        .digest(mailgunSignatureEncoding)
    )
  }

  validate (address, isPrivate, opts, fn) {
    if (typeof opts === 'function') {
      fn = opts
      opts = {}
    }

    if (typeof isPrivate === 'object') {
      opts = isPrivate
      isPrivate = false
    }

    if (typeof isPrivate === 'function') {
      fn = isPrivate
      isPrivate = false
      opts = {}
    }

    let resource = '/address/validate'

    if (isPrivate) {
      resource = '/address/private/validate'
    }

    const options = this.getRequestOptions(resource)

    const req = new Request(options)
    const data = Object.assign({}, {
      address
    }, opts)

    return req.request('GET', resource, data, fn)
  }

  parse (addresses, isPrivate, opts, fn) {
    if (typeof opts === 'function') {
      fn = opts
      opts = {}
    }

    if (typeof isPrivate === 'object') {
      opts = isPrivate
      isPrivate = false
    }

    if (typeof isPrivate === 'function') {
      fn = isPrivate
      isPrivate = false
      opts = {}
    }

    let resource = '/address/parse'

    if (isPrivate) {
      resource = '/address/private/parse'
    }

    const options = this.getRequestOptions(resource)

    const req = new Request(options)
    const data = Object.assign({}, {
      addresses
    }, opts)

    return req.request('GET', resource, data, fn)
  }
}

builder.build(Mailgun, resources)

Mailgun.prototype.Attachment = Attachment

Mailgun.prototype.Mailgun = Mailgun

function create (options) {
  return new Mailgun(options)
}

module.exports = create
