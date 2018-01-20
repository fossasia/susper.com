/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { schema } from '@angular-devkit/core';
import { Observable } from 'rxjs/Observable';
export declare function formatValidator(data: Object, dataSchema: Object, formats: schema.SchemaFormat[]): Observable<schema.SchemaValidatorResult>;
