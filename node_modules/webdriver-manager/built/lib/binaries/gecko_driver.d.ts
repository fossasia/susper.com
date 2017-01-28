import { Binary, OS } from './binary';
/**
 * The gecko driver binary.
 */
export declare class GeckoDriver extends Binary {
    static os: OS[];
    static id: string;
    static versionDefault: string;
    static isDefault: boolean;
    static shortName: string[];
    static suffixes: {
        [key: string]: string;
    };
    constructor(alternateCDN?: string);
    id(): string;
    versionDefault(): string;
    suffix(ostype: string, arch: string): string;
    static supports(ostype: string, arch: string): boolean;
    url(ostype: string, arch: string): string;
}
