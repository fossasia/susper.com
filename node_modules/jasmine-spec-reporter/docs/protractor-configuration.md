Use jasmine-spec-reporter with Protractor
=========================================
The `jasmine-spec-reporter` can be used to enhance your [Protractor](https://github.com/angular/protractor) tests execution report.

## Protractor configuration
In your Protractor configuration file:

```node
exports.config = {
   // your config here ...

   onPrepare: function() {
      var SpecReporter = require('jasmine-spec-reporter');
      // add jasmine spec reporter
      jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: 'all'}));
   }
}
```

## Remove protractor dot reporter
In your protractor configuration file, add the print function in the `jasmineNodeOpts` section:

```node
jasmineNodeOpts: {
   ...
   print: function() {}
}
```
