var crypto = require('crypto');
var path = require('path');
var ReplaceSource = require('webpack-core/lib/ReplaceSource');

// https://www.w3.org/TR/2016/REC-SRI-20160623/#cryptographic-hash-functions
var standardHashFuncNames = ['sha256', 'sha384', 'sha512'];

function makePlaceholder(id) {
  return '*-*-*-CHUNK-SRI-HASH-' + id + '-*-*-*';
}

function WebIntegrityJsonpMainTemplatePlugin(sriPlugin, compilation) {
  this.sriPlugin = sriPlugin;
  this.compilation = compilation;
}

WebIntegrityJsonpMainTemplatePlugin.prototype.apply = function apply(mainTemplate) {
  var self = this;
  var allDepChunkIds = {};

  function findDepChunks(chunk) {
    chunk.chunks.forEach(function forEachChunk(depChunk) {
      if (!allDepChunkIds[depChunk.id]) {
        allDepChunkIds[depChunk.id] = true;
        findDepChunks(depChunk);
      }
    });
  }

  /*
   *  Patch jsonp-script code to add the integrity attribute.
   */
  mainTemplate.plugin('jsonp-script', function jsonpScriptPlugin(source) {
    if (!this.outputOptions.crossOriginLoading) {
      self.sriPlugin.error(
        self.compilation,
        'webpack option output.crossOriginLoading not set, code splitting will not work!'
      );
    }
    return this.asString([
      source,
      'script.integrity = sriHashes[chunkId];'
    ]);
  });

  /*
   *  Patch local-vars code to add a mapping from chunk ID to SRIs.
   *  Since SRIs haven't been computed at this point, we're using
   *  magic placeholders for SRI values and going to replace them
   *  later.
   */
  mainTemplate.plugin('local-vars', function localVarsPlugin(source, chunk) {
    if (chunk.chunks.length > 0) {
      findDepChunks(chunk);

      return this.asString([
        source,
        'var sriHashes = ' + JSON.stringify(
          Object.keys(allDepChunkIds).reduce(function chunkIdReducer(sriHashes, chunkId) {
            sriHashes[chunkId] = makePlaceholder(chunkId); // eslint-disable-line no-param-reassign
            return sriHashes;
          }, {})
        ) + ';'
      ]);
    }
    return source;
  });
};

function SubresourceIntegrityPlugin(options) {
  var useOptions;
  if (options === null || typeof options === 'undefined') {
    useOptions = {};
  } else if (typeof options === 'object') {
    useOptions = options;
  } else {
    throw new Error('webpack-subresource-integrity: argument must be an object');
  }

  this.options = {
    enabled: true
  };

  Object.assign(this.options, useOptions);

  this.emittedWarnings = {};
}

SubresourceIntegrityPlugin.prototype.emitMessage = function emitMessage(messages, message) {
  messages.push(new Error('webpack-subresource-integrity: ' + message));
};

SubresourceIntegrityPlugin.prototype.warnOnce = function warn(compilation, message) {
  if (!this.emittedWarnings[message]) {
    this.emittedWarnings[message] = true;
    this.emitMessage(compilation.warnings, message);
  }
};

SubresourceIntegrityPlugin.prototype.error = function error(compilation, message) {
  this.emitMessage(compilation.errors, message);
};

