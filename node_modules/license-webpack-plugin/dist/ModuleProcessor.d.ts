import { ConstructedOptions } from './ConstructedOptions';
import { Module } from './Module';
import { LicenseWebpackPluginError } from './LicenseWebpackPluginError';
declare class ModuleProcessor {
    private context;
    private options;
    private errors;
    private modulePrefixes;
    private licenseExtractor;
    constructor(context: string, options: ConstructedOptions, errors: LicenseWebpackPluginError[]);
    processFile(filename: string): string | null;
    processPackage(packageName: string, modulePrefix: string | null): string | null;
    processExternalPackage(packageName: string): string | null;
    getPackageInfo(packageName: string): Module;
    private extractPackageName(filename, modulePrefix);
    private isFromModuleDirectory(filename, modulePrefix);
    private findModulePrefix(filename);
}
export { ModuleProcessor };
