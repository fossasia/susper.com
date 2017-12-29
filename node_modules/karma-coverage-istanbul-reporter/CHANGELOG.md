# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.3.3"></a>
## [1.3.3](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/compare/v1.3.1...v1.3.3) (2017-12-26)


### Bug Fixes

* don't prepend the webpack context to absolute source roots ([138e8f8](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/commit/138e8f8)), closes [#33](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/issues/33)



<a name="1.3.1"></a>
## [1.3.1](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/compare/v1.3.0...v1.3.1) (2017-12-23)


### Bug Fixes

* prepend the webpack context to the source root if not set ([4138b80](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/commit/4138b80)), closes [#32](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/issues/32)



<a name="1.3.0"></a>
# [1.3.0](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/compare/v1.2.1...v1.3.0) (2017-05-26)


### Features

* **thresholds:** allow overriding per file thresholds ([1a894f0](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/commit/1a894f0)), closes [#20](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/issues/20)
* **thresholds:** allow threshold logs not to be emitted as errors ([2de647c](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/commit/2de647c)), closes [#19](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/issues/19)



<a name="1.2.1"></a>
## [1.2.1](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/compare/v1.2.0...v1.2.1) (2017-04-30)


### Bug Fixes

* don't throw when there are no sources as part of the sourcemap ([4fc5311](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/commit/4fc5311)), closes [#15](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/issues/15)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/compare/v1.1.0...v1.2.0) (2017-04-15)


### Features

* **thresholds:** allow per file enforcement of threshold reporting ([f6d71b3](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/commit/f6d71b3)), closes [#12](https://github.com/mattlewis92/karma-coverage-istanbul-reporter/issues/12)

# 1.1.0

* Add the skipFilesWithNoCoverage option

# 1.0.0

* Add the %browser% placeholder in the dir option to allow multiple browsers to output coverage

# 0.3.0

* Add coverage thresold enforcement via the thresholds option

# 0.2.0

* Add the `fixWebpackSourcePaths` option

# 0.1.0

* Initial release