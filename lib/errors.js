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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoneError = exports.ParseError = void 0;
var l = __importStar(require("./lexer"));
function location(token) {
    if (token === l.Token.EOF) {
        return 'the last line';
    }
    else {
        return "\"" + token.getText() + "\" at line " + token.getLineNumber();
    }
}
var ParseError = /** @class */ (function (_super) {
    __extends(ParseError, _super);
    function ParseError(a, b) {
        var _this = this;
        var msg = '', token;
        if (typeof a === 'string') {
            msg = a;
        }
        else {
            token = b;
        }
        _this = _super.call(this, token ? "syntax error around " + location(token) + ". " + msg : msg) || this;
        Object.setPrototypeOf(_this, ParseError.prototype);
        return _this;
    }
    return ParseError;
}(Error));
exports.ParseError = ParseError;
var StoneError = /** @class */ (function (_super) {
    __extends(StoneError, _super);
    function StoneError(m, t) {
        var _this = _super.call(this, m) || this;
        Object.setPrototypeOf(_this, StoneError.prototype);
        return _this;
    }
    return StoneError;
}(Error));
exports.StoneError = StoneError;
