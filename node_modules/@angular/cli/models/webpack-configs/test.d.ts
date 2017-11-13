import * as webpack from 'webpack';
import { WebpackTestOptions } from '../webpack-test-config';
import { WebpackConfigOptions } from '../webpack-config';
/**
 * Enumerate loaders and their dependencies from this file to let the dependency validator
 * know they are used.
 *
 * require('istanbul-instrumenter-loader')
 *
 */
export declare function getTestConfig(wco: WebpackConfigOptions<WebpackTestOptions>): {
    devtool: string;
    entry: {
        main: string;
    };
    module: {
        rules: any[];
    };
    plugins: webpack.optimize.CommonsChunkPlugin[];
};
