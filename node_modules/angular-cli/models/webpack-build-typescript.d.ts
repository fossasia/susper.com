import { AotPlugin } from '@ngtools/webpack';
export declare const getWebpackNonAotConfigPartial: (projectRoot: string, appConfig: any) => {
    module: {
        rules: {
            test: RegExp;
            loader: string;
            exclude: RegExp[];
        }[];
    };
    plugins: AotPlugin[];
};
export declare const getWebpackAotConfigPartial: (projectRoot: string, appConfig: any, i18nFile: string, i18nFormat: string, locale: string) => {
    module: {
        rules: {
            test: RegExp;
            loader: string;
            exclude: RegExp[];
        }[];
    };
    plugins: AotPlugin[];
};
