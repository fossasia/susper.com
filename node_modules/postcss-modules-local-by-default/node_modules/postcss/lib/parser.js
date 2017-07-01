'use strict';

exports.__esModule = true;

var _declaration = require('./declaration');

var _declaration2 = _interopRequireDefault(_declaration);

var _tokenize = require('./tokenize');

var _tokenize2 = _interopRequireDefault(_tokenize);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

var _atRule = require('./at-rule');

var _atRule2 = _interopRequireDefault(_atRule);

var _root = require('./root');

var _root2 = _interopRequireDefault(_root);

var _rule = require('./rule');

var _rule2 = _interopRequireDefault(_rule);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parser = function () {
    function Parser(input) {
        _classCallCheck(this, Parser);

        this.input = input;

        this.root = new _root2.default();
        this.current = this.root;
        this.spaces = '';
        this.semicolon = false;

        this.createTokenizer();
        this.root.source = { input: input, start: { line: 1, column: 1 } };
    }

    Parser.prototype.createTokenizer = function createTokenizer() {
        this.tokenizer = (0, _tokenize2.default)(this.input);
    };

    Parser.prototype.parse = function parse() {
        var token = void 0;
        while (!this.tokenizer.endOfFile()) {
            token = this.tokenizer.nextToken();

            switch (token[0]) {

                case 'space':
                    this.spaces += token[1];
                    break;

                case ';':
                    this.freeSemicolon(token);
                    break;

                case '}':
                    this.end(token);
                    break;

                case 'comment':
                    this.comment(token);
                    break;

                case 'at-word':
                    this.atrule(token);
                    break;

                case '{':
                    this.emptyRule(token);
                    break;

                default:
                    this.other(token);
                    break;
            }
        }
        this.endFile();
    };

    Parser.prototype.comment = function comment(token) {
        var node = new _comment2.default();
        this.init(node, token[2], token[3]);
        node.source.end = { line: token[4], column: token[5] };

        var text = token[1].slice(2, -2);
        if (/^\s*$/.test(text)) {
            node.text = '';
            node.raws.left = text;
            node.raws.right = '';
        } else {
            var match = text.match(/^(\s*)([^]*[^\s])(\s*)$/);
            node.text = match[2];
            node.raws.left = match[1];
            node.raws.right = match[3];
        }
    };

    Parser.prototype.emptyRule = function emptyRule(token) {
        var node = new _rule2.default();
        this.init(node, token[2], token[3]);
        node.selector = '';
        node.raws.between = '';
        this.current = node;
    };

    Parser.prototype.other = function other(start) {
        var end = false;
        var type = null;
        var colon = false;
        var bracket = null;
        var brackets = [];

        var tokens = [];
        var token = start;
        while (token) {
            type = token[0];
            tokens.push(token);

            if (type === '(' || type === '[') {
                if (!bracket) bracket = token;
                brackets.push(type === '(' ? ')' : ']');
            } else if (brackets.length === 0) {
                if (type === ';') {
                    if (colon) {
                        this.decl(tokens);
                        return;
                    } else {
                        break;
                    }
                } else if (type === '{') {
                    this.rule(tokens);
                    return;
                } else if (type === '}') {
                    this.tokenizer.back(tokens.pop());
                    end = true;
                    break;
                } else if (type === ':') {
                    colon = true;
                }
            } else if (type === brackets[brackets.length - 1]) {
                brackets.pop();
                if (brackets.length === 0) bracket = null;
            }

            token = this.tokenizer.nextToken();
        }

        if (this.tokenizer.endOfFile()) end = true;
        if (brackets.length > 0) this.unclosedBracket(bracket);

        if (end && colon) {
            while (tokens.length) {
                token = tokens[tokens.length - 1][0];
                if (token !== 'space' && token !== 'comment') break;
                this.tokenizer.back(tokens.pop());
            }
            this.decl(tokens);
            return;
        } else {
            this.unknownWord(tokens);
        }
    };

    Parser.prototype.rule = function rule(tokens) {
        tokens.pop();

        var node = new _rule2.default();
        this.init(node, tokens[0][2], tokens[0][3]);

        node.raws.between = this.spacesAndCommentsFromEnd(tokens);
        this.raw(node, 'selector', tokens);
        this.current = node;
    };

    Parser.prototype.decl = function decl(tokens) {
        var node = new _declaration2.default();
        this.init(node);

        var last = tokens[tokens.length - 1];
        if (last[0] === ';') {
            this.semicolon = true;
            tokens.pop();
        }
        if (last[4]) {
            node.source.end = { line: last[4], column: last[5] };
        } else {
            node.source.end = { line: last[2], column: last[3] };
        }

        while (tokens[0][0] !== 'word') {
            if (tokens.length === 1) this.unknownWord(tokens);
            node.raws.before += tokens.shift()[1];
        }
        node.source.start = { line: tokens[0][2], column: tokens[0][3] };

        node.prop = '';
        while (tokens.length) {
            var type = tokens[0][0];
            if (type === ':' || type === 'space' || type === 'comment') {
                break;
            }
            node.prop += tokens.shift()[1];
        }

        node.raws.between = '';

        var token = void 0;
        while (tokens.length) {
            token = tokens.shift();

            if (token[0] === ':') {
                node.raws.between += token[1];
                break;
            } else {
                node.raws.between += token[1];
            }
        }

        if (node.prop[0] === '_' || node.prop[0] === '*') {
            node.raws.before += node.prop[0];
            node.prop = node.prop.slice(1);
        }
        node.raws.between += this.spacesAndCommentsFromStart(tokens);
        this.precheckMissedSemicolon(tokens);

        for (var i = tokens.length - 1; i > 0; i--) {
            token = tokens[i];
            if (token[1] === '!important') {
                node.important = true;
                var string = this.stringFrom(tokens, i);
                string = this.spacesFromEnd(tokens) + string;
                if (string !== ' !important') node.raws.important = string;
                break;
            } else if (token[1] === 'important') {
                var cache = tokens.slice(0);
                var str = '';
                for (var j = i; j > 0; j--) {
                    var _type = cache[j][0];
                    if (str.trim().indexOf('!') === 0 && _type !== 'space') {
                        break;
                    }
                    str = cache.pop()[1] + str;
                }
                if (str.trim().indexOf('!') === 0) {
                    node.important = true;
                    node.raws.important = str;
                    tokens = cache;
                }
            }

            if (token[0] !== 'space' && token[0] !== 'comment') {
                break;
            }
        }

        this.raw(node, 'value', tokens);

        if (node.value.indexOf(':') !== -1) this.checkMissedSemicolon(tokens);
    };

    Parser.prototype.atrule = function atrule(token) {
        var node = new _atRule2.default();
        node.name = token[1].slice(1);
        if (node.name === '') {
            this.unnamedAtrule(node, token);
        }
        this.init(node, token[2], token[3]);

        var last = false;
        var open = false;
        var params = [];

        while (!this.tokenizer.endOfFile()) {
            token = this.tokenizer.nextToken();

            if (token[0] === ';') {
                node.source.end = { line: token[2], column: token[3] };
                this.semicolon = true;
                break;
            } else if (token[0] === '{') {
                open = true;
                break;
            } else if (token[0] === '}') {
                this.end(token);
                break;
            } else {
                params.push(token);
            }

            if (this.tokenizer.endOfFile()) {
                last = true;
                break;
            }
        }

        node.raws.between = this.spacesAndCommentsFromEnd(params);
        if (params.length) {
            node.raws.afterName = this.spacesAndCommentsFromStart(params);
            this.raw(node, 'params', params);
            if (last) {
                token = params[params.length - 1];
                node.source.end = { line: token[4], column: token[5] };
                this.spaces = node.raws.between;
                node.raws.between = '';
            }
        } else {
            node.raws.afterName = '';
            node.params = '';
        }

        if (open) {
            node.nodes = [];
            this.current = node;
        }
    };

    Parser.prototype.end = function end(token) {
        if (this.current.nodes && this.current.nodes.length) {
            this.current.raws.semicolon = this.semicolon;
        }
        this.semicolon = false;

        this.current.raws.after = (this.current.raws.after || '') + this.spaces;
        this.spaces = '';

        if (this.current.parent) {
            this.current.source.end = { line: token[2], column: token[3] };
            this.current = this.current.parent;
        } else {
            this.unexpectedClose(token);
        }
    };

    Parser.prototype.endFile = function endFile() {
        if (this.current.parent) this.unclosedBlock();
        if (this.current.nodes && this.current.nodes.length) {
            this.current.raws.semicolon = this.semicolon;
        }
        this.current.raws.after = (this.current.raws.after || '') + this.spaces;
    };

    Parser.prototype.freeSemicolon = function freeSemicolon(token) {
        this.spaces += token[1];
        if (this.current.nodes) {
            var prev = this.current.nodes[this.current.nodes.length - 1];
            if (prev && prev.type === 'rule' && !prev.raws.ownSemicolon) {
                prev.raws.ownSemicolon = this.spaces;
                this.spaces = '';
            }
        }
    };

    // Helpers

    Parser.prototype.init = function init(node, line, column) {
        this.current.push(node);

        node.source = { start: { line: line, column: column }, input: this.input };
        node.raws.before = this.spaces;
        this.spaces = '';
        if (node.type !== 'comment') this.semicolon = false;
    };

    Parser.prototype.raw = function raw(node, prop, tokens) {
        var token = void 0,
            type = void 0;
        var length = tokens.length;
        var value = '';
        var clean = true;
        for (var i = 0; i < length; i += 1) {
            token = tokens[i];
            type = token[0];
            if (type === 'comment' || type === 'space' && i === length - 1) {
                clean = false;
            } else {
                value += token[1];
            }
        }
        if (!clean) {
            var raw = tokens.reduce(function (all, i) {
                return all + i[1];
            }, '');
            node.raws[prop] = { value: value, raw: raw };
        }
        node[prop] = value;
    };

    Parser.prototype.spacesAndCommentsFromEnd = function spacesAndCommentsFromEnd(tokens) {
        var lastTokenType = void 0;
        var spaces = '';
        while (tokens.length) {
            lastTokenType = tokens[tokens.length - 1][0];
            if (lastTokenType !== 'space' && lastTokenType !== 'comment') break;
            spaces = tokens.pop()[1] + spaces;
        }
        return spaces;
    };

    Parser.prototype.spacesAndCommentsFromStart = function spacesAndCommentsFromStart(tokens) {
        var next = void 0;
        var spaces = '';
        while (tokens.length) {
            next = tokens[0][0];
            if (next !== 'space' && next !== 'comment') break;
            spaces += tokens.shift()[1];
        }
        return spaces;
    };

    Parser.prototype.spacesFromEnd = function spacesFromEnd(tokens) {
        var lastTokenType = void 0;
        var spaces = '';
        while (tokens.length) {
            lastTokenType = tokens[tokens.length - 1][0];
            if (lastTokenType !== 'space') break;
            spaces = tokens.pop()[1] + spaces;
        }
        return spaces;
    };

    Parser.prototype.stringFrom = function stringFrom(tokens, from) {
        var result = '';
        for (var i = from; i < tokens.length; i++) {
            result += tokens[i][1];
        }
        tokens.splice(from, tokens.length - from);
        return result;
    };

    Parser.prototype.colon = function colon(tokens) {
        var brackets = 0;
        var token = void 0,
            type = void 0,
            prev = void 0;
        for (var i = 0; i < tokens.length; i++) {
            token = tokens[i];
            type = token[0];

            if (type === '(') {
                brackets += 1;
            } else if (type === ')') {
                brackets -= 1;
            } else if (brackets === 0 && type === ':') {
                if (!prev) {
                    this.doubleColon(token);
                } else if (prev[0] === 'word' && prev[1] === 'progid') {
                    continue;
                } else {
                    return i;
                }
            }

            prev = token;
        }
        return false;
    };

    // Errors

    Parser.prototype.unclosedBracket = function unclosedBracket(bracket) {
        throw this.input.error('Unclosed bracket', bracket[2], bracket[3]);
    };

    Parser.prototype.unknownWord = function unknownWord(tokens) {
        throw this.input.error('Unknown word', tokens[0][2], tokens[0][3]);
    };

    Parser.prototype.unexpectedClose = function unexpectedClose(token) {
        throw this.input.error('Unexpected }', token[2], token[3]);
    };

    Parser.prototype.unclosedBlock = function unclosedBlock() {
        var pos = this.current.source.start;
        throw this.input.error('Unclosed block', pos.line, pos.column);
    };

    Parser.prototype.doubleColon = function doubleColon(token) {
        throw this.input.error('Double colon', token[2], token[3]);
    };

    Parser.prototype.unnamedAtrule = function unnamedAtrule(node, token) {
        throw this.input.error('At-rule without name', token[2], token[3]);
    };

    Parser.prototype.precheckMissedSemicolon = function precheckMissedSemicolon(tokens) {
        // Hook for Safe Parser
        tokens;
    };

    Parser.prototype.checkMissedSemicolon = function checkMissedSemicolon(tokens) {
        var colon = this.colon(tokens);
        if (colon === false) return;

        var founded = 0;
        var token = void 0;
        for (var j = colon - 1; j >= 0; j--) {
            token = tokens[j];
            if (token[0] !== 'space') {
                founded += 1;
                if (founded === 2) break;
            }
        }
        throw this.input.error('Missed semicolon', token[2], token[3]);
    };

    return Parser;
}();

