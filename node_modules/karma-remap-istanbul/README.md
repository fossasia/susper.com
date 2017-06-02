# karma-remap-istanbul
Call remap-istanbul as a karma reporter, enabling remapped reports on watch

## Installation

Install `karma-remap-istanbul` as a dev-dependency in your project.

```bash
npm install karma-remap-istanbul --save-dev
```

## Configuration

Add the plugin, reporter and reporter configuration in your `karma.conf.js`.

```js
{
  plugins: ['karma-remap-istanbul'],
  reporters: ['progress', 'karma-remap-istanbul'],
  remapIstanbulReporter: {
    remapOptions: {}, //additional remap options
    reportOptions: {}, //additional report options
    reports: {
      lcovonly: 'path/to/output/coverage/lcov.info',
      html: 'path/to/output/html/report'
    }
  }
}
```

### Example configuration with `karma-coverage`
```js
{
  preprocessors: {
    'build/**/!(*spec).js': ['coverage']
  },
  plugins: ['karma-remap-istanbul', 'karma-coverage'],
  reporters: ['progress', 'coverage', 'karma-remap-istanbul'],
  remapIstanbulReporter: {
    reports: {
      html: 'coverage'
    }
  }
}
```

You will need to either install `karma-coverage` and configure it as a preprocessor for your transpiled modules under test or instrument the modules under test as part of your build process (i.e. via a tool like webpack and the `sourcemap-istanbul-instrumenter-loader`). If the latter option is chosen, the coverage statistics will need to be stored by the build tool on the `__coverage__` global variable (istanbul's default) or karma will not transmit the coverage back to the runner. For a full e2e example please [look here](https://github.com/marcules/karma-remap-istanbul/tree/master/examples/webpack).

## Alternatives
For some build tools there are better suited solutions than using this module.
* babel users can use the [babel plugin](https://github.com/istanbuljs/babel-plugin-istanbul) as it doesn't rely on sourcemapping and so is less error prone and more accurate
* system.js users can use [systemjs-istanbul](https://github.com/guybedford/systemjs-istanbul) as it has remap-istanbul support included
* browserify users can use [karma-typescript](https://github.com/monounity/karma-typescript) as it has remap-istanbul support included
* webpack users can use the [instanbul-instrumenter-loader](https://github.com/deepsweet/istanbul-instrumenter-loader) and the [karma-coverage-instanbul-reporter](https://github.com/mattlewis92/karma-coverage-istanbul-reporter)
