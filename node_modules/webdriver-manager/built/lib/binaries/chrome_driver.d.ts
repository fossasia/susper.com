import { Binary, OS } from './binary';
/**
 * The chrome driver binary.
 */
export declare class ChromeDriver extends Binary {
    static os: OS[];
    static id: string;
    static versionDefault: string;
    static isDefault: boolean;
    static shortName: string[];
    constructor(alternateCDN?: string);
    id(): string;
    versionDefault(): string;
    suffix(ostype: string, arch: string): string;
    url(ostype: string, arch: string): string;
}