exports.default = Parser;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhcnNlci5lczYiXSwibmFtZXMiOlsiUGFyc2VyIiwiaW5wdXQiLCJyb290IiwiY3VycmVudCIsInNwYWNlcyIsInNlbWljb2xvbiIsImNyZWF0ZVRva2VuaXplciIsInNvdXJjZSIsInN0YXJ0IiwibGluZSIsImNvbHVtbiIsInRva2VuaXplciIsInBhcnNlIiwidG9rZW4iLCJlbmRPZkZpbGUiLCJuZXh0VG9rZW4iLCJmcmVlU2VtaWNvbG9uIiwiZW5kIiwiY29tbWVudCIsImF0cnVsZSIsImVtcHR5UnVsZSIsIm90aGVyIiwiZW5kRmlsZSIsIm5vZGUiLCJpbml0IiwidGV4dCIsInNsaWNlIiwidGVzdCIsInJhd3MiLCJsZWZ0IiwicmlnaHQiLCJtYXRjaCIsInNlbGVjdG9yIiwiYmV0d2VlbiIsInR5cGUiLCJjb2xvbiIsImJyYWNrZXQiLCJicmFja2V0cyIsInRva2VucyIsInB1c2giLCJsZW5ndGgiLCJkZWNsIiwicnVsZSIsImJhY2siLCJwb3AiLCJ1bmNsb3NlZEJyYWNrZXQiLCJ1bmtub3duV29yZCIsInNwYWNlc0FuZENvbW1lbnRzRnJvbUVuZCIsInJhdyIsImxhc3QiLCJiZWZvcmUiLCJzaGlmdCIsInByb3AiLCJzcGFjZXNBbmRDb21tZW50c0Zyb21TdGFydCIsInByZWNoZWNrTWlzc2VkU2VtaWNvbG9uIiwiaSIsImltcG9ydGFudCIsInN0cmluZyIsInN0cmluZ0Zyb20iLCJzcGFjZXNGcm9tRW5kIiwiY2FjaGUiLCJzdHIiLCJqIiwidHJpbSIsImluZGV4T2YiLCJ2YWx1ZSIsImNoZWNrTWlzc2VkU2VtaWNvbG9uIiwibmFtZSIsInVubmFtZWRBdHJ1bGUiLCJvcGVuIiwicGFyYW1zIiwiYWZ0ZXJOYW1lIiwibm9kZXMiLCJhZnRlciIsInBhcmVudCIsInVuZXhwZWN0ZWRDbG9zZSIsInVuY2xvc2VkQmxvY2siLCJwcmV2Iiwib3duU2VtaWNvbG9uIiwiY2xlYW4iLCJyZWR1Y2UiLCJhbGwiLCJsYXN0VG9rZW5UeXBlIiwibmV4dCIs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LE0iLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERlY2xhcmF0aW9uIGZyb20gJy4vZGVjbGFyYXRpb24nO1xuaW1wb3J0IHRva2VuaXplciAgIGZyb20gJy4vdG9rZW5pemUnO1xuaW1wb3J0IENvbW1lbnQgICAgIGZyb20gJy4vY29tbWVudCc7XG5pbXBvcnQgQXRSdWxlICAgICAgZnJvbSAnLi9hdC1ydWxlJztcbmltcG9ydCBSb290ICAgICAgICBmcm9tICcuL3Jvb3QnO1xuaW1wb3J0IFJ1bGUgICAgICAgIGZyb20gJy4vcnVsZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhcnNlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihpbnB1dCkge1xuICAgICAgICB0aGlzLmlucHV0ID0gaW5wdXQ7XG5cbiAgICAgICAgdGhpcy5yb290ICAgICAgPSBuZXcgUm9vdCgpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgICA9IHRoaXMucm9vdDtcbiAgICAgICAgdGhpcy5zcGFjZXMgICAgPSAnJztcbiAgICAgICAgdGhpcy5zZW1pY29sb24gPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmNyZWF0ZVRva2VuaXplcigpO1xuICAgICAgICB0aGlzLnJvb3Quc291cmNlID0geyBpbnB1dCwgc3RhcnQ6IHsgbGluZTogMSwgY29sdW1uOiAxIH0gfTtcbiAgICB9XG5cbiAgICBjcmVhdGVUb2tlbml6ZXIoKSB7XG4gICAgICAgIHRoaXMudG9rZW5pemVyID0gdG9rZW5pemVyKHRoaXMuaW5wdXQpO1xuICAgIH1cblxuICAgIHBhcnNlKCkge1xuICAgICAgICBsZXQgdG9rZW47XG4gICAgICAgIHdoaWxlICggIXRoaXMudG9rZW5pemVyLmVuZE9mRmlsZSgpICkge1xuICAgICAgICAgICAgdG9rZW4gPSB0aGlzLnRva2VuaXplci5uZXh0VG9rZW4oKTtcblxuICAgICAgICAgICAgc3dpdGNoICggdG9rZW5bMF0gKSB7XG5cbiAgICAgICAgICAgIGNhc2UgJ3NwYWNlJzpcbiAgICAgICAgICAgICAgICB0aGlzLnNwYWNlcyArPSB0b2tlblsxXTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnOyc6XG4gICAgICAgICAgICAgICAgdGhpcy5mcmVlU2VtaWNvbG9uKHRva2VuKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAnfSc6XG4gICAgICAgICAgICAgICAgdGhpcy5lbmQodG9rZW4pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdjb21tZW50JzpcbiAgICAgICAgICAgICAgICB0aGlzLmNvbW1lbnQodG9rZW4pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICdhdC13b3JkJzpcbiAgICAgICAgICAgICAgICB0aGlzLmF0cnVsZSh0b2tlbik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3snOlxuICAgICAgICAgICAgICAgIHRoaXMuZW1wdHlSdWxlKHRva2VuKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aGlzLm90aGVyKHRva2VuKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmVuZEZpbGUoKTtcbiAgICB9XG5cbiAgICBjb21tZW50KHRva2VuKSB7XG4gICAgICAgIGxldCBub2RlID0gbmV3IENvbW1lbnQoKTtcbiAgICAgICAgdGhpcy5pbml0KG5vZGUsIHRva2VuWzJdLCB0b2tlblszXSk7XG4gICAgICAgIG5vZGUuc291cmNlLmVuZCA9IHsgbGluZTogdG9rZW5bNF0sIGNvbHVtbjogdG9rZW5bNV0gfTtcblxuICAgICAgICBsZXQgdGV4dCA9IHRva2VuWzFdLnNsaWNlKDIsIC0yKTtcbiAgICAgICAgaWYgKCAvXlxccyokLy50ZXN0KHRleHQpICkge1xuICAgICAgICAgICAgbm9kZS50ZXh0ICAgICAgID0gJyc7XG4gICAgICAgICAgICBub2RlLnJhd3MubGVmdCAgPSB0ZXh0O1xuICAgICAgICAgICAgbm9kZS5yYXdzLnJpZ2h0ID0gJyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgbWF0Y2ggPSB0ZXh0Lm1hdGNoKC9eKFxccyopKFteXSpbXlxcc10pKFxccyopJC8pO1xuICAgICAgICAgICAgbm9kZS50ZXh0ICAgICAgID0gbWF0Y2hbMl07XG4gICAgICAgICAgICBub2RlLnJhd3MubGVmdCAgPSBtYXRjaFsxXTtcbiAgICAgICAgICAgIG5vZGUucmF3cy5yaWdodCA9IG1hdGNoWzNdO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZW1wdHlSdWxlKHRva2VuKSB7XG4gICAgICAgIGxldCBub2RlID0gbmV3IFJ1bGUoKTtcbiAgICAgICAgdGhpcy5pbml0KG5vZGUsIHRva2VuWzJdLCB0b2tlblszXSk7XG4gICAgICAgIG5vZGUuc2VsZWN0b3IgPSAnJztcbiAgICAgICAgbm9kZS5yYXdzLmJldHdlZW4gPSAnJztcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gbm9kZTtcbiAgICB9XG5cbiAgICBvdGhlcihzdGFydCkge1xuICAgICAgICBsZXQgZW5kICAgICAgPSBmYWxzZTtcbiAgICAgICAgbGV0IHR5cGUgICAgID0gbnVsbDtcbiAgICAgICAgbGV0IGNvbG9uICAgID0gZmFsc2U7XG4gICAgICAgIGxldCBicmFja2V0ICA9IG51bGw7XG4gICAgICAgIGxldCBicmFja2V0cyA9IFtdO1xuXG4gICAgICAgIGxldCB0b2tlbnMgPSBbXTtcbiAgICAgICAgbGV0IHRva2VuID0gc3RhcnQ7XG4gICAgICAgIHdoaWxlICggdG9rZW4gKSB7XG4gICAgICAgICAgICB0eXBlID0gdG9rZW5bMF07XG4gICAgICAgICAgICB0b2tlbnMucHVzaCh0b2tlbik7XG5cbiAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJygnIHx8IHR5cGUgPT09ICdbJyApIHtcbiAgICAgICAgICAgICAgICBpZiAoICFicmFja2V0ICkgYnJhY2tldCA9IHRva2VuO1xuICAgICAgICAgICAgICAgIGJyYWNrZXRzLnB1c2godHlwZSA9PT0gJygnID8gJyknIDogJ10nKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmICggYnJhY2tldHMubGVuZ3RoID09PSAwICkge1xuICAgICAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJzsnICkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIGNvbG9uICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWNsKHRva2Vucyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ3snICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJ1bGUodG9rZW5zKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJ30nICkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRva2VuaXplci5iYWNrKHRva2Vucy5wb3AoKSk7XG4gICAgICAgICAgICAgICAgICAgIGVuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJzonICkge1xuICAgICAgICAgICAgICAgICAgICBjb2xvbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCB0eXBlID09PSBicmFja2V0c1ticmFja2V0cy5sZW5ndGggLSAxXSApIHtcbiAgICAgICAgICAgICAgICBicmFja2V0cy5wb3AoKTtcbiAgICAgICAgICAgICAgICBpZiAoIGJyYWNrZXRzLmxlbmd0aCA9PT0gMCApIGJyYWNrZXQgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0b2tlbiA9IHRoaXMudG9rZW5pemVyLm5leHRUb2tlbigpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCB0aGlzLnRva2VuaXplci5lbmRPZkZpbGUoKSApIGVuZCA9IHRydWU7XG4gICAgICAgIGlmICggYnJhY2tldHMubGVuZ3RoID4gMCApIHRoaXMudW5jbG9zZWRCcmFja2V0KGJyYWNrZXQpO1xuXG4gICAgICAgIGlmICggZW5kICYmIGNvbG9uICkge1xuICAgICAgICAgICAgd2hpbGUgKCB0b2tlbnMubGVuZ3RoICkge1xuICAgICAgICAgICAgICAgIHRva2VuID0gdG9rZW5zW3Rva2Vucy5sZW5ndGggLSAxXVswXTtcbiAgICAgICAgICAgICAgICBpZiAoIHRva2VuICE9PSAnc3BhY2UnICYmIHRva2VuICE9PSAnY29tbWVudCcgKSBicmVhaztcbiAgICAgICAgICAgICAgICB0aGlzLnRva2VuaXplci5iYWNrKHRva2Vucy5wb3AoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRlY2wodG9rZW5zKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudW5rbm93bldvcmQodG9rZW5zKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJ1bGUodG9rZW5zKSB7XG4gICAgICAgIHRva2Vucy5wb3AoKTtcblxuICAgICAgICBsZXQgbm9kZSA9IG5ldyBSdWxlKCk7XG4gICAgICAgIHRoaXMuaW5pdChub2RlLCB0b2tlbnNbMF1bMl0sIHRva2Vuc1swXVszXSk7XG5cbiAgICAgICAgbm9kZS5yYXdzLmJldHdlZW4gPSB0aGlzLnNwYWNlc0FuZENvbW1lbnRzRnJvbUVuZCh0b2tlbnMpO1xuICAgICAgICB0aGlzLnJhdyhub2RlLCAnc2VsZWN0b3InLCB0b2tlbnMpO1xuICAgICAgICB0aGlzLmN1cnJlbnQgPSBub2RlO1xuICAgIH1cblxuICAgIGRlY2wodG9rZW5zKSB7XG4gICAgICAgIGxldCBub2RlID0gbmV3IERlY2xhcmF0aW9uKCk7XG4gICAgICAgIHRoaXMuaW5pdChub2RlKTtcblxuICAgICAgICBsZXQgbGFzdCA9IHRva2Vuc1t0b2tlbnMubGVuZ3RoIC0gMV07XG4gICAgICAgIGlmICggbGFzdFswXSA9PT0gJzsnICkge1xuICAgICAgICAgICAgdGhpcy5zZW1pY29sb24gPSB0cnVlO1xuICAgICAgICAgICAgdG9rZW5zLnBvcCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmICggbGFzdFs0XSApIHtcbiAgICAgICAgICAgIG5vZGUuc291cmNlLmVuZCA9IHsgbGluZTogbGFzdFs0XSwgY29sdW1uOiBsYXN0WzVdIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnNvdXJjZS5lbmQgPSB7IGxpbmU6IGxhc3RbMl0sIGNvbHVtbjogbGFzdFszXSB9O1xuICAgICAgICB9XG5cbiAgICAgICAgd2hpbGUgKCB0b2tlbnNbMF1bMF0gIT09ICd3b3JkJyApIHtcbiAgICAgICAgICAgIGlmICggdG9rZW5zLmxlbmd0aCA9PT0gMSApIHRoaXMudW5rbm93bldvcmQodG9rZW5zKTtcbiAgICAgICAgICAgIG5vZGUucmF3cy5iZWZvcmUgKz0gdG9rZW5zLnNoaWZ0KClbMV07XG4gICAgICAgIH1cbiAgICAgICAgbm9kZS5zb3VyY2Uuc3RhcnQgPSB7IGxpbmU6IHRva2Vuc1swXVsyXSwgY29sdW1uOiB0b2tlbnNbMF1bM10gfTtcblxuICAgICAgICBub2RlLnByb3AgPSAnJztcbiAgICAgICAgd2hpbGUgKCB0b2tlbnMubGVuZ3RoICkge1xuICAgICAgICAgICAgbGV0IHR5cGUgPSB0b2tlbnNbMF1bMF07XG4gICAgICAgICAgICBpZiAoIHR5cGUgPT09ICc6JyB8fCB0eXBlID09PSAnc3BhY2UnIHx8IHR5cGUgPT09ICdjb21tZW50JyApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUucHJvcCArPSB0b2tlbnMuc2hpZnQoKVsxXTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUucmF3cy5iZXR3ZWVuID0gJyc7XG5cbiAgICAgICAgbGV0IHRva2VuO1xuICAgICAgICB3aGlsZSAoIHRva2Vucy5sZW5ndGggKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vucy5zaGlmdCgpO1xuXG4gICAgICAgICAgICBpZiAoIHRva2VuWzBdID09PSAnOicgKSB7XG4gICAgICAgICAgICAgICAgbm9kZS5yYXdzLmJldHdlZW4gKz0gdG9rZW5bMV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5vZGUucmF3cy5iZXR3ZWVuICs9IHRva2VuWzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCBub2RlLnByb3BbMF0gPT09ICdfJyB8fCBub2RlLnByb3BbMF0gPT09ICcqJyApIHtcbiAgICAgICAgICAgIG5vZGUucmF3cy5iZWZvcmUgKz0gbm9kZS5wcm9wWzBdO1xuICAgICAgICAgICAgbm9kZS5wcm9wID0gbm9kZS5wcm9wLnNsaWNlKDEpO1xuICAgICAgICB9XG4gICAgICAgIG5vZGUucmF3cy5iZXR3ZWVuICs9IHRoaXMuc3BhY2VzQW5kQ29tbWVudHNGcm9tU3RhcnQodG9rZW5zKTtcbiAgICAgICAgdGhpcy5wcmVjaGVja01pc3NlZFNlbWljb2xvbih0b2tlbnMpO1xuXG4gICAgICAgIGZvciAoIGxldCBpID0gdG9rZW5zLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0gKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgICAgIGlmICggdG9rZW5bMV0gPT09ICchaW1wb3J0YW50JyApIHtcbiAgICAgICAgICAgICAgICBub2RlLmltcG9ydGFudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgbGV0IHN0cmluZyA9IHRoaXMuc3RyaW5nRnJvbSh0b2tlbnMsIGkpO1xuICAgICAgICAgICAgICAgIHN0cmluZyA9IHRoaXMuc3BhY2VzRnJvbUVuZCh0b2tlbnMpICsgc3RyaW5nO1xuICAgICAgICAgICAgICAgIGlmICggc3RyaW5nICE9PSAnICFpbXBvcnRhbnQnICkgbm9kZS5yYXdzLmltcG9ydGFudCA9IHN0cmluZztcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgfSBlbHNlIGlmICh0b2tlblsxXSA9PT0gJ2ltcG9ydGFudCcpIHtcbiAgICAgICAgICAgICAgICBsZXQgY2FjaGUgPSB0b2tlbnMuc2xpY2UoMCk7XG4gICAgICAgICAgICAgICAgbGV0IHN0ciAgID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yICggbGV0IGogPSBpOyBqID4gMDsgai0tICkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgdHlwZSA9IGNhY2hlW2pdWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHN0ci50cmltKCkuaW5kZXhPZignIScpID09PSAwICYmIHR5cGUgIT09ICdzcGFjZScgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzdHIgPSBjYWNoZS5wb3AoKVsxXSArIHN0cjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCBzdHIudHJpbSgpLmluZGV4T2YoJyEnKSA9PT0gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgbm9kZS5pbXBvcnRhbnQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBub2RlLnJhd3MuaW1wb3J0YW50ID0gc3RyO1xuICAgICAgICAgICAgICAgICAgICB0b2tlbnMgPSBjYWNoZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggdG9rZW5bMF0gIT09ICdzcGFjZScgJiYgdG9rZW5bMF0gIT09ICdjb21tZW50JyApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMucmF3KG5vZGUsICd2YWx1ZScsIHRva2Vucyk7XG5cbiAgICAgICAgaWYgKCBub2RlLnZhbHVlLmluZGV4T2YoJzonKSAhPT0gLTEgKSB0aGlzLmNoZWNrTWlzc2VkU2VtaWNvbG9uKHRva2Vucyk7XG4gICAgfVxuXG4gICAgYXRydWxlKHRva2VuKSB7XG4gICAgICAgIGxldCBub2RlICA9IG5ldyBBdFJ1bGUoKTtcbiAgICAgICAgbm9kZS5uYW1lID0gdG9rZW5bMV0uc2xpY2UoMSk7XG4gICAgICAgIGlmICggbm9kZS5uYW1lID09PSAnJyApIHtcbiAgICAgICAgICAgIHRoaXMudW5uYW1lZEF0cnVsZShub2RlLCB0b2tlbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pbml0KG5vZGUsIHRva2VuWzJdLCB0b2tlblszXSk7XG5cbiAgICAgICAgbGV0IGxhc3QgICA9IGZhbHNlO1xuICAgICAgICBsZXQgb3BlbiAgID0gZmFsc2U7XG4gICAgICAgIGxldCBwYXJhbXMgPSBbXTtcblxuICAgICAgICB3aGlsZSAoICF0aGlzLnRva2VuaXplci5lbmRPZkZpbGUoKSApIHtcbiAgICAgICAgICAgIHRva2VuID0gdGhpcy50b2tlbml6ZXIubmV4dFRva2VuKCk7XG5cbiAgICAgICAgICAgIGlmICggdG9rZW5bMF0gPT09ICc7JyApIHtcbiAgICAgICAgICAgICAgICBub2RlLnNvdXJjZS5lbmQgPSB7IGxpbmU6IHRva2VuWzJdLCBjb2x1bW46IHRva2VuWzNdIH07XG4gICAgICAgICAgICAgICAgdGhpcy5zZW1pY29sb24gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggdG9rZW5bMF0gPT09ICd7JyApIHtcbiAgICAgICAgICAgICAgICBvcGVuID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHRva2VuWzBdID09PSAnfScpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZCh0b2tlbik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmFtcy5wdXNoKHRva2VuKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCB0aGlzLnRva2VuaXplci5lbmRPZkZpbGUoKSApIHtcbiAgICAgICAgICAgICAgICBsYXN0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUucmF3cy5iZXR3ZWVuID0gdGhpcy5zcGFjZXNBbmRDb21tZW50c0Zyb21FbmQocGFyYW1zKTtcbiAgICAgICAgaWYgKCBwYXJhbXMubGVuZ3RoICkge1xuICAgICAgICAgICAgbm9kZS5yYXdzLmFmdGVyTmFtZSA9IHRoaXMuc3BhY2VzQW5kQ29tbWVudHNGcm9tU3RhcnQocGFyYW1zKTtcbiAgICAgICAgICAgIHRoaXMucmF3KG5vZGUsICdwYXJhbXMnLCBwYXJhbXMpO1xuICAgICAgICAgICAgaWYgKCBsYXN0ICkge1xuICAgICAgICAgICAgICAgIHRva2VuID0gcGFyYW1zW3BhcmFtcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgICAgICBub2RlLnNvdXJjZS5lbmQgICA9IHsgbGluZTogdG9rZW5bNF0sIGNvbHVtbjogdG9rZW5bNV0gfTtcbiAgICAgICAgICAgICAgICB0aGlzLnNwYWNlcyAgICAgICA9IG5vZGUucmF3cy5iZXR3ZWVuO1xuICAgICAgICAgICAgICAgIG5vZGUucmF3cy5iZXR3ZWVuID0gJyc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBub2RlLnJhd3MuYWZ0ZXJOYW1lID0gJyc7XG4gICAgICAgICAgICBub2RlLnBhcmFtcyAgICAgICAgID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIG9wZW4gKSB7XG4gICAgICAgICAgICBub2RlLm5vZGVzICAgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudCA9IG5vZGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBlbmQodG9rZW4pIHtcbiAgICAgICAgaWYgKCB0aGlzLmN1cnJlbnQubm9kZXMgJiYgdGhpcy5jdXJyZW50Lm5vZGVzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudC5yYXdzLnNlbWljb2xvbiA9IHRoaXMuc2VtaWNvbG9uO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2VtaWNvbG9uID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5jdXJyZW50LnJhd3MuYWZ0ZXIgPSAodGhpcy5jdXJyZW50LnJhd3MuYWZ0ZXIgfHwgJycpICsgdGhpcy5zcGFjZXM7XG4gICAgICAgIHRoaXMuc3BhY2VzID0gJyc7XG5cbiAgICAgICAgaWYgKCB0aGlzLmN1cnJlbnQucGFyZW50ICkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50LnNvdXJjZS5lbmQgPSB7IGxpbmU6IHRva2VuWzJdLCBjb2x1bW46IHRva2VuWzNdIH07XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQgPSB0aGlzLmN1cnJlbnQucGFyZW50O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51bmV4cGVjdGVkQ2xvc2UodG9rZW4pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZW5kRmlsZSgpIHtcbiAgICAgICAgaWYgKCB0aGlzLmN1cnJlbnQucGFyZW50ICkgdGhpcy51bmNsb3NlZEJsb2NrKCk7XG4gICAgICAgIGlmICggdGhpcy5jdXJyZW50Lm5vZGVzICYmIHRoaXMuY3VycmVudC5ub2Rlcy5sZW5ndGggKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnQucmF3cy5zZW1pY29sb24gPSB0aGlzLnNlbWljb2xvbjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnQucmF3cy5hZnRlciA9ICh0aGlzLmN1cnJlbnQucmF3cy5hZnRlciB8fCAnJykgKyB0aGlzLnNwYWNlcztcbiAgICB9XG5cbiAgICBmcmVlU2VtaWNvbG9uKHRva2VuKSB7XG4gICAgICAgIHRoaXMuc3BhY2VzICs9IHRva2VuWzFdO1xuICAgICAgICBpZiAoIHRoaXMuY3VycmVudC5ub2RlcyApIHtcbiAgICAgICAgICAgIGxldCBwcmV2ID0gdGhpcy5jdXJyZW50Lm5vZGVzW3RoaXMuY3VycmVudC5ub2Rlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIGlmICggcHJldiAmJiBwcmV2LnR5cGUgPT09ICdydWxlJyAmJiAhcHJldi5yYXdzLm93blNlbWljb2xvbiApIHtcbiAgICAgICAgICAgICAgICBwcmV2LnJhd3Mub3duU2VtaWNvbG9uID0gdGhpcy5zcGFjZXM7XG4gICAgICAgICAgICAgICAgdGhpcy5zcGFjZXMgPSAnJztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhlbHBlcnNcblxuICAgIGluaXQobm9kZSwgbGluZSwgY29sdW1uKSB7XG4gICAgICAgIHRoaXMuY3VycmVudC5wdXNoKG5vZGUpO1xuXG4gICAgICAgIG5vZGUuc291cmNlID0geyBzdGFydDogeyBsaW5lLCBjb2x1bW4gfSwgaW5wdXQ6IHRoaXMuaW5wdXQgfTtcbiAgICAgICAgbm9kZS5yYXdzLmJlZm9yZSA9IHRoaXMuc3BhY2VzO1xuICAgICAgICB0aGlzLnNwYWNlcyA9ICcnO1xuICAgICAgICBpZiAoIG5vZGUudHlwZSAhPT0gJ2NvbW1lbnQnICkgdGhpcy5zZW1pY29sb24gPSBmYWxzZTtcbiAgICB9XG5cbiAgICByYXcobm9kZSwgcHJvcCwgdG9rZW5zKSB7XG4gICAgICAgIGxldCB0b2tlbiwgdHlwZTtcbiAgICAgICAgbGV0IGxlbmd0aCA9IHRva2Vucy5sZW5ndGg7XG4gICAgICAgIGxldCB2YWx1ZSAgPSAnJztcbiAgICAgICAgbGV0IGNsZWFuICA9IHRydWU7XG4gICAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxICkge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICB0eXBlICA9IHRva2VuWzBdO1xuICAgICAgICAgICAgaWYgKCB0eXBlID09PSAnY29tbWVudCcgfHwgdHlwZSA9PT0gJ3NwYWNlJyAmJiBpID09PSBsZW5ndGggLSAxICkge1xuICAgICAgICAgICAgICAgIGNsZWFuID0gZmFsc2U7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhbHVlICs9IHRva2VuWzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICggIWNsZWFuICkge1xuICAgICAgICAgICAgbGV0IHJhdyA9IHRva2Vucy5yZWR1Y2UoIChhbGwsIGkpID0+IGFsbCArIGlbMV0sICcnKTtcbiAgICAgICAgICAgIG5vZGUucmF3c1twcm9wXSA9IHsgdmFsdWUsIHJhdyB9O1xuICAgICAgICB9XG4gICAgICAgIG5vZGVbcHJvcF0gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBzcGFjZXNBbmRDb21tZW50c0Zyb21FbmQodG9rZW5zKSB7XG4gICAgICAgIGxldCBsYXN0VG9rZW5UeXBlO1xuICAgICAgICBsZXQgc3BhY2VzID0gJyc7XG4gICAgICAgIHdoaWxlICggdG9rZW5zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIGxhc3RUb2tlblR5cGUgPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdWzBdO1xuICAgICAgICAgICAgaWYgKCBsYXN0VG9rZW5UeXBlICE9PSAnc3BhY2UnICYmXG4gICAgICAgICAgICAgICAgbGFzdFRva2VuVHlwZSAhPT0gJ2NvbW1lbnQnICkgYnJlYWs7XG4gICAgICAgICAgICBzcGFjZXMgPSB0b2tlbnMucG9wKClbMV0gKyBzcGFjZXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwYWNlcztcbiAgICB9XG5cbiAgICBzcGFjZXNBbmRDb21tZW50c0Zyb21TdGFydCh0b2tlbnMpIHtcbiAgICAgICAgbGV0IG5leHQ7XG4gICAgICAgIGxldCBzcGFjZXMgPSAnJztcbiAgICAgICAgd2hpbGUgKCB0b2tlbnMubGVuZ3RoICkge1xuICAgICAgICAgICAgbmV4dCA9IHRva2Vuc1swXVswXTtcbiAgICAgICAgICAgIGlmICggbmV4dCAhPT0gJ3NwYWNlJyAmJiBuZXh0ICE9PSAnY29tbWVudCcgKSBicmVhaztcbiAgICAgICAgICAgIHNwYWNlcyArPSB0b2tlbnMuc2hpZnQoKVsxXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3BhY2VzO1xuICAgIH1cblxuICAgIHNwYWNlc0Zyb21FbmQodG9rZW5zKSB7XG4gICAgICAgIGxldCBsYXN0VG9rZW5UeXBlO1xuICAgICAgICBsZXQgc3BhY2VzID0gJyc7XG4gICAgICAgIHdoaWxlICggdG9rZW5zLmxlbmd0aCApIHtcbiAgICAgICAgICAgIGxhc3RUb2tlblR5cGUgPSB0b2tlbnNbdG9rZW5zLmxlbmd0aCAtIDFdWzBdO1xuICAgICAgICAgICAgaWYgKCBsYXN0VG9rZW5UeXBlICE9PSAnc3BhY2UnICkgYnJlYWs7XG4gICAgICAgICAgICBzcGFjZXMgPSB0b2tlbnMucG9wKClbMV0gKyBzcGFjZXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHNwYWNlcztcbiAgICB9XG5cbiAgICBzdHJpbmdGcm9tKHRva2VucywgZnJvbSkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgIGZvciAoIGxldCBpID0gZnJvbTsgaSA8IHRva2Vucy5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgIHJlc3VsdCArPSB0b2tlbnNbaV1bMV07XG4gICAgICAgIH1cbiAgICAgICAgdG9rZW5zLnNwbGljZShmcm9tLCB0b2tlbnMubGVuZ3RoIC0gZnJvbSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgY29sb24odG9rZW5zKSB7XG4gICAgICAgIGxldCBicmFja2V0cyA9IDA7XG4gICAgICAgIGxldCB0b2tlbiwgdHlwZSwgcHJldjtcbiAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgdG9rZW4gPSB0b2tlbnNbaV07XG4gICAgICAgICAgICB0eXBlICA9IHRva2VuWzBdO1xuXG4gICAgICAgICAgICBpZiAoIHR5cGUgPT09ICcoJyApIHtcbiAgICAgICAgICAgICAgICBicmFja2V0cyArPSAxO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggdHlwZSA9PT0gJyknICkge1xuICAgICAgICAgICAgICAgIGJyYWNrZXRzIC09IDE7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBicmFja2V0cyA9PT0gMCAmJiB0eXBlID09PSAnOicgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCAhcHJldiApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kb3VibGVDb2xvbih0b2tlbik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggcHJldlswXSA9PT0gJ3dvcmQnICYmIHByZXZbMV0gPT09ICdwcm9naWQnICkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHByZXYgPSB0b2tlbjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gRXJyb3JzXG5cbiAgICB1bmNsb3NlZEJyYWNrZXQoYnJhY2tldCkge1xuICAgICAgICB0aHJvdyB0aGlzLmlucHV0LmVycm9yKCdVbmNsb3NlZCBicmFja2V0JywgYnJhY2tldFsyXSwgYnJhY2tldFszXSk7XG4gICAgfVxuXG4gICAgdW5rbm93bldvcmQodG9rZW5zKSB7XG4gICAgICAgIHRocm93IHRoaXMuaW5wdXQuZXJyb3IoJ1Vua25vd24gd29yZCcsIHRva2Vuc1swXVsyXSwgdG9rZW5zWzBdWzNdKTtcbiAgICB9XG5cbiAgICB1bmV4cGVjdGVkQ2xvc2UodG9rZW4pIHtcbiAgICAgICAgdGhyb3cgdGhpcy5pbnB1dC5lcnJvcignVW5leHBlY3RlZCB9JywgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICB9XG5cbiAgICB1bmNsb3NlZEJsb2NrKCkge1xuICAgICAgICBsZXQgcG9zID0gdGhpcy5jdXJyZW50LnNvdXJjZS5zdGFydDtcbiAgICAgICAgdGhyb3cgdGhpcy5pbnB1dC5lcnJvcignVW5jbG9zZWQgYmxvY2snLCBwb3MubGluZSwgcG9zLmNvbHVtbik7XG4gICAgfVxuXG4gICAgZG91YmxlQ29sb24odG9rZW4pIHtcbiAgICAgICAgdGhyb3cgdGhpcy5pbnB1dC5lcnJvcignRG91YmxlIGNvbG9uJywgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICB9XG5cbiAgICB1bm5hbWVkQXRydWxlKG5vZGUsIHRva2VuKSB7XG4gICAgICAgIHRocm93IHRoaXMuaW5wdXQuZXJyb3IoJ0F0LXJ1bGUgd2l0aG91dCBuYW1lJywgdG9rZW5bMl0sIHRva2VuWzNdKTtcbiAgICB9XG5cbiAgICBwcmVjaGVja01pc3NlZFNlbWljb2xvbih0b2tlbnMpIHtcbiAgICAgICAgLy8gSG9vayBmb3IgU2FmZSBQYXJzZXJcbiAgICAgICAgdG9rZW5zO1xuICAgIH1cblxuICAgIGNoZWNrTWlzc2VkU2VtaWNvbG9uKHRva2Vucykge1xuICAgICAgICBsZXQgY29sb24gPSB0aGlzLmNvbG9uKHRva2Vucyk7XG4gICAgICAgIGlmICggY29sb24gPT09IGZhbHNlICkgcmV0dXJuO1xuXG4gICAgICAgIGxldCBmb3VuZGVkID0gMDtcbiAgICAgICAgbGV0IHRva2VuO1xuICAgICAgICBmb3IgKCBsZXQgaiA9IGNvbG9uIC0gMTsgaiA+PSAwOyBqLS0gKSB7XG4gICAgICAgICAgICB0b2tlbiA9IHRva2Vuc1tqXTtcbiAgICAgICAgICAgIGlmICggdG9rZW5bMF0gIT09ICdzcGFjZScgKSB7XG4gICAgICAgICAgICAgICAgZm91bmRlZCArPSAxO1xuICAgICAgICAgICAgICAgIGlmICggZm91bmRlZCA9PT0gMiApIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRocm93IHRoaXMuaW5wdXQuZXJyb3IoJ01pc3NlZCBzZW1pY29sb24nLCB0b2tlblsyXSwgdG9rZW5bM10pO1xuICAgIH1cblxufVxuIl19
