/**
 * Enumerate loaders and their dependencies from this file to let the dependency validator
 * know they are used.
 *
 * require('source-map-loader')
 * require('raw-loader')
 * require('script-loader')
 * require('json-loader')
 * require('url-loader')
 * require('file-loader')
 */
export declare function getWebpackCommonConfig(projectRoot: string, environment: string, appConfig: any, baseHref: string, sourcemap: boolean, vendorChunk: boolean, verbose: boolean, progress: boolean): {
    devtool: string | boolean;
    resolve: {
        extensions: string[];
        modules: string[];
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
    };
    module: {
        rules: ({
            enforce: string;
            test: RegExp;
            loader: string;
            exclude: string[];
        } | {
            test: RegExp;
            loader: string;
        })[];
    };
    plugins: any[];
    node: {
        fs: string;
        global: boolean;
        crypto: string;
        tls: string;
        net: string;
        process: boolean;
        module: boolean;
        clearImmediate: boolean;
        setImmediate: boolean;
    };
};
