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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Func = exports.PrimaryExpr = exports.Arguments = exports.Postfix = exports.DefStmnt = exports.Function = exports.ParameterList = exports.NullStmnt = exports.BlockStmnt = exports.WhileStmnt = exports.IfStmnt = exports.BinaryExpr = exports.Name = exports.StringLiteral = exports.NumberLiteral = exports.ASTList = exports.ASTLeaf = exports.ASTree = void 0;
var env_1 = require("./env");
var errors_1 = require("./errors");
var TRUE = 1;
var FALSE = 0;
var ASTree = /** @class */ (function () {
    function ASTree() {
    }
    return ASTree;
}());
exports.ASTree = ASTree;
var ASTLeaf = /** @class */ (function (_super) {
    __extends(ASTLeaf, _super);
    function ASTLeaf(t) {
        var _this = _super.call(this) || this;
        _this.token = t;
        return _this;
    }
    ASTLeaf.prototype.child = function (i) {
        throw new Error('index out of bounds');
    };
    ASTLeaf.prototype.numChildren = function () {
        return 0;
    };
    ASTLeaf.prototype[Symbol.iterator] = function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); };
    ASTLeaf.prototype.location = function () {
        return 'at line ' + this.token.getLineNumber();
    };
    ASTLeaf.prototype.toString = function () {
        return this.token.getText();
    };
    ASTLeaf.prototype.getToken = function () {
        return this.token;
    };
    ASTLeaf.prototype.eval = function (env) {
        throw new errors_1.StoneError('cannot eval: ' + this.toString());
    };
    ASTLeaf.empty = [];
    return ASTLeaf;
}(ASTree));
exports.ASTLeaf = ASTLeaf;
var ASTList = /** @class */ (function (_super) {
    __extends(ASTList, _super);
    function ASTList(list) {
        var _this = _super.call(this) || this;
        _this.children = list;
        return _this;
    }
    ASTList.prototype.size = function () {
        return this.children.length;
    };
    ASTList.prototype.child = function (i) {
        return this.children[i];
    };
    ASTList.prototype.numChildren = function () {
        return this.children.length;
    };
    ASTList.prototype[Symbol.iterator] = function () {
        var _a, _b, child, e_1_1;
        var e_1, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _d.trys.push([0, 5, 6, 7]);
                    _a = __values(this.children), _b = _a.next();
                    _d.label = 1;
                case 1:
                    if (!!_b.done) return [3 /*break*/, 4];
                    child = _b.value;
                    return [4 /*yield*/, child];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    _b = _a.next();
                    return [3 /*break*/, 1];
                case 4: return [3 /*break*/, 7];
                case 5:
                    e_1_1 = _d.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 7];
                case 6:
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    };
    ASTList.prototype.location = function () {
        var e_2, _a;
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                var s = child.location();
                if (s != null) {
                    return s;
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return null;
    };
    ASTList.prototype.toString = function () {
        var e_3, _a;
        var ss = [];
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                ss.push(child.toString());
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_3) throw e_3.error; }
        }
        return "(" + ss.join(' ') + ")";
    };
    ASTList.prototype.eval = function (env) {
        throw new errors_1.StoneError('cannot eval: ' + this.toString());
    };
    return ASTList;
}(ASTree));
exports.ASTList = ASTList;
var NumberLiteral = /** @class */ (function (_super) {
    __extends(NumberLiteral, _super);
    function NumberLiteral() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberLiteral.prototype.value = function () {
        return this.token.getNumber();
    };
    NumberLiteral.prototype.eval = function (env) {
        return this.value();
    };
    return NumberLiteral;
}(ASTLeaf));
exports.NumberLiteral = NumberLiteral;
var StringLiteral = /** @class */ (function (_super) {
    __extends(StringLiteral, _super);
    function StringLiteral() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StringLiteral.prototype.value = function () {
        return this.token.getText();
    };
    StringLiteral.prototype.eval = function (env) {
        return this.value();
    };
    return StringLiteral;
}(ASTLeaf));
exports.StringLiteral = StringLiteral;
var Name = /** @class */ (function (_super) {
    __extends(Name, _super);
    function Name() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Name.prototype.name = function () {
        return this.token.getText();
    };
    Name.prototype.eval = function (env) {
        return env.get(this.name());
    };
    return Name;
}(ASTLeaf));
exports.Name = Name;
var BinaryExpr = /** @class */ (function (_super) {
    __extends(BinaryExpr, _super);
    function BinaryExpr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BinaryExpr.prototype.left = function () {
        return this.children[0];
    };
    BinaryExpr.prototype.operator = function () {
        return this.children[1].getToken().getText();
    };
    BinaryExpr.prototype.right = function () {
        return this.children[2];
    };
    BinaryExpr.prototype.eval = function (env) {
        var op = this.operator();
        if (op === '=') {
            var right = this.right().eval(env);
            return this.computeAssign(env, right);
        }
        else {
            var left = this.left().eval(env);
            var right = this.right().eval(env);
            return this.computeOp(left, op, right);
        }
    };
    BinaryExpr.prototype.computeAssign = function (env, rValue) {
        var left = this.left();
        if (left instanceof Name) {
            env.put(left.name(), rValue);
            return rValue;
        }
        throw new errors_1.StoneError('bad assignment');
    };
    BinaryExpr.prototype.computeOp = function (lValue, op, rValue) {
        if (typeof lValue === 'number' && typeof rValue === 'number') {
            return this.computeNumber(lValue, op, rValue);
        }
        else {
            if (op === '+') {
                return String(lValue) + String(rValue);
            }
            else if (op === '==') {
                if (lValue === null) {
                    return rValue === null ? TRUE : FALSE;
                }
                else {
                    return lValue === rValue ? TRUE : FALSE;
                }
            }
            else {
                throw new errors_1.StoneError('bad type');
            }
        }
    };
    BinaryExpr.prototype.computeNumber = function (a, op, b) {
        switch (op) {
            case '+':
                return a + b;
            case '-':
                return a - b;
            case '*':
                return a * b;
            case '/':
                return a / b;
            case '%':
                return a % b;
            case '==':
                return a === b ? TRUE : FALSE;
            case '<':
                return a < b ? TRUE : FALSE;
            case '>':
                return a > b ? TRUE : FALSE;
            default:
                throw new errors_1.StoneError('bad operator');
        }
    };
    return BinaryExpr;
}(ASTList));
exports.BinaryExpr = BinaryExpr;
var IfStmnt = /** @class */ (function (_super) {
    __extends(IfStmnt, _super);
    function IfStmnt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IfStmnt.prototype.condition = function () {
        return this.child(0);
    };
    IfStmnt.prototype.thenBlock = function () {
        return this.child(1);
    };
    IfStmnt.prototype.elseBlock = function () {
        return this.numChildren() > 2 ? this.child(2) : null;
    };
    IfStmnt.prototype.toString = function () {
        return "(if " + this.condition() + " " + this.thenBlock() + " else " + this.elseBlock() + ")";
    };
    IfStmnt.prototype.eval = function (env) {
        var c = this.condition().eval(env);
        if (c !== FALSE) {
            return this.thenBlock().eval(env);
        }
        else {
            var e = this.elseBlock();
            if (e == null) {
                return 0;
            }
            return this.elseBlock().eval(env);
        }
    };
    return IfStmnt;
}(ASTList));
exports.IfStmnt = IfStmnt;
var WhileStmnt = /** @class */ (function (_super) {
    __extends(WhileStmnt, _super);
    function WhileStmnt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WhileStmnt.prototype.condition = function () {
        return this.child(0);
    };
    WhileStmnt.prototype.body = function () {
        return this.child(1);
    };
    WhileStmnt.prototype.toString = function () {
        return "(while " + this.condition() + " " + this.body() + ")";
    };
    WhileStmnt.prototype.eval = function (env) {
        var result = 0;
        for (;;) {
            var c = this.condition().eval(env);
            if (c === FALSE) {
                return result;
            }
            else {
                result = this.body().eval(env);
            }
        }
    };
    return WhileStmnt;
}(ASTList));
exports.WhileStmnt = WhileStmnt;
var BlockStmnt = /** @class */ (function (_super) {
    __extends(BlockStmnt, _super);
    function BlockStmnt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BlockStmnt.prototype.eval = function (env) {
        var e_4, _a;
        var result = 0;
        try {
            for (var _b = __values(this.children), _c = _b.next(); !_c.done; _c = _b.next()) {
                var child = _c.value;
                result = child.eval(env);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_4) throw e_4.error; }
        }
        return result;
    };
    return BlockStmnt;
}(ASTList));
exports.BlockStmnt = BlockStmnt;
var NullStmnt = /** @class */ (function (_super) {
    __extends(NullStmnt, _super);
    function NullStmnt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NullStmnt.prototype.eval = function (env) {
        return 0;
    };
    return NullStmnt;
}(ASTList));
exports.NullStmnt = NullStmnt;
var ParameterList = /** @class */ (function (_super) {
    __extends(ParameterList, _super);
    function ParameterList() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ParameterList.prototype.name = function (i) {
        return this.child(i).getToken().getText();
    };
    ParameterList.prototype.size = function () {
        return this.numChildren();
    };
    ParameterList.prototype.eval = function (env, index, value) {
        env.putNew(this.name(index), value);
        return value;
    };
    return ParameterList;
}(ASTList));
exports.ParameterList = ParameterList;
var Function = /** @class */ (function () {
    function Function(parameters, body, env) {
        this.parameters = parameters;
        this.body = body;
        this.env = env;
    }
    Function.prototype.makeEnv = function () {
        return new env_1.NestedEnv(this.env);
    };
    Function.prototype.toString = function () {
        return "<func>";
    };
    return Function;
}());
exports.Function = Function;
var DefStmnt = /** @class */ (function (_super) {
    __extends(DefStmnt, _super);
    function DefStmnt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DefStmnt.prototype.name = function () {
        return this.child(0).getToken().getText();
    };
    DefStmnt.prototype.parameters = function () {
        return this.child(1);
    };
    DefStmnt.prototype.body = function () {
        return this.child(2);
    };
    DefStmnt.prototype.toString = function () {
        return "(def " + this.name() + " " + this.parameters() + " " + this.body() + ")";
    };
    DefStmnt.prototype.eval = function (env) {
        env.putNew(this.name(), new Function(this.parameters(), this.body(), env));
        return this.name();
    };
    return DefStmnt;
}(ASTList));
exports.DefStmnt = DefStmnt;
var Postfix = /** @class */ (function (_super) {
    __extends(Postfix, _super);
    function Postfix() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Postfix;
}(ASTList));
exports.Postfix = Postfix;
var Arguments = /** @class */ (function (_super) {
    __extends(Arguments, _super);
    function Arguments() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Arguments.prototype.size = function () {
        return this.numChildren();
    };
    Arguments.prototype.eval = function (callerEnv, value) {
        var e_5, _a;
        if (!(value instanceof Function)) {
            throw new errors_1.StoneError('bad function');
        }
        var func = value;
        var params = func.parameters;
        if (this.children.length !== params.size()) {
            throw new errors_1.StoneError('bad number of arguments');
        }
        var newEnv = func.makeEnv();
        var index = 0;
        try {
            for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                var a = _c.value;
                params.eval(newEnv, index++, a.eval(callerEnv));
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_5) throw e_5.error; }
        }
        return func.body.eval(newEnv);
    };
    return Arguments;
}(Postfix));
exports.Arguments = Arguments;
var PrimaryExpr = /** @class */ (function (_super) {
    __extends(PrimaryExpr, _super);
    function PrimaryExpr() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PrimaryExpr.create = function (c) {
        return c.length === 1 ? c[0] : new PrimaryExpr(c);
    };
    PrimaryExpr.prototype.operand = function () {
        return this.child(0);
    };
    PrimaryExpr.prototype.postfix = function (nest) {
        return this.child(this.numChildren() - nest - 1);
    };
    PrimaryExpr.prototype.hasPostfix = function (nest) {
        return this.numChildren() - nest > 1;
    };
    PrimaryExpr.prototype.eval = function (env) {
        return this.evalSubExpr(env, 0);
    };
    PrimaryExpr.prototype.evalSubExpr = function (env, nest) {
        if (this.hasPostfix(nest)) {
            var target = this.evalSubExpr(env, nest + 1);
            return this.postfix(nest).eval(env, target);
        }
        else {
            return this.operand().eval(env);
        }
    };
    return PrimaryExpr;
}(ASTList));
exports.PrimaryExpr = PrimaryExpr;
var Func = /** @class */ (function (_super) {
    __extends(Func, _super);
    function Func() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Func.prototype.parameters = function () {
        return this.child(0);
    };
    Func.prototype.body = function () {
        return this.child(1);
    };
    Func.prototype.toString = function () {
        return "(func " + this.parameters() + " " + this.body() + ")";
    };
    Func.prototype.eval = function (env) {
        return new Function(this.parameters(), this.body(), env);
    };
    return Func;
}(ASTList));
exports.Func = Func;
//# sourceMappingURL=ast.js.map