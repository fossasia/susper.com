let path = require('path')
let extend = require('util')._extend
let BASE_ERROR = 'Circular dependency detected:\r\n'

class CircularDependencyPlugin {
  constructor(options) {
    this.options = extend({
      exclude: new RegExp('$^'),
      failOnError: false,
      onDetected: false,
      cwd: process.cwd()
    }, options)
  }

  apply(compiler) {
    let plugin = this
    let cwd = this.options.cwd

    compiler.plugin('compilation', (compilation) => {
      compilation.plugin('optimize-modules', (modules) => {
        for (let module of modules) {
          if (module.resource === undefined) { continue }
          let maybeCyclicalPathsList = this.isCyclic(module, module, {})
          if (maybeCyclicalPathsList) {
            // allow consumers to override all behavior with onDetected
            if (plugin.options.onDetected) {
              try {
                plugin.options.onDetected({
                  module: module,
                  paths: maybeCyclicalPathsList,
                  compilation: compilation
                })
              } catch(err) {
                compilation.errors.push(err)
              }
              continue
            }

            // exclude modules based on regex test
            if (plugin.options.exclude.test(module.resource)) {
              continue
            }

            // mark warnings or errors on webpack compilation
            let error = new Error(BASE_ERROR.concat(maybeCyclicalPathsList.join(' -> ')))
            if (plugin.options.failOnError) {
              compilation.errors.push(error)
            } else {
              compilation.warnings.push(error)
            }
          }
        }
      })
    })
  }

  isCyclic(initialModule, currentModule, seenModules) {
    let cwd = this.options.cwd

    // Add the current module to the seen modules cache
    seenModules[currentModule.debugId] = true

    // If the modules aren't associated to resources
    // it's not possible to display how they are cyclical
    if (!currentModule.resource || !initialModule.resource) {
      return false
    }

    // Iterate over the current modules dependencies
    for (let dependency of currentModule.dependencies) {
      let depModule = dependency.module
      if (!depModule) { continue }

      if (depModule.debugId in seenModules) {
        if (depModule.debugId === initialModule.debugId) {
          // Initial module has a circular dependency
          return [
            path.relative(cwd, currentModule.resource),
            path.relative(cwd, depModule.resource)
          ]
        }
        // Found a cycle, but not for this module
        continue
      }

      let maybeCyclicalPathsList = this.isCyclic(initialModule, depModule, seenModules)
      if (maybeCyclicalPathsList) {
        maybeCyclicalPathsList.unshift(path.relative(cwd, currentModule.resource))
        return maybeCyclicalPathsList
      }
    }

    return false
  }
}

module.exports = CircularDependencyPlugin
