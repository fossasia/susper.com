declare module 'webpack' {
    interface LoaderOptionsPlugin {
    }
    interface LoaderOptionsPluginStatic {
        new (optionsObject: any): LoaderOptionsPlugin;
    }
    interface Webpack {
        LoaderOptionsPlugin: LoaderOptionsPluginStatic;
    }
}
export declare const getWebpackProdConfigPartial: (projectRoot: string, appConfig: any, sourcemap: boolean, verbose: any) => {
    output: {
        filename: string;
        sourceMapFilename: string;
        chunkFilename: string;
    };
    plugins: any[];
};
export {};