SubresourceIntegrityPlugin.prototype.validateOptions = function validateOptions(compilation) {
  var foundStandardHashFunc = false;
  var hashFuncName;
  var i;

  if (this.optionsValidated) {
    return;
  }
  this.optionsValidated = true;
  if (this.options.enabled && !compilation.compiler.options.output.crossOriginLoading) {
    this.warnOnce(
      compilation,
      'Set webpack option output.crossOriginLoading when using this plugin.');
  }
  if (!Array.isArray(this.options.hashFuncNames)) {
    this.error(
      compilation,
      'options.hashFuncNames must be an array of hash function names, ' +
        'instead got \'' + this.options.hashFuncNames + '\'.');
    this.options.enabled = false;
  } else {
    for (i = 0; i < this.options.hashFuncNames.length; i += 1) {
      hashFuncName = this.options.hashFuncNames[i];
      if (typeof hashFuncName !== 'string' &&
          !(hashFuncName instanceof String)) {
        this.error(
          compilation,
          'options.hashFuncNames must be an array of hash function names, ' +
            'but contained ' + hashFuncName + '.');
        this.options.enabled = false;
        return;
      }
      try {
        crypto.createHash(hashFuncName);
      } catch (error) {
        this.error(
          compilation,
          'Cannot use hash function \'' + hashFuncName + '\': ' +
            error.message);
        this.options.enabled = false;
        return;
      }
      if (standardHashFuncNames.indexOf(hashFuncName) >= 0) {
        foundStandardHashFunc = true;
      }
    }
    if (!foundStandardHashFunc) {
      this.warnOnce(
        compilation,
        'It is recommended that at least one hash function is part of the set ' +
          'for which support is mandated by the specification. ' +
          'These are: ' + standardHashFuncNames.join(', ') + '. ' +
          'See http://www.w3.org/TR/SRI/#cryptographic-hash-functions for more information.');
    }
  }
};

/*  Given a public URL path to an asset, as generated by
 *  HtmlWebpackPlugin for use as a `<script src>` or `<link href`> URL
 *  in `index.html`, return the path to the asset, suitable as a key
 *  into `compilation.assets`.
 */
SubresourceIntegrityPlugin.prototype.hwpAssetPath = function hwpAssetPath(src) {
  return path.relative(this.hwpPublicPath, src);
};

