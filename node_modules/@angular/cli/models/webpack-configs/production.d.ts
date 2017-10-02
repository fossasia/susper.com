import { WebpackConfigOptions } from '../webpack-config';
export declare function getProdConfig(wco: WebpackConfigOptions): {
    entry: {
        [key: string]: string[];
    };
    plugins: any[];
};
