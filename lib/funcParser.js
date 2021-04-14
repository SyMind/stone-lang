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
exports.FuncParser = void 0;
var a = __importStar(require("./ast"));
var p = __importStar(require("./parser"));
var basicParser_1 = require("./basicParser");
var FuncParser = /** @class */ (function (_super) {
    __extends(FuncParser, _super);
    function FuncParser() {
        var _this = _super.call(this) || this;
        // param       : IDENTIFIER
        _this.param = p.rule().identifier(_this.reserved);
        // params      : param { "," param }
        _this.params = p.rule(a.ParameterList).ast(_this.param).repeat(p.rule().sep(',').ast(_this.param));
        // param_list  : "(" [ params ] ")"
        _this.paramList = p.rule().sep('(').maybe(_this.params).sep(')');
        // def         : "def" IDENTIFIER param_list block
        _this.def = p.rule(a.DefStmnt).sep('def').identifier(_this.reserved).ast(_this.paramList).ast(_this.block);
        // args        : expr { "," expr }
        _this.args = p.rule(a.Arguments).ast(_this.expr).repeat(p.rule().sep(',').ast(_this.expr));
        // postfix     : "(" [ args ] ")"
        _this.postfix = p.rule().sep('(').maybe(_this.args).sep(')');
        _this.reserved.add(')');
        // primary     : ( "(" expr ")" | NUMBER | IDENTIFIER | STRING ) { postfix }
        _this.primary.repeat(_this.postfix);
        // simple      : expr [ args ]
        _this.simple.option(_this.args);
        // porgram     : [ def | statement ] (";" | EOL)
        _this.program.insertChoice(_this.def);
        return _this;
    }
    return FuncParser;
}(basicParser_1.BasicParser));
exports.FuncParser = FuncParser;
//# sourceMappingURL=funcParser.js.map