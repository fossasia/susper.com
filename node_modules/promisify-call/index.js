const wc = require('with-callback')

/**
 * Promisifies the call to <code>fn</code> if appropriate given the arguments.
 * Calls the function <code>fn</code> either using callback style if last argument is a function.
 * If last argument is not a function, <code>fn</code> is called returning a promise.
 * This lets you create API that can be called in either fashions.
 * @param  {Object}   ctx  context / this
 * @param  {Function} fn   The function to call
 * @param  {arguments}   args Arguments
 * @return {undefined|*|Promise}  Promise if promisified
 */
function promisifyCall (ctx, fn) {
  const args = []
  args.push.apply(args, arguments)
  args.splice(0, 2)
  // check if last (callback) argument is being pased in explicitly
  // as it might be undefined or null, in which case we'll replace it
  const same = fn.length && args.length === fn.length
  const lastIndex = same ? fn.length - 1 : args.length - 1
  const lastArg = args && args.length > 0 ? args[lastIndex] : null
  const cb = typeof lastArg === 'function' ? lastArg : null

  if (cb) {
    return fn.apply(ctx, args)
  }

  return wc(callback => {
    same
      ? args[lastIndex] = callback
      : args.push(callback)
    fn.apply(ctx, args)
  })
}

module.exports = promisifyCall
