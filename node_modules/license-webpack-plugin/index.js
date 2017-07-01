var path = require('path');
var fs = require('fs');
var objectAssign = require('object-assign');

var MODULE_DIR = 'node_modules';

function isThere(file) {
  var exists = true;
  try {
    fs.accessSync(file);
  }
  catch (e) {
    exists = false;
  }
  return exists;
}

var moduleReader = {
  isFromNodeModules: function(mod) {
    var jsFilePath = mod.resource;
    var modulePrefix = path.join(this.context, MODULE_DIR);
    return !!jsFilePath && jsFilePath.startsWith(modulePrefix);
  },
  readPackageJson: function(mod) {
    var pathName = path.join(this.context, MODULE_DIR, mod, 'package.json');
    var file = fs.readFileSync(pathName);
    return JSON.parse(file);
  },
  getModuleInfo: function(mod) {
    var packagejson = this.readPackageJson(mod);
    return packagejson;
  },
  extractLicense: function(packagejson, mod) {
    var overriddenLicense = this.licenseTypeOverrides[mod];
    if (overriddenLicense) {
      return overriddenLicense;
    }
    var license = packagejson.license;
    // add support license like `{type: '...', url: '...'}`
    if (license && license.type) {
      license = license.type;
    }
    // add support licenses like `[{type: '...', url: '...'}]`
    if (!license) {
      var licenses = packagejson.licenses;
      if (Array.isArray(licenses) && licenses[0].type) {
        license = licenses[0].type;
        this.errors.push(
          this.errorMessages['multiple-license-ambiguity']
          .replace('{0}', mod)
          .replace('{1}', license)
        );
      }
    }
    return license;
  },
  parseModuleInfo: function(mod) {
    var packagejson = this.moduleCache[mod];
    var license = this.licenseTypeCache[mod];
    return {
      name: mod,
      url: packagejson.repository && packagejson.repository.url,
      version: packagejson.version,
      license: license,
      licenseText: this.getLicenseText(mod, license)
    };
  },
  findPackageName: function(jsFilePath) {
    var tokens = jsFilePath
      .replace(path.join(this.context, MODULE_DIR) + path.sep, '')
      .split(path.sep);

    return (tokens[0].charAt(0) === '@') ? tokens.slice(0, 2).join('/') : tokens[0];
  },
  writeModuleInfo: function() {
    this.modules = Object.keys(this.moduleMap)
      .filter(function(mod) {
        if(mod.trim() === '') {
          return false;
        }
        var moduleInfo = this.getModuleInfo(mod);
        var license = this.extractLicense(moduleInfo, mod);
        var isMatching = this.pattern.test(license) || !license
          && this.includeUndefined;
        if (isMatching) {
          this.moduleCache[mod] = moduleInfo;
          this.licenseTypeCache[mod] = license;
        }
        return isMatching;
      }.bind(this))
      .map(this.parseModuleInfo.bind(this));
  },
  gatherModuleInfo: function(moduleStats) {
    var moduleMap = {};
    moduleStats
      .filter(this.isFromNodeModules.bind(this))
      .forEach(function(mod) {
        var moduleName = this.findPackageName(mod.resource);
        moduleMap[moduleName] = {};
      }.bind(this));
    this.moduleMap = moduleMap;
    this.writeModuleInfo();
  }
};

var licenseReader = {
  getLicenseText: function(mod, license) {
    var licenseText = '';
    var file =
      (this.licenseOverrides[mod] && isThere(this.licenseOverrides[mod])) ?
      this.licenseOverrides[mod] : this.findLicenseFile(mod);
    
    if(file) {
      licenseText = fs.readFileSync(file).toString('utf8');
    }
    else {
      licenseText = this.readLicenseTemplate(license);
      if(!licenseText) {
        this.errors.push(
          this.errorMessages['no-license-file']
            .replace('{0}', mod)
            .replace('{1}', license)
        );
      }
    }
    return licenseText;
  },
  findLicenseFile: function(mod) {
    var file;
    for(var i = 0; i < this.licenseFilenames.length; i++) {
      var licenseFile = path.join(this.context, MODULE_DIR, mod,
        this.licenseFilenames[i]);
      if(isThere(licenseFile)) {
        file = licenseFile;
        break;
      }
    }
    return file;
  },
  readLicenseTemplate: function(license) {
    var filename;
    if(!this.licenseTemplateCache[license]) {
      filename = path.join(this.licenseTemplateDir, license + '.txt');
      if(isThere(filename)) {
        this.licenseTemplateCache[license] =
          fs.readFileSync(filename).toString('utf8');
      }
    }
    return this.licenseTemplateCache[license];
  }
};

var licenseWriter = {
  format: function(mod) {
    var formatted = mod.name + '@' + mod.version + ' ' + mod.license;
    if (this.addUrl && !!mod.url) {
      formatted += ' ' + mod.url;
    }
    if (this.addLicenseText && !!mod.licenseText) {
      formatted += '\n' + mod.licenseText
    }
    return formatted;
  },
  compile: function() {
    return this.modules
      .reduce(function(prev, curr) {
        return prev + '\n\n' + this.format(curr);
      }.bind(this), '')
      .replace('\n\n', '');
  },
  write: function() {
    var outputText = this.compile();
    var destFile = path.join(this.outputPath, this.filename);

    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath);
    }

    fs.writeFileSync(destFile, outputText);
  }
};

var plugin = {
  errorMessages: {
    'no-pattern': 'Please specify a regular expression as the pattern property '
                + 'on the plugin options.',
    'no-license-file': 'Could not find a license file for {0}, defaulting to '
                     + 'license name found in package.json: {1}',
    'multiple-license-ambiguity': 'Package {0} contains multiple licenses, '
      + 'defaulting to first one: {1}. Use the licenseTypeOverrides option to '
      + 'specify a specific license for this module.'
  },
  apply: function(compiler) {
    compiler.plugin('done', function(stats) {
      this.outputPath = compiler.outputPath;
      this.context = compiler.context;

      this.gatherModuleInfo(stats.compilation.modules);
      this.write();

      this.errors.forEach(function(error) {
        if (!this.suppressErrors) {
          console.error('license-webpack-plugin: ' + error);
        }
      }, this);
    }.bind(this));
  }
};

var composedPlugin = objectAssign(
  {},
  plugin,
  moduleReader,
  licenseReader,
  licenseWriter
);

var instance = function() {
  return {
    modules: [],
    errors: [],
    filename: '3rdpartylicenses.txt',
    moduleCache: {},
    licenseTypeCache: {},
    addUrl: false,
    addLicenseText: true,
    includeUndefined: false,
    suppressErrors: false,
    licenseTemplateDir: __dirname,
    licenseTemplateCache: {},
    licenseTypeOverrides: {},
    licenseOverrides: {},
    licenseFilenames: [
      'LICENSE',
      'LICENSE.md',
      'LICENSE.txt',
      'license',
      'license.md',
      'license.txt'
    ]
  };
};

var licensePlugin = function(opts) {
  if(!opts || !opts.pattern || !(opts.pattern instanceof RegExp)) {
    throw new Error(plugin.errorMessages['no-pattern']);
  }
  objectAssign(this, composedPlugin, instance(), opts);
  this.apply = this.apply.bind(this);
};

module.exports = licensePlugin;
