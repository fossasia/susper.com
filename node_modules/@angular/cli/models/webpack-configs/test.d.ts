import * as webpack from 'webpack';
import { WebpackTestOptions } from '../webpack-test-config';
/**
 * Enumerate loaders and their dependencies from this file to let the dependency validator
 * know they are used.
 *
 * require('istanbul-instrumenter-loader')
 *
 */
export declare function getTestConfig(testConfig: WebpackTestOptions): {
    devtool: string;
    entry: {
        test: string;
    };
    module: {
        rules: any[];
    };
    plugins: webpack.SourceMapDevToolPlugin[];
};
