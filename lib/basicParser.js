"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicParser = void 0;
var p = __importStar(require("./parser"));
var l = __importStar(require("./lexer"));
var ast_1 = require("./ast");
var BasicParser = /** @class */ (function () {
    function BasicParser() {
        this.reserved = new Set();
        this.operators = new p.Operators();
        this.reserved.add(',');
        this.reserved.add('}');
        this.reserved.add(l.Token.EOL);
        this.operators.add('=', 1, p.Operators.RIGHT);
        this.operators.add('==', 2, p.Operators.LEFT);
        this.operators.add('>', 2, p.Operators.LEFT);
        this.operators.add('<', 2, p.Operators.LEFT);
        this.operators.add('+', 3, p.Operators.LEFT);
        this.operators.add('-', 3, p.Operators.LEFT);
        this.operators.add('*', 4, p.Operators.LEFT);
        this.operators.add('/', 4, p.Operators.LEFT);
        this.operators.add('%', 4, p.Operators.LEFT);
        // primary   : "(" expr ")" | NUMBER | IDENTIFIER | STRING
        var expr = p.rule();
        var primary = p.rule().or(p.rule().sep('(').ast(expr).sep(')'), p.rule().number(ast_1.NumberLiteral), p.rule().identifier(ast_1.Name, this.reserved), p.rule().string(ast_1.StringLiteral));
        // factor    : "-" primary | primary
        var factor = p.rule().or(p.rule().sep('-').ast(primary), primary);
        // expr      : factor { OP factor }
        expr.expression(ast_1.BinaryExpr, factor, this.operators);
        // block     : "{" [ statement ] {(";" | EOL) [ statement ]} "}"
        var statement = p.rule();
        var block = p.rule().sep('{').option(statement).repeat(p.rule().sep(';', l.Token.EOL).option(statement)).sep('}');
        // simple    : expr
        var simple = p.rule().ast(expr);
        // statement : "if" expr block [ "else" block ]
        //   | "while" expr block
        //   | simple
        statement.or(p.rule(ast_1.IfStmnt).sep('if').ast(expr).ast(block).option(p.rule().sep('else').ast(block)), p.rule(ast_1.WhileStmnt).sep('while').ast(expr).ast(block), simple);
        // program   : [ statement ] (";" | EOL)
        this.program = p.rule().or(statement, p.rule(ast_1.NullStmnt)).sep(';', l.Token.EOL);
    }
    BasicParser.prototype.parse = function (l) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.program.parse(l)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return BasicParser;
}());
exports.BasicParser = BasicParser;
//# sourceMappingURL=basicParser.js.map