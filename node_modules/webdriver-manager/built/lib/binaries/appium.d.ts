import { Binary, OS } from './binary';
/**
 * The appium binary.
 */
export declare class Appium extends Binary {
    static os: OS[];
    static id: string;
    static versionDefault: string;
    static isDefault: boolean;
    static shortName: string[];
    constructor(alternateCDN?: string);
    id(): string;
    versionDefault(): string;
    executableSuffix(): string;
    remove(sdkPath: string): void;
}
