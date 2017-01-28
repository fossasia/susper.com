import { Binary, OS } from './binary';
/**
 * The selenium server jar.
 */
export declare class StandAlone extends Binary {
    static os: OS[];
    static id: string;
    static versionDefault: string;
    static isDefault: boolean;
    static shortName: string[];
    constructor(alternateCDN?: string);
    id(): string;
    versionDefault(): string;
    url(): string;
    executableSuffix(ostype?: string): string;
}
