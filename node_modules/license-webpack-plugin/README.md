# License Webpack Plugin

[![Build Status](https://api.travis-ci.org/xz64/license-webpack-plugin.svg?branch=master)](https://travis-ci.org/xz64/license-webpack-plugin)

This webpack plugin finds all 3rd party libraries used in a webpack build whose
licenses match a given regex, and outputs the licenses for each package in your
webpack build directory.

## :warning: SEEKING TESTERS :warning:
I am looking for some feedback on the next release, which allows more customizability. It can be installed using the `next` tag as shown below:

 `npm install license-webpack-plugin@next --save-dev`

See issue [#43](/../../issues/43) for more details about the next release.

## Installation
`npm install license-webpack-plugin --save-dev`

## Usage

First, import the plugin into your webpack configuration:

```javascript
var LicenseWebpackPlugin = require('license-webpack-plugin').LicenseWebpackPlugin;
```
The plugin requires you to specify a regular expression for licenses to match
under the pattern property.


To use the plugin, simply add it to your webpack config's plugin list.

The below example matches any license type.
This example will also throw an error and terminate your build if it finds a
license containing GPL in it.

```javascript
new LicenseWebpackPlugin({
  pattern: /.*/,
  unacceptablePattern: /GPL/,
  abortOnUnacceptableLicense: true
});
```

Below is an annotated list of options that can be passed along with their default values. Note all fields are optional unless noted otherwise.

```javascript
{
  pattern: undefined, // Required. regex of licenses to include.
  licenseFilenames: [ // list of filenames to search for in each package
    'LICENSE',
    'LICENSE.md',
    'LICENSE.txt',
    'license',
    'license.md',
    'license.txt',
    'LICENCE',
    'LICENCE.md',
    'LICENCE.txt',
    'licence',
    'licence.md',
    'licence.txt'
  ],
  perChunkOutput: true, // whether or not to generate output for each chunk, for just create one file with all the licenses combined
  outputTemplate: 'output.template.ejs'), // ejs template for rendering the licenses. The default one is contained in the license-webpack-plugin directory under node_modules
  outputFilename: '[name].licenses.txt', // output name. [name] refers to the chunk name here. Any properties of the chunk can be used here, such as [hash]. If perChunkOutput is false, the default value is 'licenses.txt'
  suppressErrors: false, // suppress error messages
  includePackagesWithoutLicense: false, // whether or not to include packages that are missing a license
  unacceptablePattern: undefined, // regex of unacceptable licenses
  abortOnUnacceptableLicense: false, // whether or not to abort the build if an unacceptable license is detected
  addBanner: false, // whether or not to add a banner to the beginning of all js files in the chunk indicating where the licenses are
  bannerTemplate: // ejs template string of how the banner shold appear at the beginning of each js file in the chunk. There is also a licenseInfo ejs variable you can use to output out the license information.
    '/*! 3rd party license information is available at <%- filename %> */',
  includedChunks: [], // array of chunk names for which license files should be produced
  excludedChunks: [], // array of chunk names for which license files should not be produced. If a chunk is both included and excluded, then it is ultimately excluded.
  additionalPackages: [], // array of additional packages to scan
  buildRoot: undefined, // project build root. If left blank, the plugin will try to guess where your build root is based on webpack's compilation information
  modulesDirectories: ['node_modules'], // directories to check for modules. Can be useful in case you organize your frontend and backend dependencies into separate directories.
  licenseTemplateDir: undefined, // directory containing sample license text files (e.g. MIT.txt) to use when a license file can't be found (default behavior just prints the license identifier). One place to get license files would be from https://github.com/spdx/license-list .
  licenseFileOverrides: undefined, // object whose keys are package names and values are license filenames. Useful in case a package has multiple license files and you want to pick a specific one.
  licenseTypeOverrides: undefined // object whose keys are package names and values are license types. Useful in case a package does not specify a license field in its package.json.
}
```

WARNING: If you are importing css from node\_modules indirectly via something like a sass `@import`, the package will not appear in your list. This is because libsass processes all `@import` statements before the css is provided to webpack. Thus webpack (and this plugin) will have no way to tell what css files were imported. You can work around this by directly importing css from node\_modules inside a javascript file. Alternatively, you can force a particular module to be in the output for all chunks by using the `additionalPackages` option.

## Build Instructions

```
npm install
npm run build
```

## Migration Guides

Migration guides for breaking changes are documented at [MIGRATION.md](MIGRATION.md).

## License
[ISC](https://opensource.org/licenses/ISC)
