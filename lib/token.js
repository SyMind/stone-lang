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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrToken = exports.IdToken = exports.NumToken = exports.Token = void 0;
var os_1 = __importDefault(require("os"));
var stoneError_1 = require("./stoneError");
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
        throw new stoneError_1.StoneError('not number token');
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
