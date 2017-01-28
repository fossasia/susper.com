export declare class Version {
    private _version;
    constructor(_version?: string);
    private _parse();
    isAlpha(): boolean;
    isBeta(): boolean;
    isReleaseCandidate(): boolean;
    isKnown(): boolean;
    isLocal(): boolean;
    readonly major: string | number;
    readonly minor: string | number;
    readonly patch: string | number;
    readonly qualifier: string;
    readonly extra: string;
    toString(): string;
    static fromProject(): Version;
    static assertAngularVersionIs2_3_1OrHigher(projectRoot: string): void;
    static assertPostWebpackVersion(): void;
    static isPreWebpack(): boolean;
}
