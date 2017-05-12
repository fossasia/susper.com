/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import * as html from '../ml_parser/ast';
import * as i18n from './i18n_ast';
import { Serializer } from './serializers/serializer';
/**
 * A container for translated messages
 */
export declare class TranslationBundle {
    private _i18nNodesByMsgId;
    digest: (m: i18n.Message) => string;
    private _i18nToHtml;
    constructor(_i18nNodesByMsgId: {
        [msgId: string]: i18n.Node[];
    }, digest: (m: i18n.Message) => string);
    static load(content: string, url: string, serializer: Serializer): TranslationBundle;
    get(srcMsg: i18n.Message): html.Node[];
    has(srcMsg: i18n.Message): boolean;
}
