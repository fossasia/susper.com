# License Webpack Plugin

[![Build Status](https://api.travis-ci.org/xz64/license-webpack-plugin.svg?branch=master)](https://travis-ci.org/xz64/timestamp-microservice)

This webpack plugin finds all 3rd party libraries used in a webpack build whose
licenses match a given regex, and outputs the licenses for each package in your
webpack build directory.

## Installation
`npm install license-webpack-plugin --save-dev`

## Usage

First, import the plugin into your webpack configuration:

```javascript
var LicenseWebpackPlugin = require('license-webpack-plugin');
```
The plugin requires you to specify a regular expression for licenses to match
under the pattern property.


To use the plugin, simply add it to your webpack config's plugin list.

The below example matches MIT, ISC, and any license starting with BSD.
This example will also throw an error and terminate your build if it finds a
license containing GPL in it.

```javascript
new LicenseWebpackPlugin({
  pattern: /^(MIT|ISC|BSD.*)$/,
  unacceptablePattern: /GPL/,
  abortOnUnacceptableLicense: true
});
```

Below are all options that can be passed to the plugin:

* `pattern` A regular expression of license names to match. The license is read
  from the `license` property in `package.json` for each module used in your
  webpack output.
* `unacceptablePattern` A regular expression of license names that are
   unacceptable for the build.
* `abortOnUnacceptableLicense` Used only in conjunction with the
  `unacceptablePattern` option, setting this to `true` will cause the plugin to
  throw an error and abort the build if an unacceptable license is found.
* `filename` This is the output filename which gets written your webpack build
  directory. The default is `3rdpartylicenses.txt`.
* `includeUndefined` whether include packages without license or not. The default is `false`
* `addLicenseText` whether include license text to output file or not. The default is `true`
* `addUrl` whether include url to repository to output file or not. The default is `false`
* `licenseFilenames` A list of license filenames to match, in order of priority.
  The default is `['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'license',
  'license.md', 'license.txt']`
* `licenseTemplateDir` Directory containing .txt files corresponding to
  [SPDX license identifiers](https://spdx.org/licenses/). This directory is
  referred to when the plugin cannot find a license file per the
  `licenseFilenames` property. Typically you would clone the
  [SPDX master files repository](
  http://git.spdx.org/?p=license-list.git;a=summary) and use the resulting
  directory containing all the various license `.txt` as the
  `licenseTemplateDir` for the plugin.
* `licenseOverrides` An object whose keys are module names and values are
  filenames to use for the license file. Used when you want to override a
  license file for a particular module.
* `licenseTypeOverrides` An object whose keys are module names and values are
  SPDX license identifier strings (e.g. `'MIT'`). Allows you to override the
  license type for any module.
* `suppressErrors` (default: `false`) Set to `true` to avoid having the plugin write error messages to the console

If a license file cannot be found and `includeUndefined` property is set to `false`,
the plugin will write whatever the `license` property contains in the module's `package.json` and print an error.

## License
[ISC](https://opensource.org/licenses/ISC)
