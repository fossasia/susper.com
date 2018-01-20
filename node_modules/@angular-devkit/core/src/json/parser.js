"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const __1 = require("..");
/**
 * A character was invalid in this context.
 */
class InvalidJsonCharacterException extends __1.BaseException {
    constructor(context) {
        const pos = context.previous;
        super(`Invalid JSON character: ${JSON.stringify(_peek(context))} `
            + `at ${pos.line}:${pos.character}.`);
    }
}
exports.InvalidJsonCharacterException = InvalidJsonCharacterException;
/**
 * More input was expected, but we reached the end of the stream.
 */
class UnexpectedEndOfInputException extends __1.BaseException {
    constructor(_context) {
        super(`Unexpected end of file.`);
    }
}
exports.UnexpectedEndOfInputException = UnexpectedEndOfInputException;
/**
 * Peek and return the next character from the context.
 * @private
 */
function _peek(context) {
    return context.original[context.position.offset];
}
/**
 * Move the context to the next character, including incrementing the line if necessary.
 * @private
 */
function _next(context) {
    context.previous = context.position;
    let { offset, line, character } = context.position;
    const char = context.original[offset];
    offset++;
    if (char == '\n') {
        line++;
        character = 0;
    }
    else {
        character++;
    }
    context.position = { offset, line, character };
}
function _token(context, valid) {
    const char = _peek(context);
    if (valid) {
        if (!char) {
            throw new UnexpectedEndOfInputException(context);
        }
        if (valid.indexOf(char) == -1) {
            throw new InvalidJsonCharacterException(context);
        }
    }
    // Move the position of the context to the next character.
    _next(context);
    return char;
}
/**
 * Read the exponent part of a number. The exponent part is looser for JSON than the number
 * part. `str` is the string of the number itself found so far, and start the position
 * where the full number started. Returns the node found.
 * @private
 */
function _readExpNumber(context, start, str, comments) {
    let char;
    let signed = false;
    while (true) {
        char = _token(context);
        if (char == '+' || char == '-') {
            if (signed) {
                break;
            }
            signed = true;
            str += char;
        }
        else if (char == '0' || char == '1' || char == '2' || char == '3' || char == '4'
            || char == '5' || char == '6' || char == '7' || char == '8' || char == '9') {
            signed = true;
            str += char;
        }
        else {
            break;
        }
    }
    // We're done reading this number.
    context.position = context.previous;
    return {
        kind: 'number',
        start,
        end: context.position,
        text: context.original.substring(start.offset, context.position.offset),
        value: Number.parseFloat(str),
        comments: comments,
    };
}
/**
 * Read a number from the context.
 * @private
 */
function _readNumber(context, comments = _readBlanks(context)) {
    let str = '';
    let dotted = false;
    const start = context.position;
    // read until `e` or end of line.
    while (true) {
        const char = _token(context);
        // Read tokens, one by one.
        if (char == '-') {
            if (str != '') {
                throw new InvalidJsonCharacterException(context);
            }
        }
        else if (char == '0') {
            if (str == '0' || str == '-0') {
                throw new InvalidJsonCharacterException(context);
            }
        }
        else if (char == '1' || char == '2' || char == '3' || char == '4' || char == '5'
            || char == '6' || char == '7' || char == '8' || char == '9') {
            if (str == '0' || str == '-0') {
                throw new InvalidJsonCharacterException(context);
            }
        }
        else if (char == '.') {
            if (dotted) {
                throw new InvalidJsonCharacterException(context);
            }
            dotted = true;
        }
        else if (char == 'e' || char == 'E') {
            return _readExpNumber(context, start, str + char, comments);
        }
        else {
            // We're done reading this number.
            context.position = context.previous;
            return {
                kind: 'number',
                start,
                end: context.position,
                text: context.original.substring(start.offset, context.position.offset),
                value: Number.parseFloat(str),
                comments,
            };
        }
        str += char;
    }
}
/**
 * Read a string from the context. Takes the comments of the string or read the blanks before the
 * string.
 * @private
 */
function _readString(context, comments = _readBlanks(context)) {
    const start = context.position;
    // Consume the first string delimiter.
    const delim = _token(context);
    if ((context.mode & JsonParseMode.SingleQuotesAllowed) == 0) {
        if (delim == '\'') {
            throw new InvalidJsonCharacterException(context);
        }
    }
    else if (delim != '\'' && delim != '"') {
        throw new InvalidJsonCharacterException(context);
    }
    let str = '';
    while (true) {
        let char = _token(context);
        if (char == delim) {
            return {
                kind: 'string',
                start,
                end: context.position,
                text: context.original.substring(start.offset, context.position.offset),
                value: str,
                comments: comments,
            };
        }
        else if (char == '\\') {
            char = _token(context);
            switch (char) {
                case '\\':
                case '\/':
                case '"':
                case delim:
                    str += char;
                    break;
                case 'b':
                    str += '\b';
                    break;
                case 'f':
                    str += '\f';
                    break;
                case 'n':
                    str += '\n';
                    break;
                case 'r':
                    str += '\r';
                    break;
                case 't':
                    str += '\t';
                    break;
                case 'u':
                    const [c0] = _token(context, '0123456789abcdefABCDEF');
                    const [c1] = _token(context, '0123456789abcdefABCDEF');
                    const [c2] = _token(context, '0123456789abcdefABCDEF');
                    const [c3] = _token(context, '0123456789abcdefABCDEF');
                    str += String.fromCharCode(parseInt(c0 + c1 + c2 + c3, 16));
                    break;
                case undefined:
                    throw new UnexpectedEndOfInputException(context);
                default:
                    throw new InvalidJsonCharacterException(context);
            }
        }
        else if (char === undefined) {
            throw new UnexpectedEndOfInputException(context);
        }
        else if (char == '\b' || char == '\f' || char == '\n' || char == '\r' || char == '\t') {
            throw new InvalidJsonCharacterException(context);
        }
        else {
            str += char;
        }
    }
}
/**
 * Read the constant `true` from the context.
 * @private
 */
function _readTrue(context, comments = _readBlanks(context)) {
    const start = context.position;
    _token(context, 't');
    _token(context, 'r');
    _token(context, 'u');
    _token(context, 'e');
    const end = context.position;
    return {
        kind: 'true',
        start,
        end,
        text: context.original.substring(start.offset, end.offset),
        value: true,
        comments,
    };
}
/**
 * Read the constant `false` from the context.
 * @private
 */
function _readFalse(context, comments = _readBlanks(context)) {
    const start = context.position;
    _token(context, 'f');
    _token(context, 'a');
    _token(context, 'l');
    _token(context, 's');
    _token(context, 'e');
    const end = context.position;
    return {
        kind: 'false',
        start,
        end,
        text: context.original.substring(start.offset, end.offset),
        value: false,
        comments,
    };
}
/**
 * Read the constant `null` from the context.
 * @private
 */
function _readNull(context, comments = _readBlanks(context)) {
    const start = context.position;
    _token(context, 'n');
    _token(context, 'u');
    _token(context, 'l');
    _token(context, 'l');
    const end = context.position;
    return {
        kind: 'null',
        start,
        end,
        text: context.original.substring(start.offset, end.offset),
        value: null,
        comments: comments,
    };
}
/**
 * Read an array of JSON values from the context.
 * @private
 */
function _readArray(context, comments = _readBlanks(context)) {
    const start = context.position;
    // Consume the first delimiter.
    _token(context, '[');
    const value = [];
    const elements = [];
    _readBlanks(context);
    if (_peek(context) != ']') {
        const node = _readValue(context);
        elements.push(node);
        value.push(node.value);
    }
    while (_peek(context) != ']') {
        _token(context, ',');
        const node = _readValue(context);
        elements.push(node);
        value.push(node.value);
    }
    _token(context, ']');
    return {
        kind: 'array',
        start,
        end: context.position,
        text: context.original.substring(start.offset, context.position.offset),
        value,
        elements,
        comments,
    };
}
/**
 * Read an identifier from the context. An identifier is a valid JavaScript identifier, and this
 * function is only used in Loose mode.
 * @private
 */
function _readIdentifier(context, comments = _readBlanks(context)) {
    const start = context.position;
    let char = _peek(context);
    if (char && '0123456789'.indexOf(char) != -1) {
        const identifierNode = _readNumber(context);
        return {
            kind: 'identifier',
            start,
            end: identifierNode.end,
            text: identifierNode.text,
            value: identifierNode.value.toString(),
        };
    }
    const identValidFirstChar = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ';
    const identValidChar = '_$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ0123456789';
    let first = true;
    let value = '';
    while (true) {
        char = _token(context);
        if (char == undefined
            || (first ? identValidFirstChar.indexOf(char) : identValidChar.indexOf(char)) == -1) {
            context.position = context.previous;
            return {
                kind: 'identifier',
                start,
                end: context.position,
                text: context.original.substr(start.offset, context.position.offset),
                value,
                comments,
            };
        }
        value += char;
        first = false;
    }
}
/**
 * Read a property from the context. A property is a string or (in Loose mode only) a number or
 * an identifier, followed by a colon `:`.
 * @private
 */
