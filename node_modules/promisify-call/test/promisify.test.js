import test from 'ava'

const promisifyCall = require('../')

function testFn (param, fn) {
  setTimeout(() => {
    if (param.toLowerCase() === 'error') {
      return fn(new Error(param))
    }
    return fn(null, param.toUpperCase())
  }, 50)
}

function uppercase (param, fn) {
  return promisifyCall(this, testFn, ...arguments)
}

function uppercase2 (param, fn) {
  return promisifyCall(this, testFn, param, fn)
}

test.cb('should properly return success value - callback', t => {
  uppercase('foo', (err, res) => {
    t.ifError(err)
    t.is(res, 'FOO')
    t.end()
  })
})

test.cb('should properly return error value - callback', t => {
  uppercase('error', (err, res) => {
    t.truthy(err)
    t.falsy(res)
    t.end()
  })
})

test.cb('should properly return success value - promised using then()', t => {
  uppercase('foo').then(res => {
    t.is(res, 'FOO')
    t.end()
  })
})

test.cb('should properly return error value - promised using then()', t => {
  uppercase('error').then(res => {
    t.falsy(res)
  }).catch(err => {
    t.truthy(err)
    t.end()
  })
})

test('should properly return success value - promised', async t => {
  t.plan(1)
  const res = await uppercase('foo')
  t.is(res, 'FOO')
})

test('should properly return error value - promised', async t => {
  t.throws(uppercase('error'))
})

test.cb('should properly return success value - callback - case 2', t => {
  uppercase2('foo', (err, res) => {
    t.ifError(err)
    t.is(res, 'FOO')
    t.end()
  })
})

test.cb('should properly return error value - callback - explicit pass', t => {
  uppercase2('error', (err, res) => {
    t.truthy(err)
    t.falsy(res)
    t.end()
  })
})

test.cb('should properly return success value - promised using then() - explicit pass', t => {
  uppercase2('foo').then(res => {
    t.is(res, 'FOO')
    t.end()
  })
})

test.cb('should properly return error value - promised using then() - explicit pass', t => {
  uppercase2('error').then(res => {
    t.falsy(res)
  }).catch(err => {
    t.truthy(err)
    t.end()
  })
})

test('should properly return success value - promised - explicit pass', async t => {
  t.plan(1)
  const res = await uppercase2('foo')
  t.is(res, 'FOO')
})

test('should properly return error value - promised - explicit pass', async t => {
  t.throws(uppercase2('error'))
})
