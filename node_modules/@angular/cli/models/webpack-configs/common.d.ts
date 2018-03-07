import * as webpack from 'webpack';
import { WebpackConfigOptions } from '../webpack-config';
/**
 * Enumerate loaders and their dependencies from this file to let the dependency validator
 * know they are used.
 *
 * require('raw-loader')
 * require('url-loader')
 * require('file-loader')
 * require('cache-loader')
 * require('@angular-devkit/build-optimizer')
 */
export declare function getCommonConfig(wco: WebpackConfigOptions): {
    resolve: {
        extensions: string[];
        symlinks: boolean;
        modules: string[];
        alias: {};
    };
    resolveLoader: {
        modules: string[];
    };
    context: string;
    entry: {
        [key: string]: string[];
    };
    output: {
        path: string;
        publicPath: string;
        filename: string;
        chunkFilename: string;
    };
    module: {
        rules: ({
            test: RegExp;
            loader: string;
        } | {
            test: RegExp;
            loader: string;
            options: {
                name: string;
                limit: number;
            };
        })[];
    };
    plugins: webpack.NoEmitOnErrorsPlugin[];
};
