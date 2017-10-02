import { AotPlugin } from '@ngtools/webpack';
import { WebpackConfigOptions } from '../webpack-config';
export declare function getNonAotConfig(wco: WebpackConfigOptions): {
    module: {
        rules: {
            test: RegExp;
            loader: string;
        }[];
    };
    plugins: AotPlugin[];
};
export declare function getAotConfig(wco: WebpackConfigOptions): {
    module: {
        rules: {
            test: RegExp;
            use: any[];
        }[];
    };
    plugins: AotPlugin[];
};
export declare function getNonAotTestConfig(wco: WebpackConfigOptions): {
    module: {
        rules: {
            test: RegExp;
            loader: string;
        }[];
    };
    plugins: AotPlugin[];
};
