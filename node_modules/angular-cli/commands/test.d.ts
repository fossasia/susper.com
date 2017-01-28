export interface TestOptions {
    watch?: boolean;
    codeCoverage?: boolean;
    lint?: boolean;
    singleRun?: boolean;
    browsers?: string;
    colors?: boolean;
    log?: string;
    port?: number;
    reporters?: string;
    build?: boolean;
    sourcemap?: boolean;
    progress?: boolean;
}
declare const NgCliTestCommand: any;
export default NgCliTestCommand;
