'use strict';

const path = require('path');
const minimatch = require('minimatch');

function fixWebpackFilePath(filePath) {
  const isWin = process.platform.startsWith('win');

  if (filePath.indexOf('!') !== -1) {
    filePath = filePath.split('!').pop();
  }

  if (filePath.indexOf('?') !== -1) {
    filePath = filePath.split('?')[0];
  }

  // Workaround for https://github.com/mattlewis92/karma-coverage-istanbul-reporter/issues/9
  if (isWin) {
    filePath = filePath.replace(/\\/g, '/');
  }

  return filePath;
}

function fixWebpackSourcePaths(sourceMap) {
  return Object.assign({}, sourceMap, {
    sources: (sourceMap.sources || []).map(source => {
      source = fixWebpackFilePath(source);
      if (sourceMap.sourceRoot && source.startsWith(sourceMap.sourceRoot)) {
        source = source.replace(sourceMap.sourceRoot, '');
      }
      return source;
    })
  });
}

function isAbsolute(file) {
  if (path.isAbsolute) {
    return path.isAbsolute(file);
  }

  return path.resolve(file) === path.normalize(file);
}

function normalize(key, basePath) {
  // Exclude keys will always be relative, but covObj keys can be absolute or relative
  let excludeKey = isAbsolute(key) ? path.relative(basePath, key) : key;
  // Also normalize for files that start with `./`, etc.
  excludeKey = path.normalize(excludeKey);

  return excludeKey;
}

function overrideThresholds(key, overrides, basePath) {
  let thresholds = {};

  // First match wins
  Object.keys(overrides).some(pattern => {
    if (minimatch(normalize(key, basePath), pattern, {dot: true})) {
      thresholds = overrides[pattern];
      return true;
    }
    return false;
  });

  return thresholds;
}

module.exports.fixWebpackSourcePaths = fixWebpackSourcePaths;
module.exports.fixWebpackFilePath = fixWebpackFilePath;
module.exports.overrideThresholds = overrideThresholds;
