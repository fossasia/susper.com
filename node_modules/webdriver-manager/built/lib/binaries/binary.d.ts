/**
 * operating system enum
 */
export declare enum OS {
    Windows_NT = 0,
    Linux = 1,
    Darwin = 2,
}
/**
 * Dictionary to map the binary's id to the binary object
 */
export interface BinaryMap<T extends Binary> {
    [id: string]: T;
}
/**
 * The binary object base class
 */
export declare class Binary {
    static os: OS[];
    static id: string;
    static isDefault: boolean;
    static versionDefault: string;
    static shortName: string[];
    name: string;
    prefixDefault: string;
    versionCustom: string;
    suffixDefault: string;
    cdn: string;
    arch: string;
    constructor(cdn?: string);
    /**
     * @param ostype The operating system.
     * @returns The executable file type.
     */
    executableSuffix(ostype: string): string;
    /**
     * @param ostype The operating system.
     * @returns The file name for the executable.
     */
    executableFilename(ostype: string): string;
    prefix(): string;
    version(): string;
    suffix(ostype?: string, arch?: string): string;
    filename(ostype?: string, arch?: string): string;
    /**
     * @param ostype The operating system.
     * @returns The file name for the file inside the downloaded zip file
     */
    zipContentName(ostype: string): string;
    shortVersion(version: string): string;
    /**
     * A base class method that should be overridden.
     */
    id(): string;
    /**
     * A base class method that should be overridden.
     */
    versionDefault(): string;
    /**
     * A base class method that should be overridden.
     */
    url(ostype?: string, arch?: string): string;
    /**
     * Delete an instance of this binary from the file system
     */
    remove(filename: string): void;
}
