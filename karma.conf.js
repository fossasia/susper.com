// Karma configuration file, see link for more information
// https://karma-runner.github.io/0.13/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma'),
      require('karma-coverage')
    ],
    files: [
      { pattern: './src/test.ts', watched: false },
      'https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.4.2/js/swiper.min.js'
    ],
    preprocessors: {
      './src/test.ts': ['@angular/cli'],
      'src/app/**/*.js': ['coverage']
    },
    client: {
      clearContext: false
    },
    mime: {
      'text/x-typescript': ['ts', 'tsx']
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: config.angularCli && config.angularCli.codeCoverage
      ? ['progress', 'coverage-istanbul']
      : ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
