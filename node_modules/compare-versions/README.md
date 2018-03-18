# compare-versions

[![Build Status](https://img.shields.io/travis/omichelsen/compare-versions/master.svg)](https://travis-ci.org/omichelsen/compare-versions)
[![Coverage Status](https://coveralls.io/repos/omichelsen/compare-versions/badge.svg?branch=master&service=github)](https://coveralls.io/github/omichelsen/compare-versions?branch=master)

Compare [semver](http://semver.org/) version strings to find greater, equal or lesser. Runs in the browser as well as Node.js/React Native etc. Has no dependencies and is tiny (<600 bytes gzipped).

This library supports the full semver specification, including comparing versions with different number of digits like `1.0.0`, `1.0`, `1`, and pre-release versions like `1.0.0-alpha`. Also supports wildcards for minor and patch version like `1.0.x` or `1.0.*`. Any leading `v` is ignored. Numbers with leading zero is handled as normal numbers ignoring the zero.

## Install

Install with `npm` or `bower`:

```bash
$ npm install compare-versions --save
```

```bash
$ bower install compare-versions --save
```

## Usage

```javascript
var compareVersions = require('compare-versions');

compareVersions('10.1.8', '10.0.4'); //  1
compareVersions('10.0.1', '10.0.1'); //  0
compareVersions('10.1.1', '10.2.2'); // -1
```

Can also be used for sorting:

```javascript
var versions = [
    '1.5.19',
    '1.2.3',
    '1.5.5'
];
console.log(versions.sort(compareVersions));
```

Outputs:

```javascript
[
    '1.2.3',
    '1.5.5',
    '1.5.19'
]
```
