import * as webpack from 'webpack';
import { WebpackConfigOptions } from '../webpack-config';
export declare function getStylesConfig(wco: WebpackConfigOptions): {
    entry: {
        [key: string]: string[];
    };
    module: {
        rules: webpack.Rule[];
    };
    plugins: any[];
};
