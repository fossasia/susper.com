import { GlobCopyWebpackPlugin } from '../plugins/glob-copy-webpack-plugin';
import { PrerenderWebpackPlugin } from '../utilities/prerender-webpack-plugin';
export declare const getWebpackMobileConfigPartial: (projectRoot: string, appConfig: any) => {
    plugins: (GlobCopyWebpackPlugin | PrerenderWebpackPlugin)[];
};
export declare const getWebpackMobileProdConfigPartial: (projectRoot: string, appConfig: any) => {
    entry: {
        'sw-install': string;
    };
    plugins: any[];
};