function _readProperty(context, comments = _readBlanks(context)) {
    const start = context.position;
    let key;
    if ((context.mode & JsonParseMode.IdentifierKeyNamesAllowed) != 0) {
        const top = _peek(context);
        if (top == '"' || top == '\'') {
            key = _readString(context);
        }
        else {
            key = _readIdentifier(context);
        }
    }
    else {
        key = _readString(context);
    }
    _readBlanks(context);
    _token(context, ':');
    const value = _readValue(context);
    const end = context.position;
    return {
        kind: 'keyvalue',
        key,
        value,
        start,
        end,
        text: context.original.substring(start.offset, end.offset),
        comments,
    };
}
/**
 * Read an object of properties -> JSON values from the context.
 * @private
 */
function _readObject(context, comments = _readBlanks(context)) {
    const start = context.position;
    // Consume the first delimiter.
    _token(context, '{');
    const value = {};
    const properties = [];
    _readBlanks(context);
    if (_peek(context) != '}') {
        const property = _readProperty(context);
        value[property.key.value] = property.value.value;
        properties.push(property);
        while (_peek(context) != '}') {
            _token(context, ',');
            const property = _readProperty(context);
            value[property.key.value] = property.value.value;
            properties.push(property);
        }
    }
    _token(context, '}');
    return {
        kind: 'object',
        properties,
        start,
        end: context.position,
        value,
        text: context.original.substring(start.offset, context.position.offset),
        comments,
    };
}
/**
 * Remove any blank character or comments (in Loose mode) from the context, returning an array
 * of comments if any are found.
 * @private
 */
function _readBlanks(context) {
    if ((context.mode & JsonParseMode.CommentsAllowed) != 0) {
        const comments = [];
        while (true) {
            let char = context.original[context.position.offset];
            if (char == '/' && context.original[context.position.offset + 1] == '*') {
                const start = context.position;
                // Multi line comment.
                _next(context);
                _next(context);
                char = context.original[context.position.offset];
                while (context.original[context.position.offset] != '*'
                    || context.original[context.position.offset + 1] != '/') {
                    _next(context);
                    if (context.position.offset >= context.original.length) {
                        throw new UnexpectedEndOfInputException(context);
                    }
                }
                // Remove "*/".
                _next(context);
                _next(context);
                comments.push({
                    kind: 'multicomment',
                    start,
                    end: context.position,
                    text: context.original.substring(start.offset, context.position.offset),
                    content: context.original.substring(start.offset + 2, context.position.offset - 2),
                });
            }
            else if (char == '/' && context.original[context.position.offset + 1] == '/') {
                const start = context.position;
                // Multi line comment.
                _next(context);
                _next(context);
                char = context.original[context.position.offset];
                while (context.original[context.position.offset] != '\n') {
                    _next(context);
                    if (context.position.offset >= context.original.length) {
                        break;
                    }
                }
                // Remove "\n".
                if (context.position.offset < context.original.length) {
                    _next(context);
                }
                comments.push({
                    kind: 'comment',
                    start,
                    end: context.position,
                    text: context.original.substring(start.offset, context.position.offset),
                    content: context.original.substring(start.offset + 2, context.position.offset - 1),
                });
            }
            else if (char == ' ' || char == '\t' || char == '\n' || char == '\r' || char == '\f') {
                _next(context);
            }
            else {
                break;
            }
        }
        return comments;
    }
    else {
        let char = context.original[context.position.offset];
        while (char == ' ' || char == '\t' || char == '\n' || char == '\r' || char == '\f') {
            _next(context);
            char = context.original[context.position.offset];
        }
        return [];
    }
}
/**
 * Read a JSON value from the context, which can be any form of JSON value.
 * @private
 */
function _readValue(context) {
    let result;
    // Clean up before.
    const comments = _readBlanks(context);
    const char = _peek(context);
    switch (char) {
        case undefined:
            throw new UnexpectedEndOfInputException(context);
        case '-':
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
            result = _readNumber(context, comments);
            break;
        case '\'':
        case '"':
            result = _readString(context, comments);
            break;
        case 't':
            result = _readTrue(context, comments);
            break;
        case 'f':
            result = _readFalse(context, comments);
            break;
        case 'n':
            result = _readNull(context, comments);
            break;
        case '[':
            result = _readArray(context, comments);
            break;
        case '{':
            result = _readObject(context, comments);
            break;
        default:
            throw new InvalidJsonCharacterException(context);
    }
    // Clean up after.
    _readBlanks(context);
    return result;
}
/**
 * The Parse mode used for parsing the JSON string.
 */
var JsonParseMode;
(function (JsonParseMode) {
    JsonParseMode[JsonParseMode["Strict"] = 0] = "Strict";
    JsonParseMode[JsonParseMode["CommentsAllowed"] = 1] = "CommentsAllowed";
    JsonParseMode[JsonParseMode["SingleQuotesAllowed"] = 2] = "SingleQuotesAllowed";
    JsonParseMode[JsonParseMode["IdentifierKeyNamesAllowed"] = 4] = "IdentifierKeyNamesAllowed";
    JsonParseMode[JsonParseMode["Default"] = 0] = "Default";
    JsonParseMode[JsonParseMode["Loose"] = 7] = "Loose";
})(JsonParseMode = exports.JsonParseMode || (exports.JsonParseMode = {}));
/**
 * Parse the JSON string and return its AST. The AST may be losing data (end comments are
 * discarded for example, and space characters are not represented in the AST), but all values
 * will have a single node in the AST (a 1-to-1 mapping).
 * @param input The string to use.
 * @param mode The mode to parse the input with. {@see JsonParseMode}.
 * @returns {JsonAstNode} The root node of the value of the AST.
 */
function parseJsonAst(input, mode = JsonParseMode.Default) {
    if (mode == JsonParseMode.Default) {
        mode = JsonParseMode.Strict;
    }
    const context = {
        position: { offset: 0, line: 0, character: 0 },
        previous: { offset: 0, line: 0, character: 0 },
        original: input,
        comments: undefined,
        mode,
    };
    const ast = _readValue(context);
    if (context.position.offset < input.length) {
        const rest = input.substr(context.position.offset);
        const i = rest.length > 20 ? rest.substr(0, 20) + '...' : rest;
        throw new Error(`Expected end of file, got "${i}" at `
            + `${context.position.line}:${context.position.character}.`);
    }
    return ast;
}
exports.parseJsonAst = parseJsonAst;
/**
 * Parse a JSON string into its value.  This discards the AST and only returns the value itself.
 * @param input The string to parse.
 * @param mode The mode to parse the input with. {@see JsonParseMode}.
 * @returns {JsonValue} The value represented by the JSON string.
 */