SubresourceIntegrityPlugin.prototype.apply = function apply(compiler) {
  var self = this;

  function computeIntegrity(source) {
    return self.options.hashFuncNames.map(function mapHashFuncName(hashFuncName) {
      var hash = crypto.createHash(hashFuncName).update(source, 'utf8').digest('base64');
      return hashFuncName + '-' + hash;
    }).join(' ');
  }

  compiler.plugin('after-plugins', function afterPlugins() {
    compiler.plugin('this-compilation', function thisCompilation(compilation) {
      self.validateOptions(compilation);

      if (!self.options.enabled) {
        return;
      }

      compilation.mainTemplate.apply(new WebIntegrityJsonpMainTemplatePlugin(self, compilation));

      /*
       *  Calculate SRI values for each chunk and replace the magic
       *  placeholders by the actual values.
       */
      compilation.plugin('after-optimize-assets', function optimizeAssetsPlugin(assets) {
        var hashByChunkId = {};
        var visitedByChunkId = {};
        var chunkFile;
        var oldSource;
        var magicMarker;
        var magicMarkerPos;
        var newAsset;
        var asset;
        var newSource;

        function processChunkRecursive(chunk) {
          var depChunkIds = [];

          if (visitedByChunkId[chunk.id]) {
            return [];
          }
          visitedByChunkId[chunk.id] = true;

          chunk.chunks.forEach(function mapChunk(depChunk) {
            depChunkIds = depChunkIds.concat(processChunkRecursive(depChunk));
          });

          if (chunk.files.length > 0) {
            chunkFile = chunk.files[0];

            oldSource = assets[chunkFile].source();

            if (oldSource.indexOf('webpackHotUpdate') >= 0) {
              self.warnOnce(
                compilation,
                'webpack-subresource-integrity may interfere with hot reloading. ' +
                  'Consider disabling this plugin in development mode.'
              );
            }

            newAsset = new ReplaceSource(assets[chunkFile]);

            depChunkIds.forEach(function forEachChunk(depChunkId) {
              magicMarker = makePlaceholder(depChunkId);
              magicMarkerPos = oldSource.indexOf(magicMarker);
              if (magicMarkerPos >= 0) {
                newAsset.replace(
                  magicMarkerPos,
                  (magicMarkerPos + magicMarker.length) - 1,
                  hashByChunkId[depChunkId]);
              }
            });

            // eslint-disable-next-line no-param-reassign
            assets[chunkFile] = newAsset;

            newSource = newAsset.source();
            newAsset.integrity = computeIntegrity(newSource);
            hashByChunkId[chunk.id] = newAsset.integrity;
          }
          return [chunk.id].concat(depChunkIds);
        }

        compilation.chunks.forEach(function forEachChunk(chunk) {
          // chunk.entry was removed in Webpack 2. Use hasRuntime()
          // for this check instead (if it exists)
          if (('hasRuntime' in chunk) ? chunk.hasRuntime() : chunk.entry) {
            processChunkRecursive(chunk);
          }
        });

        Object.keys(assets).forEach(function loop(assetKey) {
          asset = assets[assetKey];
          if (!asset.integrity) {
            asset.integrity = computeIntegrity(asset.source());
          }
        });
      });

      function getTagSrc(tag) {
        // Get asset path - src from scripts and href from links
        return tag.attributes.href || tag.attributes.src;
      }

      function filterTag(tag) {
        // Process only script and link tags with a url
        return (tag.tagName === 'script' || tag.tagName === 'link') && getTagSrc(tag);
      }

      function normalizePath(p) {
        return p.replace(/\?.*$/, '').split(path.sep).join('/');
      }

      function getIntegrityChecksumForAsset(src) {
        var normalizedSrc;
        var normalizedKey;
        var asset = compilation.assets[src];
        if (asset) {
          return asset.integrity;
        }
        normalizedSrc = normalizePath(src);
        normalizedKey = Object.keys(compilation.assets).find(function test(assetKey) {
          return normalizePath(assetKey) === normalizedSrc;
        });
        if (normalizedKey) {
          return compilation.assets[normalizedKey].integrity;
        }
        return null;
      }

      function alterAssetTags(pluginArgs, callback) {
        /* html-webpack-plugin has added an event so we can pre-process the html tags before they
           inject them. This does the work.
        */
        function processTag(tag) {
          var src = self.hwpAssetPath(getTagSrc(tag));
          var checksum = getIntegrityChecksumForAsset(src);
          if (!checksum) {
            self.warnOnce(
              compilation,
              'Cannot determine hash for asset \'' +
                src + '\', the resource will be unprotected.');
            return;
          }
          // Add integrity check sums

          /* eslint-disable no-param-reassign */
          tag.attributes.integrity = checksum;
          tag.attributes.crossorigin = compilation.compiler.options.output.crossOriginLoading || 'anonymous';
          /* eslint-enable no-param-reassign */
        }

        pluginArgs.head.filter(filterTag).forEach(processTag);
        pluginArgs.body.filter(filterTag).forEach(processTag);
        callback(null, pluginArgs);
      }

      /*  Add jsIntegrity and cssIntegrity properties to pluginArgs, to
       *  go along with js and css properties.  These are later
       *  accessible on `htmlWebpackPlugin.files`.
       */
      function beforeHtmlGeneration(pluginArgs, callback) {
        self.hwpPublicPath = pluginArgs.assets.publicPath;
        ['js', 'css'].forEach(function addIntegrity(fileType) {
          // eslint-disable-next-line no-param-reassign
          pluginArgs.assets[fileType + 'Integrity'] =
            pluginArgs.assets[fileType].map(function assetIntegrity(filePath) {
              return getIntegrityChecksumForAsset(self.hwpAssetPath(filePath));
            });
        });
        callback(null, pluginArgs);
      }

      /*
       *  html-webpack support:
       *    Modify the asset tags before webpack injects them for anything with an integrity value.
       */
      compilation.plugin('html-webpack-plugin-alter-asset-tags', alterAssetTags);
      compilation.plugin('html-webpack-plugin-before-html-generation', beforeHtmlGeneration);
    });
  });
};

module.exports = SubresourceIntegrityPlugin;
