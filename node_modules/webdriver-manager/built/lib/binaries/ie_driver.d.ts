import { Binary, OS } from './binary';
/**
 * The internet explorer binary.
 */
export declare class IEDriver extends Binary {
    static os: OS[];
    static id: string;
    static versionDefault: string;
    static isDefault: boolean;
    static shortName: string[];
    constructor(alternateCDN?: string);
    id(): string;
    versionDefault(): string;
    version(): string;
    url(): string;
}
