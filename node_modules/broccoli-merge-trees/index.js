var Plugin = require('broccoli-plugin')
var MergeTrees = require('merge-trees')

module.exports = BroccoliMergeTrees
BroccoliMergeTrees.prototype = Object.create(Plugin.prototype)
BroccoliMergeTrees.prototype.constructor = BroccoliMergeTrees
function BroccoliMergeTrees(inputNodes, options) {
  if (!(this instanceof BroccoliMergeTrees)) return new BroccoliMergeTrees(inputNodes, options)
  options = options || {}
  var name = 'broccoli-merge-trees:' + (options.annotation || '')
  if (!Array.isArray(inputNodes)) {
    throw new TypeError(name + ': Expected array, got: [' + inputNodes +']')
  }
  Plugin.call(this, inputNodes, {
    persistentOutput: true,
    needsCache: false,
    annotation: options.annotation
  })
  this.options = options
}

BroccoliMergeTrees.prototype.build = function() {
  if (this.mergeTrees == null) {
    // Defer instantiation until the first build because we only
    // have this.inputPaths and this.outputPath once we build.
    this.mergeTrees = new MergeTrees(this.inputPaths, this.outputPath, {
      overwrite: this.options.overwrite,
      annotation: this.options.annotation
    })
  }

  this.mergeTrees.merge()
}
