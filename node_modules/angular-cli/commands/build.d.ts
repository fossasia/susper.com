export interface BuildOptions {
    target?: string;
    environment?: string;
    outputPath?: string;
    watch?: boolean;
    watcher?: string;
    supressSizes: boolean;
    baseHref?: string;
    aot?: boolean;
    sourcemap?: boolean;
    vendorChunk?: boolean;
    verbose?: boolean;
    progress?: boolean;
    i18nFile?: string;
    i18nFormat?: string;
    locale?: string;
}
declare const BuildCommand: any;
export default BuildCommand;
