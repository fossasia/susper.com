export declare const NEW_SW_VERSION = "5.0.0-rc.0";
export declare function usesServiceWorker(projectRoot: string): boolean;
export declare function augmentAppWithServiceWorker(projectRoot: string, appRoot: string, outputPath: string, baseHref: string): Promise<void>;
