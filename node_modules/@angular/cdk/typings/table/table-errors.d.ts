/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Returns an error to be thrown when attempting to find an unexisting column.
 * @param id Id whose lookup failed.
 * @docs-private
 */
export declare function getTableUnknownColumnError(id: string): Error;
/**
 * Returns an error to be thrown when two column definitions have the same name.
 * @docs-private
 */
export declare function getTableDuplicateColumnNameError(name: string): Error;
