import { ConstructedOptions } from './ConstructedOptions';
import { Module } from './Module';
import { LicenseWebpackPluginError } from './LicenseWebpackPluginError';
declare class LicenseExtractor {
    private options;
    private errors;
    static UNKNOWN_LICENSE: string;
    private moduleCache;
    constructor(options: ConstructedOptions, errors: LicenseWebpackPluginError[]);
    parsePackage(packageName: string, modulePrefix: string | null): boolean;
    getCachedPackage(packageName: string): Module;
    private getLicenseName(packageJson);
    private getLicenseFilename(packageJson, licenseName, modulePrefix);
    private getLicenseText(packageJson, licenseName, modulePrefix);
    private readPackageJson(packageName, modulePrefix);
}
export { LicenseExtractor };
