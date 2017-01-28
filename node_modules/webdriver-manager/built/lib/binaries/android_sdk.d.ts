import { Binary, OS } from './binary';
/**
 * The android sdk binary.
 */
export declare class AndroidSDK extends Binary {
    static os: OS[];
    static id: string;
    static versionDefault: string;
    static isDefault: boolean;
    static shortName: string[];
    static DEFAULT_API_LEVELS: string;
    static DEFAULT_ABIS: string;
    constructor(alternateCDN?: string);
    id(): string;
    versionDefault(): string;
    suffix(ostype: string): string;
    url(ostype: string): string;
    zipContentName(ostype: string): string;
    executableSuffix(): string;
    remove(sdkPath: string): void;
}
