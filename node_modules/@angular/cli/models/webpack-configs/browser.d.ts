import { WebpackConfigOptions } from '../webpack-config';
export declare function getBrowserConfig(wco: WebpackConfigOptions): {
    resolve: {
        mainFields: string[];
    };
    output: {
        crossOriginLoading: string | boolean;
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
