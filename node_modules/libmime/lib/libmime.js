'use strict';

var libcharset = require('./charset');
var libbase64 = require('libbase64');
var libqp = require('libqp');
var mimetypes = require('./mimetypes');

var libmime = module.exports = {

    /**
     * Checks if a value is plaintext string (uses only printable 7bit chars)
     *
     * @param {String} value String to be tested
     * @returns {Boolean} true if it is a plaintext string
     */
    isPlainText: function (value) {
        if (typeof value !== 'string' || /[\x00-\x08\x0b\x0c\x0e-\x1f\u0080-\uFFFF]/.test(value)) {
            return false;
        } else {
            return true;
        }
    },

    /**
     * Checks if a multi line string containes lines longer than the selected value.
     *
     * Useful when detecting if a mail message needs any processing at all –
     * if only plaintext characters are used and lines are short, then there is
     * no need to encode the values in any way. If the value is plaintext but has
     * longer lines then allowed, then use format=flowed
     *
     * @param {Number} lineLength Max line length to check for
     * @returns {Boolean} Returns true if there is at least one line longer than lineLength chars
     */
    hasLongerLines: function (str, lineLength) {
        return new RegExp('^.{' + (lineLength + 1) + ',}', 'm').test(str);
    },

    /**
     * Decodes a string from a format=flowed soft wrapping.
     *
     * @param {String} str Plaintext string with format=flowed to decode
     * @param {Boolean} [delSp] If true, delete leading spaces (delsp=yes)
     * @return {String} Mime decoded string
     */
    decodeFlowed: function (str, delSp) {
        str = (str || '').toString();

        return str.
        split(/\r?\n/).
            // remove soft linebreaks
            // soft linebreaks are added after space symbols
        reduce(
                function (previousValue, currentValue, index) {
                    var body = previousValue;
                    if (delSp) {
                        // delsp adds spaces to text to be able to fold it
                        // these spaces can be removed once the text is unfolded
                        body = body.replace(/[ ]+$/, '');
                    }
                    if (/ $/.test(previousValue) && !/(^|\n)\-\- $/.test(previousValue) || index === 1) {
                        return body + currentValue;
                    } else {
                        return body + '\n' + currentValue;
                    }
                }
            ).
            // remove whitespace stuffing
            // http://tools.ietf.org/html/rfc3676#section-4.4
        replace(/^ /gm, '');
    },

    /**
     * Adds soft line breaks to content marked with format=flowed to
     * ensure that no line in the message is never longer than lineLength
     *
     * @param {String} str Plaintext string that requires wrapping
     * @param {Number} [lineLength=76] Maximum length of a line
     * @return {String} String with forced line breaks
     */
    encodeFlowed: function (str, lineLength) {
        lineLength = lineLength || 76;

        var flowed = [];
        str.split(/\r?\n/).forEach(function (line) {
            flowed.push(libmime.foldLines(line.
                // space stuffing http://tools.ietf.org/html/rfc3676#section-4.2
                replace(/^( |From|>)/igm, ' $1'),
                lineLength, true));
        });
        return flowed.join('\r\n');
    },

    /**
     * Encodes a string or an Buffer to an UTF-8 MIME Word (rfc2047)
     *
     * @param {String|Buffer} data String to be encoded
     * @param {String} mimeWordEncoding='Q' Encoding for the mime word, either Q or B
     * @param {Number} [maxLength=0] If set, split mime words into several chunks if needed
     * @return {String} Single or several mime words joined together
     */
    encodeWord: function (data, mimeWordEncoding, maxLength) {
        mimeWordEncoding = (mimeWordEncoding || 'Q').toString().toUpperCase().trim().charAt(0);
        maxLength = maxLength || 0;

        var encodedStr,
            toCharset = 'UTF-8',
            i, len, parts, lpart, chr;

        if (maxLength && maxLength > 7 + toCharset.length) {
            maxLength -= (7 + toCharset.length);
        }

        if (mimeWordEncoding === 'Q') {
            // https://tools.ietf.org/html/rfc2047#section-5 rule (3)
            encodedStr = libqp.encode(data).replace(/[^a-z0-9!*+\-\/=]/ig, function (chr) {
                var ord = chr.charCodeAt(0).toString(16).toUpperCase();
                if (chr === ' ') {
                    return '_';
                } else {
                    return '=' + (ord.length === 1 ? '0' + ord : ord);
                }
            });
        } else if (mimeWordEncoding === 'B') {
            encodedStr = typeof data === 'string' ? data : libbase64.encode(data);
            maxLength = maxLength ? Math.max(3, (maxLength - maxLength % 4) / 4 * 3) : 0;
        }

        if (maxLength && (mimeWordEncoding !== 'B' ? encodedStr : libbase64.encode(data)).length > maxLength) {
            if (mimeWordEncoding === 'Q') {
                encodedStr = splitMimeEncodedString(encodedStr, maxLength).join('?= =?' + toCharset + '?' + mimeWordEncoding + '?');
            } else {
                // RFC2047 6.3 (2) states that encoded-word must include an integral number of characters, so no chopping unicode sequences
                parts = [];
                lpart = '';
                for (i = 0, len = encodedStr.length; i < len; i++) {
                    chr = encodedStr.charAt(i);
                    // check if we can add this character to the existing string
                    // without breaking byte length limit
                    if (Buffer.byteLength(lpart + chr) <= maxLength || i === 0) {
                        lpart += chr;
                    } else {
                        // we hit the length limit, so push the existing string and start over
                        parts.push(libbase64.encode(lpart));
                        lpart = chr;
                    }
                }
                if (lpart) {
                    parts.push(libbase64.encode(lpart));
                }

                if (parts.length > 1) {
                    encodedStr = parts.join('?= =?' + toCharset + '?' + mimeWordEncoding + '?');
                } else {
                    encodedStr = parts.join('');
                }
            }
        } else if (mimeWordEncoding === 'B') {
            encodedStr = libbase64.encode(data);
        }

        return '=?' + toCharset + '?' + mimeWordEncoding + '?' + encodedStr + (encodedStr.substr(-2) === '?=' ? '' : '?=');
    },

    /**
     * Decode a complete mime word encoded string
     *
     * @param {String} str Mime word encoded string
     * @return {String} Decoded unicode string
     */
    decodeWord: function (str) {
        str = (str || '').toString().trim();

        var fromCharset, encoding, match;

        match = str.match(/^\=\?([\w_\-\*]+)\?([QqBb])\?([^\?]+)\?\=$/i);
        if (!match) {
            return str;
        }

        // RFC2231 added language tag to the encoding
        // see: https://tools.ietf.org/html/rfc2231#section-5
        // this implementation silently ignores this tag
        fromCharset = match[1].split('*').shift();

        encoding = (match[2] || 'Q').toString().toUpperCase();
        str = (match[3] || '');

        if (encoding === 'Q') {
            // remove spaces between = and hex char, this might indicate invalidly applied line splitting
            str = str.replace(/=\s+([0-9a-fA-F])/, '=$1');
        }

        // convert all underscores to spaces
        str = str.replace(/_/g, ' ').replace(/ $/, '=20');

        if (encoding === 'B') {
            return libcharset.decode(libbase64.decode(str), fromCharset);
        } else if (encoding === 'Q') {
            return libcharset.decode(libqp.decode(str), fromCharset);
        } else {
            return str;
        }
    },

    /**
     * Finds word sequences with non ascii text and converts these to mime words
     *
     * @param {String|Buffer} data String to be encoded
     * @param {String} mimeWordEncoding='Q' Encoding for the mime word, either Q or B
     * @param {Number} [maxLength=0] If set, split mime words into several chunks if needed
     * @param {String} [fromCharset='UTF-8'] Source sharacter set
     * @return {String} String with possible mime words
     */
    encodeWords: function (data, mimeWordEncoding, maxLength, fromCharset) {
        if (!fromCharset && typeof maxLength === 'string' && !maxLength.match(/^[0-9]+$/)) {
            fromCharset = maxLength;
            maxLength = undefined;
        }

        maxLength = maxLength || 0;

        var decodedValue = libcharset.decode(libcharset.convert((data || ''), fromCharset));
        var encodedValue;

        var firstMatch = decodedValue.match(/(?:^|\s)([^\s]*[\u0080-\uFFFF])/);
        if (!firstMatch) {
            return decodedValue;
        }
        var lastMatch = decodedValue.match(/([\u0080-\uFFFF][^\s]*)[^\u0080-\uFFFF]*$/);
        if (!lastMatch) {
            // should not happen
            return decodedValue;
        }
        var startIndex = firstMatch.index + (firstMatch[0].match(/[^\s]/) || {
            index: 0
        }).index;
        var endIndex = lastMatch.index + (lastMatch[1] || '').length;

        encodedValue =
            (startIndex ? decodedValue.substr(0, startIndex) : '') +
            libmime.encodeWord(decodedValue.substring(startIndex, endIndex), mimeWordEncoding || 'Q', maxLength) +
            (endIndex < decodedValue.length ? decodedValue.substr(endIndex) : '');

        return encodedValue;
    },

    /**
     * Decode a string that might include one or several mime words
     *
     * @param {String} str String including some mime words that will be encoded
     * @return {String} Decoded unicode string
     */
    decodeWords: function (str) {
        return (str || '').toString().

        // find base64 words that can be joined
        replace(/(=\?([^?]+)\?[Bb]\?[^?]+[^^=]\?=)\s*(?==\?([^?]+)\?[Bb]\?[^?]+\?=)/g,
            function (match, left, chLeft, chRight) {
                // only mark b64 chunks to be joined if charsets match
                if (libcharset.normalizeCharset(chLeft || '').toLowerCase().trim() === libcharset.normalizeCharset(chRight || '').toLowerCase().trim()) {
                    // set a joiner marker
                    return left + '__\x00JOIN\x00__';
                }
                return match;
            }).

        // find QP words that can be joined
        replace(/(=\?([^?]+)\?[Qq]\?[^?]+\?=)\s*(?==\?([^?]+)\?[Qq]\?[^?]+\?=)/g,
            function (match, left, chLeft, chRight) {
                // only mark QP chunks to be joined if charsets match
                if (libcharset.normalizeCharset(chLeft || '').toLowerCase().trim() === libcharset.normalizeCharset(chRight || '').toLowerCase().trim()) {
                    // set a joiner marker
                    return left + '__\x00JOIN\x00__';
                }
                return match;
            }).

        // join base64 encoded words
        replace(/(\?=)?__\x00JOIN\x00__(=\?([^?]+)\?[QqBb]\?)?/g, '').

        // remove spaces between mime encoded words
        replace(/(=\?[^?]+\?[QqBb]\?[^?]+\?=)\s+(?==\?[^?]+\?[QqBb]\?[^?]+\?=)/g, '$1').

        // decode words
        replace(/\=\?([\w_\-\*]+)\?([QqBb])\?[^\?]+\?\=/g, function (mimeWord) {
            return libmime.decodeWord(mimeWord);
        });
    },

    /**
     * Splits a string by :
     * The result is not mime word decoded, you need to do your own decoding based
     * on the rules for the specific header key
     *
     * @param {String} headerLine Single header line, might include linebreaks as well if folded
     * @return {Object} And object of {key, value}
     */
    decodeHeader: function (headerLine) {
        var line = (headerLine || '').toString().replace(/(?:\r?\n|\r)[ \t]*/g, ' ').trim(),
            match = line.match(/^\s*([^:]+):(.*)$/),
            key = (match && match[1] || '').trim().toLowerCase(),
            value = (match && match[2] || '').trim();

        return {
            key: key,
            value: value
        };
    },

    /**
     * Parses a block of header lines. Does not decode mime words as every
     * header might have its own rules (eg. formatted email addresses and such)
     *
     * @param {String} headers Headers string
     * @return {Object} An object of headers, where header keys are object keys. NB! Several values with the same key make up an Array
     */
    decodeHeaders: function (headers) {
        var lines = headers.split(/\r?\n|\r/),
            headersObj = {},
            header,
            i, len;

        for (i = lines.length - 1; i >= 0; i--) {
            if (i && lines[i].match(/^\s/)) {
                lines[i - 1] += '\r\n' + lines[i];
                lines.splice(i, 1);
            }
        }

        for (i = 0, len = lines.length; i < len; i++) {
            header = libmime.decodeHeader(lines[i]);
            if (!headersObj[header.key]) {
                headersObj[header.key] = [header.value];
            } else {
                headersObj[header.key].push(header.value);
            }
        }

        return headersObj;
    },

    /**
     * Joins parsed header value together as 'value; param1=value1; param2=value2'
     * PS: We are following RFC 822 for the list of special characters that we need to keep in quotes.
     *      Refer: https://www.w3.org/Protocols/rfc1341/4_Content-Type.html
     * @param {Object} structured Parsed header value
     * @return {String} joined header value
     */
    buildHeaderValue: function (structured) {
        var paramsArray = [];

        Object.keys(structured.params || {}).forEach(function (param) {
            // filename might include unicode characters so it is a special case
            var value = structured.params[param];
            if (!libmime.isPlainText(value) || value.length >= 75) {
                libmime.buildHeaderParam(param, value, 50).forEach(function (encodedParam) {
                    if (!/[\s"\\;:\/=\(\),<>@\[\]\?]|^[\-']|'$/.test(encodedParam.value) || encodedParam.key.substr(-1) === '*') {
                        paramsArray.push(encodedParam.key + '=' + encodedParam.value);
                    } else {
                        paramsArray.push(encodedParam.key + '=' + JSON.stringify(encodedParam.value));
                    }
                });
            } else if (/[\s'"\\;:\/=\(\),<>@\[\]\?]|^\-/.test(value)) {
                paramsArray.push(param + '=' + JSON.stringify(value));
            } else {
                paramsArray.push(param + '=' + value);
            }
        }.bind(this));

        return structured.value + (paramsArray.length ? '; ' + paramsArray.join('; ') : '');
    },

    /**
     * Parses a header value with key=value arguments into a structured
     * object.
     *
     *   parseHeaderValue('content-type: text/plain; CHARSET='UTF-8'') ->
     *   {
     *     'value': 'text/plain',
     *     'params': {
     *       'charset': 'UTF-8'
     *     }
     *   }
     *
     * @param {String} str Header value
     * @return {Object} Header value as a parsed structure
     */
    parseHeaderValue: function (str) {
        var response = {
                value: false,
                params: {}
            },
            key = false,
            value = '',
            type = 'value',
            quote = false,
            escaped = false,
            chr;

        for (var i = 0, len = str.length; i < len; i++) {
            chr = str.charAt(i);
            if (type === 'key') {
                if (chr === '=') {
                    key = value.trim().toLowerCase();
                    type = 'value';
                    value = '';
                    continue;
                }
                value += chr;
            } else {
                if (escaped) {
                    value += chr;
                } else if (chr === '\\') {
                    escaped = true;
                    continue;
                } else if (quote && chr === quote) {
                    quote = false;
                } else if (!quote && chr === '"') {
                    quote = chr;
                } else if (!quote && chr === ';') {
                    if (key === false) {
                        response.value = value.trim();
                    } else {
                        response.params[key] = value.trim();
                    }
                    type = 'key';
                    value = '';
                } else {
                    value += chr;
                }
                escaped = false;

            }
        }

        if (type === 'value') {
            if (key === false) {
                response.value = value.trim();
            } else {
                response.params[key] = value.trim();
            }
        } else if (value.trim()) {
            response.params[value.trim().toLowerCase()] = '';
        }

        // handle parameter value continuations
        // https://tools.ietf.org/html/rfc2231#section-3

        // preprocess values
        Object.keys(response.params).forEach(function (key) {
            var actualKey, nr, match, value;
            if ((match = key.match(/(\*(\d+)|\*(\d+)\*|\*)$/))) {
                actualKey = key.substr(0, match.index);
                nr = Number(match[2] || match[3]) || 0;

                if (!response.params[actualKey] || typeof response.params[actualKey] !== 'object') {
                    response.params[actualKey] = {
                        charset: false,
                        values: []
                    };
                }

                value = response.params[key];

                if (nr === 0 && match[0].substr(-1) === '*' && (match = value.match(/^([^']*)'[^']*'(.*)$/))) {
                    response.params[actualKey].charset = match[1] || 'iso-8859-1';
                    value = match[2];
                }

                response.params[actualKey].values[nr] = value;

                // remove the old reference
                delete response.params[key];
            }
        });

        // concatenate split rfc2231 strings and convert encoded strings to mime encoded words
        Object.keys(response.params).forEach(function (key) {
            var value;
            if (response.params[key] && Array.isArray(response.params[key].values)) {
                value = response.params[key].values.map(function (val) {
                    return val || '';
                }).join('');

                if (response.params[key].charset) {
                    // convert "%AB" to "=?charset?Q?=AB?="
                    response.params[key] = '=?' +
                        response.params[key].charset +
                        '?Q?' +
                        value.
                        // fix invalidly encoded chars
                    replace(/[=\?_\s]/g,
                            function (s) {
                                var c = s.charCodeAt(0).toString(16);
                                if (s === ' ') {
                                    return '_';
                                } else {
                                    return '%' + (c.length < 2 ? '0' : '') + c;
                                }
                            }
                        ).
                        // change from urlencoding to percent encoding
                    replace(/%/g, '=') +
                        '?=';
                } else {
                    response.params[key] = value;
                }
            }
        }.bind(this));

        return response;
    },

    /**
     * Encodes a string or an Buffer to an UTF-8 Parameter Value Continuation encoding (rfc2231)
     * Useful for splitting long parameter values.
     *
     * For example
     *      title="unicode string"
     * becomes
     *     title*0*=utf-8''unicode
     *     title*1*=%20string
     *
     * @param {String|Buffer} data String to be encoded
     * @param {Number} [maxLength=50] Max length for generated chunks
     * @param {String} [fromCharset='UTF-8'] Source sharacter set
     * @return {Array} A list of encoded keys and headers
     */
    buildHeaderParam: function (key, data, maxLength, fromCharset) {
        var list = [];
        var encodedStr = typeof data === 'string' ? data : libmime.decode(data, fromCharset);
        var encodedStrArr;
        var chr, ord;
        var line;
        var startPos = 0;
        var isEncoded = false;
        var i, len;

        maxLength = maxLength || 50;

        // process ascii only text
        if (libmime.isPlainText(data)) {

            // check if conversion is even needed
            if (encodedStr.length <= maxLength) {
                return [{
                    key: key,
                    value: encodedStr
                }];
            }

            encodedStr = encodedStr.replace(new RegExp('.{' + maxLength + '}', 'g'), function (str) {
                list.push({
                    line: str
                });
                return '';
            });

            if (encodedStr) {
                list.push({
                    line: encodedStr
                });
            }

        } else {

            if (/[\uD800-\uDBFF]/.test(encodedStr)) {
                // string containts surrogate pairs, so normalize it to an array of bytes
                encodedStrArr = [];
                for (i = 0, len = encodedStr.length; i < len; i++) {
                    chr = encodedStr.charAt(i);
                    ord = chr.charCodeAt(0);
                    if (ord >= 0xD800 && ord <= 0xDBFF && i < len - 1) {
                        chr += encodedStr.charAt(i + 1);
                        encodedStrArr.push(chr);
                        i++;
                    } else {
                        encodedStrArr.push(chr);
                    }
                }
                encodedStr = encodedStrArr;
            }

            // first line includes the charset and language info and needs to be encoded
            // even if it does not contain any unicode characters
            line = 'utf-8\'\'';
            isEncoded = true;
            startPos = 0;

            // process text with unicode or special chars
            for (i = 0, len = encodedStr.length; i < len; i++) {

                chr = encodedStr[i];

                if (isEncoded) {
                    chr = safeEncodeURIComponent(chr);
                } else {
                    // try to urlencode current char
                    chr = chr === ' ' ? chr : safeEncodeURIComponent(chr);
                    // By default it is not required to encode a line, the need
                    // only appears when the string contains unicode or special chars
                    // in this case we start processing the line over and encode all chars
                    if (chr !== encodedStr[i]) {
                        // Check if it is even possible to add the encoded char to the line
                        // If not, there is no reason to use this line, just push it to the list
                        // and start a new line with the char that needs encoding
                        if ((safeEncodeURIComponent(line) + chr).length >= maxLength) {
                            list.push({
                                line: line,
                                encoded: isEncoded
                            });
                            line = '';
                            startPos = i - 1;
                        } else {
                            isEncoded = true;
                            i = startPos;
                            line = '';
                            continue;
                        }
                    }
                }

                // if the line is already too long, push it to the list and start a new one
                if ((line + chr).length >= maxLength) {
                    list.push({
                        line: line,
                        encoded: isEncoded
                    });
                    line = chr = encodedStr[i] === ' ' ? ' ' : safeEncodeURIComponent(encodedStr[i]);
                    if (chr === encodedStr[i]) {
                        isEncoded = false;
                        startPos = i - 1;
                    } else {
                        isEncoded = true;
                    }
                } else {
                    line += chr;
                }
            }

            if (line) {
                list.push({
                    line: line,
                    encoded: isEncoded
                });
            }
        }

        return list.map(function (item, i) {
            return {
                // encoded lines: {name}*{part}*
                // unencoded lines: {name}*{part}
                // if any line needs to be encoded then the first line (part==0) is always encoded
                key: key + '*' + i + (item.encoded ? '*' : ''),
                value: item.line
            };
        });
    },


    /**
     * Returns file extension for a content type string. If no suitable extensions
     * are found, 'bin' is used as the default extension
     *
     * @param {String} mimeType Content type to be checked for
     * @return {String} File extension
     */
    detectExtension: function (mimeType) {
        mimeType = (mimeType || '').toString().toLowerCase().replace(/\s/g, '');
        if (!(mimeType in mimetypes.list)) {
            return 'bin';
        }

        if (typeof mimetypes.list[mimeType] === 'string') {
            return mimetypes.list[mimeType];
        }

        var mimeParts = mimeType.split('/');

        // search for name match
        for (var i = 0, len = mimetypes.list[mimeType].length; i < len; i++) {
            if (mimeParts[1] === mimetypes.list[mimeType][i]) {
                return mimetypes.list[mimeType][i];
            }
        }

        // use the first one
        return mimetypes.list[mimeType][0] !== '*' ? mimetypes.list[mimeType][0] : 'bin';
    },

    /**
     * Returns content type for a file extension. If no suitable content types
     * are found, 'application/octet-stream' is used as the default content type
     *
     * @param {String} extension Extension to be checked for
     * @return {String} File extension
     */
    detectMimeType: function (extension) {
        extension = (extension || '').toString().toLowerCase().replace(/\s/g, '').replace(/^\./g, '').split('.').pop();

        if (!(extension in mimetypes.extensions)) {
            return 'application/octet-stream';
        }

        if (typeof mimetypes.extensions[extension] === 'string') {
            return mimetypes.extensions[extension];
        }

        var mimeParts;

        // search for name match
        for (var i = 0, len = mimetypes.extensions[extension].length; i < len; i++) {
            mimeParts = mimetypes.extensions[extension][i].split('/');
            if (mimeParts[1] === extension) {
                return mimetypes.extensions[extension][i];
            }
        }

        // use the first one
        return mimetypes.extensions[extension][0];
    },

    /**
     * Folds long lines, useful for folding header lines (afterSpace=false) and
     * flowed text (afterSpace=true)
     *
     * @param {String} str String to be folded
     * @param {Number} [lineLength=76] Maximum length of a line
     * @param {Boolean} afterSpace If true, leave a space in th end of a line
     * @return {String} String with folded lines
     */
    foldLines: function (str, lineLength, afterSpace) {
        str = (str || '').toString();
        lineLength = lineLength || 76;

        var pos = 0,
            len = str.length,
            result = '',
            line, match;

        while (pos < len) {
            line = str.substr(pos, lineLength);
            if (line.length < lineLength) {
                result += line;
                break;
            }
            if ((match = line.match(/^[^\n\r]*(\r?\n|\r)/))) {
                line = match[0];
                result += line;
                pos += line.length;
                continue;
            } else if ((match = line.match(/(\s+)[^\s]*$/)) && match[0].length - (afterSpace ? (match[1] || '').length : 0) < line.length) {
                line = line.substr(0, line.length - (match[0].length - (afterSpace ? (match[1] || '').length : 0)));
            } else if ((match = str.substr(pos + line.length).match(/^[^\s]+(\s*)/))) {
                line = line + match[0].substr(0, match[0].length - (!afterSpace ? (match[1] || '').length : 0));
            }

            result += line;
            pos += line.length;
            if (pos < len) {
                result += '\r\n';
            }
        }

        return result;
    }
};

/**
 * Splits a mime encoded string. Needed for dividing mime words into smaller chunks
 *
 * @param {String} str Mime encoded string to be split up
 * @param {Number} maxlen Maximum length of characters for one part (minimum 12)
 * @return {Array} Split string
 */
function splitMimeEncodedString(str, maxlen) {
    var curLine, match, chr, done,
        lines = [];

    // require at least 12 symbols to fit possible 4 octet UTF-8 sequences
    maxlen = Math.max(maxlen || 0, 12);

    while (str.length) {
        curLine = str.substr(0, maxlen);

        // move incomplete escaped char back to main
        if ((match = curLine.match(/\=[0-9A-F]?$/i))) {
            curLine = curLine.substr(0, match.index);
        }

        done = false;
        while (!done) {
            done = true;
            // check if not middle of a unicode char sequence
            if ((match = str.substr(curLine.length).match(/^\=([0-9A-F]{2})/i))) {
                chr = parseInt(match[1], 16);
                // invalid sequence, move one char back anc recheck
                if (chr < 0xC2 && chr > 0x7F) {
                    curLine = curLine.substr(0, curLine.length - 3);
                    done = false;
                }
            }
        }

        if (curLine.length) {
            lines.push(curLine);
        }
        str = str.substr(curLine.length);
    }

    return lines;
}

function encodeURICharComponent(chr) {
    var i, len, ord;
    var res = '';

    ord = chr.charCodeAt(0).toString(16).toUpperCase();
    if (ord.length % 2) {
        ord = '0' + ord;
    }
    if (ord.length > 2) {
        for (i = 0, len = ord.length / 2; i < len; i++) {
            res += '%' + ord.substr(i, 2);
        }
    } else {
        res += '%' + ord;
    }

    return res;
}

function safeEncodeURIComponent(str) {
    str = (str || '').toString();

    try {
        // might throw if we try to encode invalid sequences, eg. partial emoji
        str = encodeURIComponent(str);
    } catch (E) {
        // should never run
        return str.replace(/[^\x00-\x1F *'()<>@,;:\\"\[\]?=\u007F-\uFFFF]+/g, '');
    }

    // ensure chars that are not handled by encodeURICompent are converted as well
    return str.replace(/[\x00-\x1F *'()<>@,;:\\"\[\]?=\u007F-\uFFFF]/g, encodeURICharComponent);
}
