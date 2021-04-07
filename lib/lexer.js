"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Lexer = exports.StrToken = exports.IdToken = exports.NumToken = exports.Token = void 0;
var os_1 = __importDefault(require("os"));
var errors_1 = require("./errors");
var Token = /** @class */ (function () {
    function Token(lineNum) {
        this.lineNumber = lineNum;
    }
    Token.prototype.getLineNumber = function () {
        return this.lineNumber;
    };
    Token.prototype.isIdentifier = function () {
        return false;
    };
    Token.prototype.isNumber = function () {
        return false;
    };
    Token.prototype.isString = function () {
        return false;
    };
    Token.prototype.getNumber = function () {
        throw new errors_1.StoneError('not number token');
    };
    Token.prototype.getText = function () {
        return '';
    };
    Token.EOF = new /** @class */ (function (_super) {
        __extends(class_1, _super);
        function class_1() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return class_1;
    }(Token))(-1);
    Token.EOL = os_1.default.EOL;
    return Token;
}());
exports.Token = Token;
var NumToken = /** @class */ (function (_super) {
    __extends(NumToken, _super);
    function NumToken(lineNum, v) {
        var _this = _super.call(this, lineNum) || this;
        _this.value = v;
        return _this;
    }
    NumToken.prototype.isNumber = function () {
        return true;
    };
    NumToken.prototype.getText = function () {
        return this.value + '';
    };
    NumToken.prototype.getNumber = function () {
        return this.value;
    };
    return NumToken;
}(Token));
exports.NumToken = NumToken;
var IdToken = /** @class */ (function (_super) {
    __extends(IdToken, _super);
    function IdToken(lineNum, id) {
        var _this = _super.call(this, lineNum) || this;
        _this.text = id;
        return _this;
    }
    IdToken.prototype.isIdentifier = function () {
        return true;
    };
    IdToken.prototype.getText = function () {
        return this.text;
    };
    return IdToken;
}(Token));
exports.IdToken = IdToken;
var StrToken = /** @class */ (function (_super) {
    __extends(StrToken, _super);
    function StrToken(lineNum, str) {
        var _this = _super.call(this, lineNum) || this;
        _this.literal = str;
        return _this;
    }
    StrToken.prototype.isString = function () {
        return true;
    };
    StrToken.prototype.getText = function () {
        return this.literal;
    };
    return StrToken;
}(Token));
exports.StrToken = StrToken;
var Lexer = /** @class */ (function () {
    function Lexer(reader) {
        this.pattern = '\\s*(?:(//.*)|([0-9]*)|("(?:\\"|\\\\\\|\\n|[^"])*")|([A-Z_a-z][A-Z_a-z0-9]*|==|<=|>=|&&|\\|\\||\\(|\\)|\\*|\\+|-|/))?';
        this.queue = [];
        this.hasMore = true;
        this.reader = reader;
    }
    Lexer.prototype.read = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fillQueue(0)];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, this.queue.shift()];
                        }
                        return [2 /*return*/, Token.EOF];
                }
            });
        });
    };
    Lexer.prototype.peek = function (i) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.fillQueue(i)];
                    case 1:
                        if (_a.sent()) {
                            return [2 /*return*/, this.queue[i]];
                        }
                        return [2 /*return*/, Token.EOF];
                }
            });
        });
    };
    Lexer.prototype.fillQueue = function (i) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(i >= this.queue.length)) return [3 /*break*/, 4];
                        if (!this.hasMore) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.readLine()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2: return [2 /*return*/, false];
                    case 3: return [3 /*break*/, 0];
                    case 4: return [2 /*return*/, true];
                }
            });
        });
    };
    Lexer.prototype.readLine = function () {
        return __awaiter(this, void 0, void 0, function () {
            var line, error_1, lineNo, regExp, results;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.reader.nextLine()];
                    case 1:
                        line = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        throw new errors_1.ParseError(error_1.message);
                    case 3:
                        if (line == null) {
                            return [2 /*return*/];
                        }
                        lineNo = this.reader.getLineNumber();
                        regExp = new RegExp(this.pattern, 'g');
                        while (regExp.lastIndex < line.length) {
                            results = regExp.exec(line);
                            if (results[0]) {
                                this.addToken(lineNo, results);
                            }
                            else {
                                throw new errors_1.ParseError("bad token at line " + lineNo);
                            }
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Lexer.prototype.addToken = function (lineNo, results) {
        var token;
        if (results[2] != null) {
            token = new NumToken(lineNo, parseInt(results[2], 10));
        }
        else if (results[3] != null) {
            var raw = results[3];
            var str = raw.substring(1, raw.length - 1);
            token = new StrToken(lineNo, str);
        }
        else if (results[4] != null) {
            token = new IdToken(lineNo, results[4]);
        }
        this.queue.push(token);
    };
    return Lexer;
}());
exports.Lexer = Lexer;
