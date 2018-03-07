import { Rule } from '@angular-devkit/schematics';
/**
 * Use a Rule which can return an observable, but do not actually modify the Tree.
 * This rules perform an HTTP request to get the npm registry package.json, then resolve the
 * version from the options, and replace the version in the options by an actual version.
 * @param supportedPackages A list of packages to update (at the same version).
 * @param maybeVersion A version to update those packages to.
 * @param loose Whether to use loose version operators (instead of specific versions).
 * @private
 */
export declare function updatePackageJson(supportedPackages: string[], maybeVersion?: string, loose?: boolean): Rule;
