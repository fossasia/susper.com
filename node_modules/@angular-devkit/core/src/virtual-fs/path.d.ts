/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { BaseException } from '@angular-devkit/core';
export declare class InvalidPathException extends BaseException {
    constructor(path: string);
}
export declare class PathMustBeAbsoluteException extends BaseException {
    constructor(path: string);
}
/**
 * A Path recognized by most methods in the DevKit.
 */
export declare type Path = string & {
    __PRIVATE_DEVKIT_PATH: void;
};
/**
 * The Separator for normalized path.
 * @type {Path}
 */
export declare const NormalizedSep: Path;
/**
 * The root of a normalized path.
 * @type {Path}
 */
export declare const NormalizedRoot: Path;
/**
 * Split a path into multiple path fragments. Each fragments except the last one will end with
 * a path separator.
 * @param {Path} path The path to split.
 * @returns {Path[]} An array of path fragments.
 */
export declare function split(path: Path): Path[];
/**
 *
 */
export declare function extname(path: Path): string;
/**
 * This is the equivalent of calling dirname() over and over, until the root, then getting the
 * basename.
 *
 * @example rootname('/a/b/c') == 'a'
 * @example rootname('a/b') == '.'
 * @param path The path to get the rootname from.
 * @returns {Path} The first directory name.
 */
export declare function rootname(path: Path): Path;
/**
 * Return the basename of the path, as a Path. See path.basename
 */
export declare function basename(path: Path): Path;
/**
 * Return the dirname of the path, as a Path. See path.dirname
 */
export declare function dirname(path: Path): Path;
/**
 * Join multiple paths together, and normalize the result. Accepts strings that will be
 * normalized as well (but the original must be a path).
 */
export declare function join(p1: Path, ...others: string[]): Path;
/**
 * Returns true if a path is absolute.
 */
export declare function isAbsolute(p: Path): boolean;
/**
 * Returns a path such that `join(from, relative(from, to)) == to`.
 * Both paths must be absolute, otherwise it does not make much sense.
 */
export declare function relative(from: Path, to: Path): Path;
/**
 * Returns a Path that is the resolution of p2, from p1. If p2 is absolute, it will return p2,
 * otherwise will join both p1 and p2.
 */
export declare function resolve(p1: Path, p2: Path): Path;
/**
 * Normalize a string into a Path. This is the only mean to get a Path type from a string that
 * represents a system path. Normalization includes:
 *   - Windows backslashes `\\` are replaced with `/`.
 *   - Windows drivers are replaced with `/X/`, where X is the drive letter.
 *   - Absolute paths starts with `/`.
 *   - Multiple `/` are replaced by a single one.
 *   - Path segments `.` are removed.
 *   - Path segments `..` are resolved.
 *   - If a path is absolute, having a `..` at the start is invalid (and will throw).
 */
export declare function normalize(path: string): Path;
