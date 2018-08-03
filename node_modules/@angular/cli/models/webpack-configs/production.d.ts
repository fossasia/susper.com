import { WebpackConfigOptions } from '../webpack-config';
/**
 * license-webpack-plugin has a peer dependency on webpack-sources, list it in a comment to
 * let the dependency validator know it is used.
 *
 * require('webpack-sources')
 */
export declare function getProdConfig(wco: WebpackConfigOptions): {
    entry: {
        [key: string]: string[];
    };
    plugins: any[];
};
