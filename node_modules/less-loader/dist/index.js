var less = require('less');
var pify = require('pify');
var processResult = require('./processResult');
var getOptions = require('./getOptions');

var render = pify(less.render.bind(less));

function lessLoader(source) {
  var loaderContext = this;
  var options = getOptions(loaderContext);
  var done = loaderContext.async();
  var isSync = typeof done !== 'function';

  if (isSync) {
    throw new Error('Synchronous compilation is not supported anymore. See https://github.com/webpack-contrib/less-loader/issues/84');
  }

  processResult(loaderContext, render(source, options));
}

module.exports = lessLoader;
//# sourceMappingURL=index.js.map