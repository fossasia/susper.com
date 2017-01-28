'use strict';

var istanbul = require('istanbul');
var loaderUtils = require('loader-utils');
var assign = require('object-assign');

var defaultOptions = {
    embedSource: true,
    noAutoWrap: true
};

module.exports = function(source, sourceMap) {
    var userOptions = loaderUtils.parseQuery(this.query);
    var instrumenter = new istanbul.Instrumenter(
        assign({}, defaultOptions, userOptions)
    );

    if (this.cacheable) {
        this.cacheable();
    }

    // if force sourcemap requested embed inline sources (helps resolve issues with
    // transpiled languages like typescript
    if (userOptions['force-sourcemap']) {
        // if there is no source map, create a dummy one to stop plugins like remap-istanbul complaining
        if (!sourceMap) {
            sourceMap = {
                version: 3,
                sources: [],
                sourceRoot: '',
                names: [],
                mappings: '',
                sourcesContent: []
            };
        }
        //encode & append
        var encoded = new Buffer(JSON.stringify(sourceMap)).toString('base64');
        source += '\n\n//# sourceMappingURL=data:application/json;base64,' + encoded;
    }
    
    return instrumenter.instrumentSync(source, this.resourcePath);
};