function parseJson(input, mode = JsonParseMode.Default) {
    // Try parsing for the fastest path available, if error, uses our own parser for better errors.
    if (mode == JsonParseMode.Strict) {
        try {
            return JSON.parse(input);
        }
        catch (err) {
            return parseJsonAst(input, mode).value;
        }
    }
    return parseJsonAst(input, mode).value;
}
exports.parseJson = parseJson;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9oYW5zbC9Tb3VyY2VzL2hhbnNsL2RldmtpdC8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2FuZ3VsYXJfZGV2a2l0L2NvcmUvc3JjL2pzb24vcGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsMEJBQW1DO0FBcUJuQzs7R0FFRztBQUNILG1DQUEyQyxTQUFRLGlCQUFhO0lBQzlELFlBQVksT0FBMEI7UUFDcEMsTUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztRQUM3QixLQUFLLENBQUMsMkJBQTJCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUc7Y0FDNUQsTUFBTSxHQUFHLENBQUMsSUFBSSxJQUFJLEdBQUcsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQzVDLENBQUM7Q0FDRjtBQU5ELHNFQU1DO0FBR0Q7O0dBRUc7QUFDSCxtQ0FBMkMsU0FBUSxpQkFBYTtJQUM5RCxZQUFZLFFBQTJCO1FBQ3JDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ25DLENBQUM7Q0FDRjtBQUpELHNFQUlDO0FBY0Q7OztHQUdHO0FBQ0gsZUFBZSxPQUEwQjtJQUN2QyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFHRDs7O0dBR0c7QUFDSCxlQUFlLE9BQTBCO0lBQ3ZDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUVwQyxJQUFJLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2pELE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdEMsTUFBTSxFQUFFLENBQUM7SUFDVCxF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UUFDekMsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDekMsQ0FBQztBQVhELDhCQVdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHsgQmFzZUV4Y2VwdGlvbiB9IGZyb20gJy4uJztcbmltcG9ydCB7XG4gIEpzb25BcnJheSxcbiAgSnNvbkFzdEFycmF5LFxuICBKc29uQXN0Q29tbWVudCxcbiAgSnNvbkFzdENvbnN0YW50RmFsc2UsXG4gIEpzb25Bc3RDb25zdGFudE51bGwsXG4gIEpzb25Bc3RDb25zdGFudFRydWUsXG4gIEpzb25Bc3RJZGVudGlmaWVyLFxuICBKc29uQXN0S2V5VmFsdWUsXG4gIEpzb25Bc3RNdWx0aWxpbmVDb21tZW50LFxuICBKc29uQXN0Tm9kZSxcbiAgSnNvbkFzdE51bWJlcixcbiAgSnNvbkFzdE9iamVjdCxcbiAgSnNvbkFzdFN0cmluZyxcbiAgSnNvbk9iamVjdCxcbiAgSnNvblZhbHVlLFxuICBQb3NpdGlvbixcbn0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuXG5cbi8qKlxuICogQSBjaGFyYWN0ZXIgd2FzIGludmFsaWQgaW4gdGhpcyBjb250ZXh0LlxuICovXG5leHBvcnQgY2xhc3MgSW52YWxpZEpzb25DaGFyYWN0ZXJFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IoY29udGV4dDogSnNvblBhcnNlckNvbnRleHQpIHtcbiAgICBjb25zdCBwb3MgPSBjb250ZXh0LnByZXZpb3VzO1xuICAgIHN1cGVyKGBJbnZhbGlkIEpTT04gY2hhcmFjdGVyOiAke0pTT04uc3RyaW5naWZ5KF9wZWVrKGNvbnRleHQpKX0gYFxuICAgICAgICArIGBhdCAke3Bvcy5saW5lfToke3Bvcy5jaGFyYWN0ZXJ9LmApO1xuICB9XG59XG5cblxuLyoqXG4gKiBNb3JlIGlucHV0IHdhcyBleHBlY3RlZCwgYnV0IHdlIHJlYWNoZWQgdGhlIGVuZCBvZiB0aGUgc3RyZWFtLlxuICovXG5leHBvcnQgY2xhc3MgVW5leHBlY3RlZEVuZE9mSW5wdXRFeGNlcHRpb24gZXh0ZW5kcyBCYXNlRXhjZXB0aW9uIHtcbiAgY29uc3RydWN0b3IoX2NvbnRleHQ6IEpzb25QYXJzZXJDb250ZXh0KSB7XG4gICAgc3VwZXIoYFVuZXhwZWN0ZWQgZW5kIG9mIGZpbGUuYCk7XG4gIH1cbn1cblxuXG4vKipcbiAqIENvbnRleHQgcGFzc2VkIGFyb3VuZCB0aGUgcGFyc2VyIHdpdGggaW5mb3JtYXRpb24gYWJvdXQgd2hlcmUgd2UgY3VycmVudGx5IGFyZSBpbiB0aGUgcGFyc2UuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgSnNvblBhcnNlckNvbnRleHQge1xuICBwb3NpdGlvbjogUG9zaXRpb247XG4gIHByZXZpb3VzOiBQb3NpdGlvbjtcbiAgcmVhZG9ubHkgb3JpZ2luYWw6IHN0cmluZztcbiAgcmVhZG9ubHkgbW9kZTogSnNvblBhcnNlTW9kZTtcbn1cblxuXG4vKipcbiAqIFBlZWsgYW5kIHJldHVybiB0aGUgbmV4dCBjaGFyYWN0ZXIgZnJvbSB0aGUgY29udGV4dC5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9wZWVrKGNvbnRleHQ6IEpzb25QYXJzZXJDb250ZXh0KTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIGNvbnRleHQub3JpZ2luYWxbY29udGV4dC5wb3NpdGlvbi5vZmZzZXRdO1xufVxuXG5cbi8qKlxuICogTW92ZSB0aGUgY29udGV4dCB0byB0aGUgbmV4dCBjaGFyYWN0ZXIsIGluY2x1ZGluZyBpbmNyZW1lbnRpbmcgdGhlIGxpbmUgaWYgbmVjZXNzYXJ5LlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX25leHQoY29udGV4dDogSnNvblBhcnNlckNvbnRleHQpIHtcbiAgY29udGV4dC5wcmV2aW91cyA9IGNvbnRleHQucG9zaXRpb247XG5cbiAgbGV0IHtvZmZzZXQsIGxpbmUsIGNoYXJhY3Rlcn0gPSBjb250ZXh0LnBvc2l0aW9uO1xuICBjb25zdCBjaGFyID0gY29udGV4dC5vcmlnaW5hbFtvZmZzZXRdO1xuICBvZmZzZXQrKztcbiAgaWYgKGNoYXIgPT0gJ1xcbicpIHtcbiAgICBsaW5lKys7XG4gICAgY2hhcmFjdGVyID0gMDtcbiAgfSBlbHNlIHtcbiAgICBjaGFyYWN0ZXIrKztcbiAgfVxuICBjb250ZXh0LnBvc2l0aW9uID0ge29mZnNldCwgbGluZSwgY2hhcmFjdGVyfTtcbn1cblxuXG4vKipcbiAqIFJlYWQgYSBzaW5nbGUgY2hhcmFjdGVyIGZyb20gdGhlIGlucHV0LiBJZiBhIGB2YWxpZGAgc3RyaW5nIGlzIHBhc3NlZCwgdmFsaWRhdGUgdGhhdCB0aGVcbiAqIGNoYXJhY3RlciBpcyBpbmNsdWRlZCBpbiB0aGUgdmFsaWQgc3RyaW5nLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX3Rva2VuKGNvbnRleHQ6IEpzb25QYXJzZXJDb250ZXh0LCB2YWxpZDogc3RyaW5nKTogc3RyaW5nO1xuZnVuY3Rpb24gX3Rva2VuKGNvbnRleHQ6IEpzb25QYXJzZXJDb250ZXh0KTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuZnVuY3Rpb24gX3Rva2VuKGNvbnRleHQ6IEpzb25QYXJzZXJDb250ZXh0LCB2YWxpZD86IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGNoYXIgPSBfcGVlayhjb250ZXh0KTtcbiAgaWYgKHZhbGlkKSB7XG4gICAgaWYgKCFjaGFyKSB7XG4gICAgICB0aHJvdyBuZXcgVW5leHBlY3RlZEVuZE9mSW5wdXRFeGNlcHRpb24oY29udGV4dCk7XG4gICAgfVxuICAgIGlmICh2YWxpZC5pbmRleE9mKGNoYXIpID09IC0xKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZEpzb25DaGFyYWN0ZXJFeGNlcHRpb24oY29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgLy8gTW92ZSB0aGUgcG9zaXRpb24gb2YgdGhlIGNvbnRleHQgdG8gdGhlIG5leHQgY2hhcmFjdGVyLlxuICBfbmV4dChjb250ZXh0KTtcblxuICByZXR1cm4gY2hhcjtcbn1cblxuXG4vKipcbiAqIFJlYWQgdGhlIGV4cG9uZW50IHBhcnQgb2YgYSBudW1iZXIuIFRoZSBleHBvbmVudCBwYXJ0IGlzIGxvb3NlciBmb3IgSlNPTiB0aGFuIHRoZSBudW1iZXJcbiAqIHBhcnQuIGBzdHJgIGlzIHRoZSBzdHJpbmcgb2YgdGhlIG51bWJlciBpdHNlbGYgZm91bmQgc28gZmFyLCBhbmQgc3RhcnQgdGhlIHBvc2l0aW9uXG4gKiB3aGVyZSB0aGUgZnVsbCBudW1iZXIgc3RhcnRlZC4gUmV0dXJucyB0aGUgbm9kZSBmb3VuZC5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9yZWFkRXhwTnVtYmVyKGNvbnRleHQ6IEpzb25QYXJzZXJDb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQ6IFBvc2l0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyOiBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21tZW50czogKEpzb25Bc3RDb21tZW50IHwgSnNvbkFzdE11bHRpbGluZUNvbW1lbnQpW10pOiBKc29uQXN0TnVtYmVyIHtcbiAgbGV0IGNoYXI7XG4gIGxldCBzaWduZWQgPSBmYWxzZTtcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIGNoYXIgPSBfdG9rZW4oY29udGV4dCk7XG4gICAgaWYgKGNoYXIgPT0gJysnIHx8IGNoYXIgPT0gJy0nKSB7XG4gICAgICBpZiAoc2lnbmVkKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgc2lnbmVkID0gdHJ1ZTtcbiAgICAgIHN0ciArPSBjaGFyO1xuICAgIH0gZWxzZSBpZiAoY2hhciA9PSAnMCcgfHwgY2hhciA9PSAnMScgfHwgY2hhciA9PSAnMicgfHwgY2hhciA9PSAnMycgfHwgY2hhciA9PSAnNCdcbiAgICAgICAgfHwgY2hhciA9PSAnNScgfHwgY2hhciA9PSAnNicgfHwgY2hhciA9PSAnNycgfHwgY2hhciA9PSAnOCcgfHwgY2hhciA9PSAnOScpIHtcbiAgICAgIHNpZ25lZCA9IHRydWU7XG4gICAgICBzdHIgKz0gY2hhcjtcbiAgICB9IGVsc2Uge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gV2UncmUgZG9uZSByZWFkaW5nIHRoaXMgbnVtYmVyLlxuICBjb250ZXh0LnBvc2l0aW9uID0gY29udGV4dC5wcmV2aW91cztcblxuICByZXR1cm4ge1xuICAgIGtpbmQ6ICdudW1iZXInLFxuICAgIHN0YXJ0LFxuICAgIGVuZDogY29udGV4dC5wb3NpdGlvbixcbiAgICB0ZXh0OiBjb250ZXh0Lm9yaWdpbmFsLnN1YnN0cmluZyhzdGFydC5vZmZzZXQsIGNvbnRleHQucG9zaXRpb24ub2Zmc2V0KSxcbiAgICB2YWx1ZTogTnVtYmVyLnBhcnNlRmxvYXQoc3RyKSxcbiAgICBjb21tZW50czogY29tbWVudHMsXG4gIH07XG59XG5cblxuLyoqXG4gKiBSZWFkIGEgbnVtYmVyIGZyb20gdGhlIGNvbnRleHQuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfcmVhZE51bWJlcihjb250ZXh0OiBKc29uUGFyc2VyQ29udGV4dCwgY29tbWVudHMgPSBfcmVhZEJsYW5rcyhjb250ZXh0KSk6IEpzb25Bc3ROdW1iZXIge1xuICBsZXQgc3RyID0gJyc7XG4gIGxldCBkb3R0ZWQgPSBmYWxzZTtcbiAgY29uc3Qgc3RhcnQgPSBjb250ZXh0LnBvc2l0aW9uO1xuXG4gIC8vIHJlYWQgdW50aWwgYGVgIG9yIGVuZCBvZiBsaW5lLlxuICB3aGlsZSAodHJ1ZSkge1xuICAgIGNvbnN0IGNoYXIgPSBfdG9rZW4oY29udGV4dCk7XG5cbiAgICAvLyBSZWFkIHRva2Vucywgb25lIGJ5IG9uZS5cbiAgICBpZiAoY2hhciA9PSAnLScpIHtcbiAgICAgIGlmIChzdHIgIT0gJycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEludmFsaWRKc29uQ2hhcmFjdGVyRXhjZXB0aW9uKGNvbnRleHQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoY2hhciA9PSAnMCcpIHtcbiAgICAgIGlmIChzdHIgPT0gJzAnIHx8IHN0ciA9PSAnLTAnKSB7XG4gICAgICAgIHRocm93IG5ldyBJbnZhbGlkSnNvbkNoYXJhY3RlckV4Y2VwdGlvbihjb250ZXh0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNoYXIgPT0gJzEnIHx8IGNoYXIgPT0gJzInIHx8IGNoYXIgPT0gJzMnIHx8IGNoYXIgPT0gJzQnIHx8IGNoYXIgPT0gJzUnXG4gICAgICAgIHx8IGNoYXIgPT0gJzYnIHx8IGNoYXIgPT0gJzcnIHx8IGNoYXIgPT0gJzgnIHx8IGNoYXIgPT0gJzknKSB7XG4gICAgICBpZiAoc3RyID09ICcwJyB8fCBzdHIgPT0gJy0wJykge1xuICAgICAgICB0aHJvdyBuZXcgSW52YWxpZEpzb25DaGFyYWN0ZXJFeGNlcHRpb24oY29udGV4dCk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChjaGFyID09ICcuJykge1xuICAgICAgaWYgKGRvdHRlZCkge1xuICAgICAgICB0aHJvdyBuZXcgSW52YWxpZEpzb25DaGFyYWN0ZXJFeGNlcHRpb24oY29udGV4dCk7XG4gICAgICB9XG4gICAgICBkb3R0ZWQgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoY2hhciA9PSAnZScgfHwgY2hhciA9PSAnRScpIHtcbiAgICAgIHJldHVybiBfcmVhZEV4cE51bWJlcihjb250ZXh0LCBzdGFydCwgc3RyICsgY2hhciwgY29tbWVudHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBXZSdyZSBkb25lIHJlYWRpbmcgdGhpcyBudW1iZXIuXG4gICAgICBjb250ZXh0LnBvc2l0aW9uID0gY29udGV4dC5wcmV2aW91cztcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAga2luZDogJ251bWJlcicsXG4gICAgICAgIHN0YXJ0LFxuICAgICAgICBlbmQ6IGNvbnRleHQucG9zaXRpb24sXG4gICAgICAgIHRleHQ6IGNvbnRleHQub3JpZ2luYWwuc3Vic3RyaW5nKHN0YXJ0Lm9mZnNldCwgY29udGV4dC5wb3NpdGlvbi5vZmZzZXQpLFxuICAgICAgICB2YWx1ZTogTnVtYmVyLnBhcnNlRmxvYXQoc3RyKSxcbiAgICAgICAgY29tbWVudHMsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHN0ciArPSBjaGFyO1xuICB9XG59XG5cblxuLyoqXG4gKiBSZWFkIGEgc3RyaW5nIGZyb20gdGhlIGNvbnRleHQuIFRha2VzIHRoZSBjb21tZW50cyBvZiB0aGUgc3RyaW5nIG9yIHJlYWQgdGhlIGJsYW5rcyBiZWZvcmUgdGhlXG4gKiBzdHJpbmcuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfcmVhZFN0cmluZyhjb250ZXh0OiBKc29uUGFyc2VyQ29udGV4dCwgY29tbWVudHMgPSBfcmVhZEJsYW5rcyhjb250ZXh0KSk6IEpzb25Bc3RTdHJpbmcge1xuICBjb25zdCBzdGFydCA9IGNvbnRleHQucG9zaXRpb247XG5cbiAgLy8gQ29uc3VtZSB0aGUgZmlyc3Qgc3RyaW5nIGRlbGltaXRlci5cbiAgY29uc3QgZGVsaW0gPSBfdG9rZW4oY29udGV4dCk7XG4gIGlmICgoY29udGV4dC5tb2RlICYgSnNvblBhcnNlTW9kZS5TaW5nbGVRdW90ZXNBbGxvd2VkKSA9PSAwKSB7XG4gICAgaWYgKGRlbGltID09ICdcXCcnKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZEpzb25DaGFyYWN0ZXJFeGNlcHRpb24oY29udGV4dCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGRlbGltICE9ICdcXCcnICYmIGRlbGltICE9ICdcIicpIHtcbiAgICB0aHJvdyBuZXcgSW52YWxpZEpzb25DaGFyYWN0ZXJFeGNlcHRpb24oY29udGV4dCk7XG4gIH1cblxuICBsZXQgc3RyID0gJyc7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgbGV0IGNoYXIgPSBfdG9rZW4oY29udGV4dCk7XG4gICAgaWYgKGNoYXIgPT0gZGVsaW0pIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGtpbmQ6ICdzdHJpbmcnLFxuICAgICAgICBzdGFydCxcbiAgICAgICAgZW5kOiBjb250ZXh0LnBvc2l0aW9uLFxuICAgICAgICB0ZXh0OiBjb250ZXh0Lm9yaWdpbmFsLnN1YnN0cmluZyhzdGFydC5vZmZzZXQsIGNvbnRleHQucG9zaXRpb24ub2Zmc2V0KSxcbiAgICAgICAgdmFsdWU6IHN0cixcbiAgICAgICAgY29tbWVudHM6IGNvbW1lbnRzLFxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGNoYXIgPT0gJ1xcXFwnKSB7XG4gICAgICBjaGFyID0gX3Rva2VuKGNvbnRleHQpO1xuICAgICAgc3dpdGNoIChjaGFyKSB7XG4gICAgICAgIGNhc2UgJ1xcXFwnOlxuICAgICAgICBjYXNlICdcXC8nOlxuICAgICAgICBjYXNlICdcIic6XG4gICAgICAgIGNhc2UgZGVsaW06XG4gICAgICAgICAgc3RyICs9IGNoYXI7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAnYic6IHN0ciArPSAnXFxiJzsgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2YnOiBzdHIgKz0gJ1xcZic7IGJyZWFrO1xuICAgICAgICBjYXNlICduJzogc3RyICs9ICdcXG4nOyBicmVhaztcbiAgICAgICAgY2FzZSAncic6IHN0ciArPSAnXFxyJzsgYnJlYWs7XG4gICAgICAgIGNhc2UgJ3QnOiBzdHIgKz0gJ1xcdCc7IGJyZWFrO1xuICAgICAgICBjYXNlICd1JzpcbiAgICAgICAgICBjb25zdCBbYzBdID0gX3Rva2VuKGNvbnRleHQsICcwMTIzNDU2Nzg5YWJjZGVmQUJDREVGJyk7XG4gICAgICAgICAgY29uc3QgW2MxXSA9IF90b2tlbihjb250ZXh0LCAnMDEyMzQ1Njc4OWFiY2RlZkFCQ0RFRicpO1xuICAgICAgICAgIGNvbnN0IFtjMl0gPSBfdG9rZW4oY29udGV4dCwgJzAxMjM0NTY3ODlhYmNkZWZBQkNERUYnKTtcbiAgICAgICAgICBjb25zdCBbYzNdID0gX3Rva2VuKGNvbnRleHQsICcwMTIzNDU2Nzg5YWJjZGVmQUJDREVGJyk7XG4gICAgICAgICAgc3RyICs9IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoYzAgKyBjMSArIGMyICsgYzMsIDE2KSk7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSB1bmRlZmluZWQ6XG4gICAgICAgICAgdGhyb3cgbmV3IFVuZXhwZWN0ZWRFbmRPZklucHV0RXhjZXB0aW9uKGNvbnRleHQpO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkSnNvbkNoYXJhY3RlckV4Y2VwdGlvbihjb250ZXh0KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGNoYXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IFVuZXhwZWN0ZWRFbmRPZklucHV0RXhjZXB0aW9uKGNvbnRleHQpO1xuICAgIH0gZWxzZSBpZiAoY2hhciA9PSAnXFxiJyB8fCBjaGFyID09ICdcXGYnIHx8IGNoYXIgPT0gJ1xcbicgfHwgY2hhciA9PSAnXFxyJyB8fCBjaGFyID09ICdcXHQnKSB7XG4gICAgICB0aHJvdyBuZXcgSW52YWxpZEpzb25DaGFyYWN0ZXJFeGNlcHRpb24oY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSBjaGFyO1xuICAgIH1cbiAgfVxufVxuXG5cbi8qKlxuICogUmVhZCB0aGUgY29uc3RhbnQgYHRydWVgIGZyb20gdGhlIGNvbnRleHQuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfcmVhZFRydWUoY29udGV4dDogSnNvblBhcnNlckNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgY29tbWVudHMgPSBfcmVhZEJsYW5rcyhjb250ZXh0KSk6IEpzb25Bc3RDb25zdGFudFRydWUge1xuICBjb25zdCBzdGFydCA9IGNvbnRleHQucG9zaXRpb247XG4gIF90b2tlbihjb250ZXh0LCAndCcpO1xuICBfdG9rZW4oY29udGV4dCwgJ3InKTtcbiAgX3Rva2VuKGNvbnRleHQsICd1Jyk7XG4gIF90b2tlbihjb250ZXh0LCAnZScpO1xuXG4gIGNvbnN0IGVuZCA9IGNvbnRleHQucG9zaXRpb247XG5cbiAgcmV0dXJuIHtcbiAgICBraW5kOiAndHJ1ZScsXG4gICAgc3RhcnQsXG4gICAgZW5kLFxuICAgIHRleHQ6IGNvbnRleHQub3JpZ2luYWwuc3Vic3RyaW5nKHN0YXJ0Lm9mZnNldCwgZW5kLm9mZnNldCksXG4gICAgdmFsdWU6IHRydWUsXG4gICAgY29tbWVudHMsXG4gIH07XG59XG5cblxuLyoqXG4gKiBSZWFkIHRoZSBjb25zdGFudCBgZmFsc2VgIGZyb20gdGhlIGNvbnRleHQuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfcmVhZEZhbHNlKGNvbnRleHQ6IEpzb25QYXJzZXJDb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICBjb21tZW50cyA9IF9yZWFkQmxhbmtzKGNvbnRleHQpKTogSnNvbkFzdENvbnN0YW50RmFsc2Uge1xuICBjb25zdCBzdGFydCA9IGNvbnRleHQucG9zaXRpb247XG4gIF90b2tlbihjb250ZXh0LCAnZicpO1xuICBfdG9rZW4oY29udGV4dCwgJ2EnKTtcbiAgX3Rva2VuKGNvbnRleHQsICdsJyk7XG4gIF90b2tlbihjb250ZXh0LCAncycpO1xuICBfdG9rZW4oY29udGV4dCwgJ2UnKTtcblxuICBjb25zdCBlbmQgPSBjb250ZXh0LnBvc2l0aW9uO1xuXG4gIHJldHVybiB7XG4gICAga2luZDogJ2ZhbHNlJyxcbiAgICBzdGFydCxcbiAgICBlbmQsXG4gICAgdGV4dDogY29udGV4dC5vcmlnaW5hbC5zdWJzdHJpbmcoc3RhcnQub2Zmc2V0LCBlbmQub2Zmc2V0KSxcbiAgICB2YWx1ZTogZmFsc2UsXG4gICAgY29tbWVudHMsXG4gIH07XG59XG5cblxuLyoqXG4gKiBSZWFkIHRoZSBjb25zdGFudCBgbnVsbGAgZnJvbSB0aGUgY29udGV4dC5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9yZWFkTnVsbChjb250ZXh0OiBKc29uUGFyc2VyQ29udGV4dCxcbiAgICAgICAgICAgICAgICAgICBjb21tZW50cyA9IF9yZWFkQmxhbmtzKGNvbnRleHQpKTogSnNvbkFzdENvbnN0YW50TnVsbCB7XG4gIGNvbnN0IHN0YXJ0ID0gY29udGV4dC5wb3NpdGlvbjtcblxuICBfdG9rZW4oY29udGV4dCwgJ24nKTtcbiAgX3Rva2VuKGNvbnRleHQsICd1Jyk7XG4gIF90b2tlbihjb250ZXh0LCAnbCcpO1xuICBfdG9rZW4oY29udGV4dCwgJ2wnKTtcblxuICBjb25zdCBlbmQgPSBjb250ZXh0LnBvc2l0aW9uO1xuXG4gIHJldHVybiB7XG4gICAga2luZDogJ251bGwnLFxuICAgIHN0YXJ0LFxuICAgIGVuZCxcbiAgICB0ZXh0OiBjb250ZXh0Lm9yaWdpbmFsLnN1YnN0cmluZyhzdGFydC5vZmZzZXQsIGVuZC5vZmZzZXQpLFxuICAgIHZhbHVlOiBudWxsLFxuICAgIGNvbW1lbnRzOiBjb21tZW50cyxcbiAgfTtcbn1cblxuXG4vKipcbiAqIFJlYWQgYW4gYXJyYXkgb2YgSlNPTiB2YWx1ZXMgZnJvbSB0aGUgY29udGV4dC5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9yZWFkQXJyYXkoY29udGV4dDogSnNvblBhcnNlckNvbnRleHQsIGNvbW1lbnRzID0gX3JlYWRCbGFua3MoY29udGV4dCkpOiBKc29uQXN0QXJyYXkge1xuICBjb25zdCBzdGFydCA9IGNvbnRleHQucG9zaXRpb247XG5cbiAgLy8gQ29uc3VtZSB0aGUgZmlyc3QgZGVsaW1pdGVyLlxuICBfdG9rZW4oY29udGV4dCwgJ1snKTtcbiAgY29uc3QgdmFsdWU6IEpzb25BcnJheSA9IFtdO1xuICBjb25zdCBlbGVtZW50czogSnNvbkFzdE5vZGVbXSA9IFtdO1xuXG4gIF9yZWFkQmxhbmtzKGNvbnRleHQpO1xuICBpZiAoX3BlZWsoY29udGV4dCkgIT0gJ10nKSB7XG4gICAgY29uc3Qgbm9kZSA9IF9yZWFkVmFsdWUoY29udGV4dCk7XG4gICAgZWxlbWVudHMucHVzaChub2RlKTtcbiAgICB2YWx1ZS5wdXNoKG5vZGUudmFsdWUpO1xuICB9XG5cbiAgd2hpbGUgKF9wZWVrKGNvbnRleHQpICE9ICddJykge1xuICAgIF90b2tlbihjb250ZXh0LCAnLCcpO1xuXG4gICAgY29uc3Qgbm9kZSA9IF9yZWFkVmFsdWUoY29udGV4dCk7XG4gICAgZWxlbWVudHMucHVzaChub2RlKTtcbiAgICB2YWx1ZS5wdXNoKG5vZGUudmFsdWUpO1xuICB9XG5cbiAgX3Rva2VuKGNvbnRleHQsICddJyk7XG5cbiAgcmV0dXJuIHtcbiAgICBraW5kOiAnYXJyYXknLFxuICAgIHN0YXJ0LFxuICAgIGVuZDogY29udGV4dC5wb3NpdGlvbixcbiAgICB0ZXh0OiBjb250ZXh0Lm9yaWdpbmFsLnN1YnN0cmluZyhzdGFydC5vZmZzZXQsIGNvbnRleHQucG9zaXRpb24ub2Zmc2V0KSxcbiAgICB2YWx1ZSxcbiAgICBlbGVtZW50cyxcbiAgICBjb21tZW50cyxcbiAgfTtcbn1cblxuXG4vKipcbiAqIFJlYWQgYW4gaWRlbnRpZmllciBmcm9tIHRoZSBjb250ZXh0LiBBbiBpZGVudGlmaWVyIGlzIGEgdmFsaWQgSmF2YVNjcmlwdCBpZGVudGlmaWVyLCBhbmQgdGhpc1xuICogZnVuY3Rpb24gaXMgb25seSB1c2VkIGluIExvb3NlIG1vZGUuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBfcmVhZElkZW50aWZpZXIoY29udGV4dDogSnNvblBhcnNlckNvbnRleHQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudHMgPSBfcmVhZEJsYW5rcyhjb250ZXh0KSk6IEpzb25Bc3RJZGVudGlmaWVyIHtcbiAgY29uc3Qgc3RhcnQgPSBjb250ZXh0LnBvc2l0aW9uO1xuXG4gIGxldCBjaGFyID0gX3BlZWsoY29udGV4dCk7XG4gIGlmIChjaGFyICYmICcwMTIzNDU2Nzg5Jy5pbmRleE9mKGNoYXIpICE9IC0xKSB7XG4gICAgY29uc3QgaWRlbnRpZmllck5vZGUgPSBfcmVhZE51bWJlcihjb250ZXh0KTtcblxuICAgIHJldHVybiB7XG4gICAgICBraW5kOiAnaWRlbnRpZmllcicsXG4gICAgICBzdGFydCxcbiAgICAgIGVuZDogaWRlbnRpZmllck5vZGUuZW5kLFxuICAgICAgdGV4dDogaWRlbnRpZmllck5vZGUudGV4dCxcbiAgICAgIHZhbHVlOiBpZGVudGlmaWVyTm9kZS52YWx1ZS50b1N0cmluZygpLFxuICAgIH07XG4gIH1cblxuICBjb25zdCBpZGVudFZhbGlkRmlyc3RDaGFyID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU9QUVJTVFVWV1hZWic7XG4gIGNvbnN0IGlkZW50VmFsaWRDaGFyID0gJ18kYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OSc7XG4gIGxldCBmaXJzdCA9IHRydWU7XG4gIGxldCB2YWx1ZSA9ICcnO1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgY2hhciA9IF90b2tlbihjb250ZXh0KTtcbiAgICBpZiAoY2hhciA9PSB1bmRlZmluZWRcbiAgICAgICAgfHwgKGZpcnN0ID8gaWRlbnRWYWxpZEZpcnN0Q2hhci5pbmRleE9mKGNoYXIpIDogaWRlbnRWYWxpZENoYXIuaW5kZXhPZihjaGFyKSkgPT0gLTEpIHtcbiAgICAgIGNvbnRleHQucG9zaXRpb24gPSBjb250ZXh0LnByZXZpb3VzO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBraW5kOiAnaWRlbnRpZmllcicsXG4gICAgICAgIHN0YXJ0LFxuICAgICAgICBlbmQ6IGNvbnRleHQucG9zaXRpb24sXG4gICAgICAgIHRleHQ6IGNvbnRleHQub3JpZ2luYWwuc3Vic3RyKHN0YXJ0Lm9mZnNldCwgY29udGV4dC5wb3NpdGlvbi5vZmZzZXQpLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgY29tbWVudHMsXG4gICAgICB9O1xuICAgIH1cblxuICAgIHZhbHVlICs9IGNoYXI7XG4gICAgZmlyc3QgPSBmYWxzZTtcbiAgfVxufVxuXG5cbi8qKlxuICogUmVhZCBhIHByb3BlcnR5IGZyb20gdGhlIGNvbnRleHQuIEEgcHJvcGVydHkgaXMgYSBzdHJpbmcgb3IgKGluIExvb3NlIG1vZGUgb25seSkgYSBudW1iZXIgb3JcbiAqIGFuIGlkZW50aWZpZXIsIGZvbGxvd2VkIGJ5IGEgY29sb24gYDpgLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX3JlYWRQcm9wZXJ0eShjb250ZXh0OiBKc29uUGFyc2VyQ29udGV4dCxcbiAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudHMgPSBfcmVhZEJsYW5rcyhjb250ZXh0KSk6IEpzb25Bc3RLZXlWYWx1ZSB7XG4gIGNvbnN0IHN0YXJ0ID0gY29udGV4dC5wb3NpdGlvbjtcblxuICBsZXQga2V5O1xuICBpZiAoKGNvbnRleHQubW9kZSAmIEpzb25QYXJzZU1vZGUuSWRlbnRpZmllcktleU5hbWVzQWxsb3dlZCkgIT0gMCkge1xuICAgIGNvbnN0IHRvcCA9IF9wZWVrKGNvbnRleHQpO1xuICAgIGlmICh0b3AgPT0gJ1wiJyB8fCB0b3AgPT0gJ1xcJycpIHtcbiAgICAgIGtleSA9IF9yZWFkU3RyaW5nKGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBrZXkgPSBfcmVhZElkZW50aWZpZXIoY29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGtleSA9IF9yZWFkU3RyaW5nKGNvbnRleHQpO1xuICB9XG5cbiAgX3JlYWRCbGFua3MoY29udGV4dCk7XG4gIF90b2tlbihjb250ZXh0LCAnOicpO1xuICBjb25zdCB2YWx1ZSA9IF9yZWFkVmFsdWUoY29udGV4dCk7XG4gIGNvbnN0IGVuZCA9IGNvbnRleHQucG9zaXRpb247XG5cbiAgcmV0dXJuIHtcbiAgICBraW5kOiAna2V5dmFsdWUnLFxuICAgIGtleSxcbiAgICB2YWx1ZSxcbiAgICBzdGFydCxcbiAgICBlbmQsXG4gICAgdGV4dDogY29udGV4dC5vcmlnaW5hbC5zdWJzdHJpbmcoc3RhcnQub2Zmc2V0LCBlbmQub2Zmc2V0KSxcbiAgICBjb21tZW50cyxcbiAgfTtcbn1cblxuXG4vKipcbiAqIFJlYWQgYW4gb2JqZWN0IG9mIHByb3BlcnRpZXMgLT4gSlNPTiB2YWx1ZXMgZnJvbSB0aGUgY29udGV4dC5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9yZWFkT2JqZWN0KGNvbnRleHQ6IEpzb25QYXJzZXJDb250ZXh0LFxuICAgICAgICAgICAgICAgICAgICAgY29tbWVudHMgPSBfcmVhZEJsYW5rcyhjb250ZXh0KSk6IEpzb25Bc3RPYmplY3Qge1xuICBjb25zdCBzdGFydCA9IGNvbnRleHQucG9zaXRpb247XG4gIC8vIENvbnN1bWUgdGhlIGZpcnN0IGRlbGltaXRlci5cbiAgX3Rva2VuKGNvbnRleHQsICd7Jyk7XG4gIGNvbnN0IHZhbHVlOiBKc29uT2JqZWN0ID0ge307XG4gIGNvbnN0IHByb3BlcnRpZXM6IEpzb25Bc3RLZXlWYWx1ZVtdID0gW107XG5cbiAgX3JlYWRCbGFua3MoY29udGV4dCk7XG4gIGlmIChfcGVlayhjb250ZXh0KSAhPSAnfScpIHtcbiAgICBjb25zdCBwcm9wZXJ0eSA9IF9yZWFkUHJvcGVydHkoY29udGV4dCk7XG4gICAgdmFsdWVbcHJvcGVydHkua2V5LnZhbHVlXSA9IHByb3BlcnR5LnZhbHVlLnZhbHVlO1xuICAgIHByb3BlcnRpZXMucHVzaChwcm9wZXJ0eSk7XG5cbiAgICB3aGlsZSAoX3BlZWsoY29udGV4dCkgIT0gJ30nKSB7XG4gICAgICBfdG9rZW4oY29udGV4dCwgJywnKTtcblxuICAgICAgY29uc3QgcHJvcGVydHkgPSBfcmVhZFByb3BlcnR5KGNvbnRleHQpO1xuICAgICAgdmFsdWVbcHJvcGVydHkua2V5LnZhbHVlXSA9IHByb3BlcnR5LnZhbHVlLnZhbHVlO1xuICAgICAgcHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcbiAgICB9XG4gIH1cblxuICBfdG9rZW4oY29udGV4dCwgJ30nKTtcblxuICByZXR1cm4ge1xuICAgIGtpbmQ6ICdvYmplY3QnLFxuICAgIHByb3BlcnRpZXMsXG4gICAgc3RhcnQsXG4gICAgZW5kOiBjb250ZXh0LnBvc2l0aW9uLFxuICAgIHZhbHVlLFxuICAgIHRleHQ6IGNvbnRleHQub3JpZ2luYWwuc3Vic3RyaW5nKHN0YXJ0Lm9mZnNldCwgY29udGV4dC5wb3NpdGlvbi5vZmZzZXQpLFxuICAgIGNvbW1lbnRzLFxuICB9O1xufVxuXG5cbi8qKlxuICogUmVtb3ZlIGFueSBibGFuayBjaGFyYWN0ZXIgb3IgY29tbWVudHMgKGluIExvb3NlIG1vZGUpIGZyb20gdGhlIGNvbnRleHQsIHJldHVybmluZyBhbiBhcnJheVxuICogb2YgY29tbWVudHMgaWYgYW55IGFyZSBmb3VuZC5cbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIF9yZWFkQmxhbmtzKGNvbnRleHQ6IEpzb25QYXJzZXJDb250ZXh0KTogKEpzb25Bc3RDb21tZW50IHwgSnNvbkFzdE11bHRpbGluZUNvbW1lbnQpW10ge1xuICBpZiAoKGNvbnRleHQubW9kZSAmIEpzb25QYXJzZU1vZGUuQ29tbWVudHNBbGxvd2VkKSAhPSAwKSB7XG4gICAgY29uc3QgY29tbWVudHM6IChKc29uQXN0Q29tbWVudCB8IEpzb25Bc3RNdWx0aWxpbmVDb21tZW50KVtdID0gW107XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGxldCBjaGFyID0gY29udGV4dC5vcmlnaW5hbFtjb250ZXh0LnBvc2l0aW9uLm9mZnNldF07XG4gICAgICBpZiAoY2hhciA9PSAnLycgJiYgY29udGV4dC5vcmlnaW5hbFtjb250ZXh0LnBvc2l0aW9uLm9mZnNldCArIDFdID09ICcqJykge1xuICAgICAgICBjb25zdCBzdGFydCA9IGNvbnRleHQucG9zaXRpb247XG4gICAgICAgIC8vIE11bHRpIGxpbmUgY29tbWVudC5cbiAgICAgICAgX25leHQoY29udGV4dCk7XG4gICAgICAgIF9uZXh0KGNvbnRleHQpO1xuICAgICAgICBjaGFyID0gY29udGV4dC5vcmlnaW5hbFtjb250ZXh0LnBvc2l0aW9uLm9mZnNldF07XG4gICAgICAgIHdoaWxlIChjb250ZXh0Lm9yaWdpbmFsW2NvbnRleHQucG9zaXRpb24ub2Zmc2V0XSAhPSAnKidcbiAgICAgICAgICAgIHx8IGNvbnRleHQub3JpZ2luYWxbY29udGV4dC5wb3NpdGlvbi5vZmZzZXQgKyAxXSAhPSAnLycpIHtcbiAgICAgICAgICBfbmV4dChjb250ZXh0KTtcbiAgICAgICAgICBpZiAoY29udGV4dC5wb3NpdGlvbi5vZmZzZXQgPj0gY29udGV4dC5vcmlnaW5hbC5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBVbmV4cGVjdGVkRW5kT2ZJbnB1dEV4Y2VwdGlvbihjb250ZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gUmVtb3ZlIFwiKi9cIi5cbiAgICAgICAgX25leHQoY29udGV4dCk7XG4gICAgICAgIF9uZXh0KGNvbnRleHQpO1xuXG4gICAgICAgIGNvbW1lbnRzLnB1c2goe1xuICAgICAgICAgIGtpbmQ6ICdtdWx0aWNvbW1lbnQnLFxuICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgIGVuZDogY29udGV4dC5wb3NpdGlvbixcbiAgICAgICAgICB0ZXh0OiBjb250ZXh0Lm9yaWdpbmFsLnN1YnN0cmluZyhzdGFydC5vZmZzZXQsIGNvbnRleHQucG9zaXRpb24ub2Zmc2V0KSxcbiAgICAgICAgICBjb250ZW50OiBjb250ZXh0Lm9yaWdpbmFsLnN1YnN0cmluZyhzdGFydC5vZmZzZXQgKyAyLCBjb250ZXh0LnBvc2l0aW9uLm9mZnNldCAtIDIpLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhciA9PSAnLycgJiYgY29udGV4dC5vcmlnaW5hbFtjb250ZXh0LnBvc2l0aW9uLm9mZnNldCArIDFdID09ICcvJykge1xuICAgICAgICBjb25zdCBzdGFydCA9IGNvbnRleHQucG9zaXRpb247XG4gICAgICAgIC8vIE11bHRpIGxpbmUgY29tbWVudC5cbiAgICAgICAgX25leHQoY29udGV4dCk7XG4gICAgICAgIF9uZXh0KGNvbnRleHQpO1xuICAgICAgICBjaGFyID0gY29udGV4dC5vcmlnaW5hbFtjb250ZXh0LnBvc2l0aW9uLm9mZnNldF07XG4gICAgICAgIHdoaWxlIChjb250ZXh0Lm9yaWdpbmFsW2NvbnRleHQucG9zaXRpb24ub2Zmc2V0XSAhPSAnXFxuJykge1xuICAgICAgICAgIF9uZXh0KGNvbnRleHQpO1xuICAgICAgICAgIGlmIChjb250ZXh0LnBvc2l0aW9uLm9mZnNldCA+PSBjb250ZXh0Lm9yaWdpbmFsLmxlbmd0aCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVtb3ZlIFwiXFxuXCIuXG4gICAgICAgIGlmIChjb250ZXh0LnBvc2l0aW9uLm9mZnNldCA8IGNvbnRleHQub3JpZ2luYWwubGVuZ3RoKSB7XG4gICAgICAgICAgX25leHQoY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgY29tbWVudHMucHVzaCh7XG4gICAgICAgICAga2luZDogJ2NvbW1lbnQnLFxuICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgIGVuZDogY29udGV4dC5wb3NpdGlvbixcbiAgICAgICAgICB0ZXh0OiBjb250ZXh0Lm9yaWdpbmFsLnN1YnN0cmluZyhzdGFydC5vZmZzZXQsIGNvbnRleHQucG9zaXRpb24ub2Zmc2V0KSxcbiAgICAgICAgICBjb250ZW50OiBjb250ZXh0Lm9yaWdpbmFsLnN1YnN0cmluZyhzdGFydC5vZmZzZXQgKyAyLCBjb250ZXh0LnBvc2l0aW9uLm9mZnNldCAtIDEpLFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoY2hhciA9PSAnICcgfHwgY2hhciA9PSAnXFx0JyB8fCBjaGFyID09ICdcXG4nIHx8IGNoYXIgPT0gJ1xccicgfHwgY2hhciA9PSAnXFxmJykge1xuICAgICAgICBfbmV4dChjb250ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBjb21tZW50cztcbiAgfSBlbHNlIHtcbiAgICBsZXQgY2hhciA9IGNvbnRleHQub3JpZ2luYWxbY29udGV4dC5wb3NpdGlvbi5vZmZzZXRdO1xuICAgIHdoaWxlIChjaGFyID09ICcgJyB8fCBjaGFyID09ICdcXHQnIHx8IGNoYXIgPT0gJ1xcbicgfHwgY2hhciA9PSAnXFxyJyB8fCBjaGFyID09ICdcXGYnKSB7XG4gICAgICBfbmV4dChjb250ZXh0KTtcbiAgICAgIGNoYXIgPSBjb250ZXh0Lm9yaWdpbmFsW2NvbnRleHQucG9zaXRpb24ub2Zmc2V0XTtcbiAgICB9XG5cbiAgICByZXR1cm4gW107XG4gIH1cbn1cblxuXG4vKipcbiAqIFJlYWQgYSBKU09OIHZhbHVlIGZyb20gdGhlIGNvbnRleHQsIHdoaWNoIGNhbiBiZSBhbnkgZm9ybSBvZiBKU09OIHZhbHVlLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gX3JlYWRWYWx1ZShjb250ZXh0OiBKc29uUGFyc2VyQ29udGV4dCk6IEpzb25Bc3ROb2RlIHtcbiAgbGV0IHJlc3VsdDogSnNvbkFzdE5vZGU7XG5cbiAgLy8gQ2xlYW4gdXAgYmVmb3JlLlxuICBjb25zdCBjb21tZW50cyA9IF9yZWFkQmxhbmtzKGNvbnRleHQpO1xuICBjb25zdCBjaGFyID0gX3BlZWsoY29udGV4dCk7XG4gIHN3aXRjaCAoY2hhcikge1xuICAgIGNhc2UgdW5kZWZpbmVkOlxuICAgICAgdGhyb3cgbmV3IFVuZXhwZWN0ZWRFbmRPZklucHV0RXhjZXB0aW9uKGNvbnRleHQpO1xuXG4gICAgY2FzZSAnLSc6XG4gICAgY2FzZSAnMCc6XG4gICAgY2FzZSAnMSc6XG4gICAgY2FzZSAnMic6XG4gICAgY2FzZSAnMyc6XG4gICAgY2FzZSAnNCc6XG4gICAgY2FzZSAnNSc6XG4gICAgY2FzZSAnNic6XG4gICAgY2FzZSAnNyc6XG4gICAgY2FzZSAnOCc6XG4gICAgY2FzZSAnOSc6XG4gICAgICByZXN1bHQgPSBfcmVhZE51bWJlcihjb250ZXh0LCBjb21tZW50cyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ1xcJyc6XG4gICAgY2FzZSAnXCInOlxuICAgICAgcmVzdWx0ID0gX3JlYWRTdHJpbmcoY29udGV4dCwgY29tbWVudHMpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICd0JzpcbiAgICAgIHJlc3VsdCA9IF9yZWFkVHJ1ZShjb250ZXh0LCBjb21tZW50cyk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdmJzpcbiAgICAgIHJlc3VsdCA9IF9yZWFkRmFsc2UoY29udGV4dCwgY29tbWVudHMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbic6XG4gICAgICByZXN1bHQgPSBfcmVhZE51bGwoY29udGV4dCwgY29tbWVudHMpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdbJzpcbiAgICAgIHJlc3VsdCA9IF9yZWFkQXJyYXkoY29udGV4dCwgY29tbWVudHMpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICd7JzpcbiAgICAgIHJlc3VsdCA9IF9yZWFkT2JqZWN0KGNvbnRleHQsIGNvbW1lbnRzKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBJbnZhbGlkSnNvbkNoYXJhY3RlckV4Y2VwdGlvbihjb250ZXh0KTtcbiAgfVxuXG4gIC8vIENsZWFuIHVwIGFmdGVyLlxuICBfcmVhZEJsYW5rcyhjb250ZXh0KTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qKlxuICogVGhlIFBhcnNlIG1vZGUgdXNlZCBmb3IgcGFyc2luZyB0aGUgSlNPTiBzdHJpbmcuXG4gKi9cbmV4cG9ydCBlbnVtIEpzb25QYXJzZU1vZGUge1xuICBTdHJpY3QgICAgICAgICAgICAgICAgICAgID0gICAgICAwLCAgLy8gU3RhbmRhcmQgSlNPTi5cbiAgQ29tbWVudHNBbGxvd2VkICAgICAgICAgICA9IDEgPDwgMCwgIC8vIEFsbG93cyBjb21tZW50cywgYm90aCBzaW5nbGUgb3IgbXVsdGkgbGluZXMuXG4gIFNpbmdsZVF1b3Rlc0FsbG93ZWQgICAgICAgPSAxIDw8IDEsICAvLyBBbGxvdyBzaW5nbGUgcXVvdGVkIHN0cmluZ3MuXG4gIElkZW50aWZpZXJLZXlOYW1lc0FsbG93ZWQgPSAxIDw8IDIsICAvLyBBbGxvdyBpZGVudGlmaWVycyBhcyBvYmplY3RwIHByb3BlcnRpZXMuXG5cbiAgRGVmYXVsdCAgICAgICAgICAgICAgICAgICA9IFN0cmljdCxcbiAgTG9vc2UgICAgICAgICAgICAgICAgICAgICA9IENvbW1lbnRzQWxsb3dlZCB8IFNpbmdsZVF1b3Rlc0FsbG93ZWQgfCBJZGVudGlmaWVyS2V5TmFtZXNBbGxvd2VkLFxufVxuXG5cbi8qKlxuICogUGFyc2UgdGhlIEpTT04gc3RyaW5nIGFuZCByZXR1cm4gaXRzIEFTVC4gVGhlIEFTVCBtYXkgYmUgbG9zaW5nIGRhdGEgKGVuZCBjb21tZW50cyBhcmVcbiAqIGRpc2NhcmRlZCBmb3IgZXhhbXBsZSwgYW5kIHNwYWNlIGNoYXJhY3RlcnMgYXJlIG5vdCByZXByZXNlbnRlZCBpbiB0aGUgQVNUKSwgYnV0IGFsbCB2YWx1ZXNcbiAqIHdpbGwgaGF2ZSBhIHNpbmdsZSBub2RlIGluIHRoZSBBU1QgKGEgMS10by0xIG1hcHBpbmcpLlxuICogQHBhcmFtIGlucHV0IFRoZSBzdHJpbmcgdG8gdXNlLlxuICogQHBhcmFtIG1vZGUgVGhlIG1vZGUgdG8gcGFyc2UgdGhlIGlucHV0IHdpdGguIHtAc2VlIEpzb25QYXJzZU1vZGV9LlxuICogQHJldHVybnMge0pzb25Bc3ROb2RlfSBUaGUgcm9vdCBub2RlIG9mIHRoZSB2YWx1ZSBvZiB0aGUgQVNULlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VKc29uQXN0KGlucHV0OiBzdHJpbmcsIG1vZGUgPSBKc29uUGFyc2VNb2RlLkRlZmF1bHQpOiBKc29uQXN0Tm9kZSB7XG4gIGlmIChtb2RlID09IEpzb25QYXJzZU1vZGUuRGVmYXVsdCkge1xuICAgIG1vZGUgPSBKc29uUGFyc2VNb2RlLlN0cmljdDtcbiAgfVxuXG4gIGNvbnN0IGNvbnRleHQgPSB7XG4gICAgcG9zaXRpb246IHsgb2Zmc2V0OiAwLCBsaW5lOiAwLCBjaGFyYWN0ZXI6IDAgfSxcbiAgICBwcmV2aW91czogeyBvZmZzZXQ6IDAsIGxpbmU6IDAsIGNoYXJhY3RlcjogMCB9LFxuICAgIG9yaWdpbmFsOiBpbnB1dCxcbiAgICBjb21tZW50czogdW5kZWZpbmVkLFxuICAgIG1vZGUsXG4gIH07XG5cbiAgY29uc3QgYXN0ID0gX3JlYWRWYWx1ZShjb250ZXh0KTtcbiAgaWYgKGNvbnRleHQucG9zaXRpb24ub2Zmc2V0IDwgaW5wdXQubGVuZ3RoKSB7XG4gICAgY29uc3QgcmVzdCA9IGlucHV0LnN1YnN0cihjb250ZXh0LnBvc2l0aW9uLm9mZnNldCk7XG4gICAgY29uc3QgaSA9IHJlc3QubGVuZ3RoID4gMjAgPyByZXN0LnN1YnN0cigwLCAyMCkgKyAnLi4uJyA6IHJlc3Q7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCBlbmQgb2YgZmlsZSwgZ290IFwiJHtpfVwiIGF0IGBcbiAgICAgICAgKyBgJHtjb250ZXh0LnBvc2l0aW9uLmxpbmV9OiR7Y29udGV4dC5wb3NpdGlvbi5jaGFyYWN0ZXJ9LmApO1xuICB9XG5cbiAgcmV0dXJuIGFzdDtcbn1cblxuXG4vKipcbiAqIFBhcnNlIGEgSlNPTiBzdHJpbmcgaW50byBpdHMgdmFsdWUuICBUaGlzIGRpc2NhcmRzIHRoZSBBU1QgYW5kIG9ubHkgcmV0dXJucyB0aGUgdmFsdWUgaXRzZWxmLlxuICogQHBhcmFtIGlucHV0IFRoZSBzdHJpbmcgdG8gcGFyc2UuXG4gKiBAcGFyYW0gbW9kZSBUaGUgbW9kZSB0byBwYXJzZSB0aGUgaW5wdXQgd2l0aC4ge0BzZWUgSnNvblBhcnNlTW9kZX0uXG4gKiBAcmV0dXJucyB7SnNvblZhbHVlfSBUaGUgdmFsdWUgcmVwcmVzZW50ZWQgYnkgdGhlIEpTT04gc3RyaW5nLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VKc29uKGlucHV0OiBzdHJpbmcsIG1vZGUgPSBKc29uUGFyc2VNb2RlLkRlZmF1bHQpOiBKc29uVmFsdWUge1xuICAvLyBUcnkgcGFyc2luZyBmb3IgdGhlIGZhc3Rlc3QgcGF0aCBhdmFpbGFibGUsIGlmIGVycm9yLCB1c2VzIG91ciBvd24gcGFyc2VyIGZvciBiZXR0ZXIgZXJyb3JzLlxuICBpZiAobW9kZSA9PSBKc29uUGFyc2VNb2RlLlN0cmljdCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShpbnB1dCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gcGFyc2VKc29uQXN0KGlucHV0LCBtb2RlKS52YWx1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcGFyc2VKc29uQXN0KGlucHV0LCBtb2RlKS52YWx1ZTtcbn1cbiJdfQ==