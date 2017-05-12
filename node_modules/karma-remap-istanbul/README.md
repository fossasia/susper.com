# karma-remap-istanbul
Call remap-istanbul as a karma reporter, enabling remapped reports on watch

## installation

Install `karma-remap-istanbul` as a dev-dependency in your project.

```bash
npm install karma-remap-istanbul --save-dev
```

## configuration

Add the plugin, reporter and reporter configuration in your `karma.conf.js`.

```js
{
  plugins: ['karma-remap-istanbul'],
  reporters: ['progress', 'karma-remap-istanbul'],
  remapIstanbulReporter: {
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

You will need to either install `karma-coverage` and configure it as a preprocessor for your transpiled modules under test or instrument the modules under test as part of your build process. If the latter option is chosen, the coverage statistics will need to be stored at the `__coverage__` global variable (istanbul's default) or karma will not transmit them back to the runner.
