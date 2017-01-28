export interface ServeTaskOptions {
    port?: number;
    host?: string;
    proxyConfig?: string;
    watcher?: string;
    liveReload?: boolean;
    liveReloadHost?: string;
    liveReloadPort?: number;
    liveReloadBaseUrl?: string;
    liveReloadLiveCss?: boolean;
    target?: string;
    environment?: string;
    ssl?: boolean;
    sslKey?: string;
    sslCert?: string;
    aot?: boolean;
    sourcemap?: boolean;
    verbose?: boolean;
    progress?: boolean;
    open?: boolean;
    vendorChunk?: boolean;
    hmr?: boolean;
    i18nFile?: string;
    i18nFormat?: string;
    locale?: string;
}
declare const ServeCommand: any;
export default ServeCommand;
