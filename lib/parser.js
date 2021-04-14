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
exports.rule = exports.Parser = exports.Factory = exports.StrToken = exports.NumToken = exports.IdToken = exports.Skip = exports.Expr = exports.Operators = exports.Precedence = void 0;
var ast_1 = require("./ast");
var errors_1 = require("./errors");
var Precedence = /** @class */ (function () {
    function Precedence(v, a) {
        this.value = v;
        this.leftAssoc = a;
    }
    return Precedence;
}());
exports.Precedence = Precedence;
var Operators = /** @class */ (function () {
    function Operators(entries) {
        this.map = new Map(entries);
    }
    Operators.prototype.add = function (name, prec, leftAssoc) {
        this.map.set(name, new Precedence(prec, leftAssoc));
    };
    Operators.prototype.get = function (name) {
        return this.map.get(name);
    };
    Operators.LEFT = true;
    Operators.RIGHT = false;
    return Operators;
}());
exports.Operators = Operators;
var Element = /** @class */ (function () {
    function Element() {
    }
    return Element;
}());
var Expr = /** @class */ (function (_super) {
    __extends(Expr, _super);
    function Expr(ctor, exp, map) {
        var _this = _super.call(this) || this;
        _this.factory = Factory.getForASTList(ctor);
        _this.factor = exp;
        _this.ops = map;
        return _this;
    }
    Expr.prototype.parse = function (lexer, res) {
        return __awaiter(this, void 0, void 0, function () {
            var right, prec;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.factor.parse(lexer)];
                    case 1:
                        right = _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, this.nextOperator(lexer)];
                    case 3:
                        if (!((prec = _a.sent()) != null)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.doShift(lexer, right, prec.value)];
                    case 4:
                        right = _a.sent();
                        return [3 /*break*/, 2];
                    case 5:
                        res.push(right);
                        return [2 /*return*/];
                }
            });
        });
    };
    Expr.prototype.nextOperator = function (lexer) {
        return __awaiter(this, void 0, void 0, function () {
            var t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, lexer.peek(0)];
                    case 1:
                        t = _a.sent();
                        if (t.isIdentifier()) {
                            return [2 /*return*/, this.ops.get(t.getText())];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    Expr.prototype.doShift = function (lexer, left, prec) {
        return __awaiter(this, void 0, void 0, function () {
            var list, _a, _b, _c, right, next;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        list = [];
                        list.push(left);
                        _b = (_a = list).push;
                        _c = ast_1.ASTLeaf.bind;
                        return [4 /*yield*/, lexer.read()];
                    case 1:
                        _b.apply(_a, [new (_c.apply(ast_1.ASTLeaf, [void 0, _d.sent()]))()]);
                        return [4 /*yield*/, this.factor.parse(lexer)];
                    case 2:
                        right = _d.sent();
                        _d.label = 3;
                    case 3: return [4 /*yield*/, this.nextOperator(lexer)];
                    case 4:
                        if (!((next = _d.sent()) != null && this.rightIsExpr(prec, next))) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.doShift(lexer, right, next.value)];
                    case 5:
                        right = _d.sent();
                        return [3 /*break*/, 3];
                    case 6:
                        list.push(right);
                        return [2 /*return*/, this.factory.make(list)];
                }
            });
        });
    };
    Expr.prototype.rightIsExpr = function (prec, nextPrec) {
        return nextPrec.leftAssoc ? prec < nextPrec.value : prec <= nextPrec.value;
    };
    Expr.prototype.match = function (lexer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.factor.match(lexer)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Expr;
}(Element));
exports.Expr = Expr;
var Tree = /** @class */ (function (_super) {
    __extends(Tree, _super);
    function Tree(p) {
        var _this = _super.call(this) || this;
        _this.parser = p;
        return _this;
    }
    Tree.prototype.parse = function (lexer, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = (_a = res).push;
                        return [4 /*yield*/, this.parser.parse(lexer)];
                    case 1:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    Tree.prototype.match = function (lexer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.parser.match(lexer)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Tree;
}(Element));
var OrTree = /** @class */ (function (_super) {
    __extends(OrTree, _super);
    function OrTree(parsers) {
        var _this = _super.call(this) || this;
        _this.parsers = parsers;
        return _this;
    }
    OrTree.prototype.parse = function (lexer, res) {
        return __awaiter(this, void 0, void 0, function () {
            var p, t, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.choose(lexer)];
                    case 1:
                        p = _c.sent();
                        if (!(p == null)) return [3 /*break*/, 3];
                        return [4 /*yield*/, lexer.peek(0)];
                    case 2:
                        t = _c.sent();
                        throw new errors_1.ParseError("unexpected " + t.getText() + ".");
                    case 3:
                        _b = (_a = res).push;
                        return [4 /*yield*/, p.parse(lexer)];
                    case 4:
                        _b.apply(_a, [_c.sent()]);
                        return [2 /*return*/];
                }
            });
        });
    };
    OrTree.prototype.match = function (lexer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.choose(lexer)];
                    case 1: return [2 /*return*/, (_a.sent()) != null];
                }
            });
        });
    };
    OrTree.prototype.choose = function (lexer) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, p, e_1_1;
            var e_1, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _d.trys.push([0, 5, 6, 7]);
                        _a = __values(this.parsers), _b = _a.next();
                        _d.label = 1;
                    case 1:
                        if (!!_b.done) return [3 /*break*/, 4];
                        p = _b.value;
                        return [4 /*yield*/, p.match(lexer)];
                    case 2:
                        if (_d.sent()) {
                            return [2 /*return*/, p];
                        }
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
                    case 7: return [2 /*return*/, null];
                }
            });
        });
    };
    OrTree.prototype.insert = function (p) {
        this.parsers.unshift(p);
    };
    return OrTree;
}(Element));
var Repeat = /** @class */ (function (_super) {
    __extends(Repeat, _super);
    function Repeat(parser, onlyOnce) {
        var _this = _super.call(this) || this;
        _this.parser = parser;
        _this.onlyOnce = onlyOnce;
        return _this;
    }
    Repeat.prototype.parse = function (lexer, res) {
        return __awaiter(this, void 0, void 0, function () {
            var t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.match(lexer)];
                    case 1:
                        if (!_a.sent()) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.parser.parse(lexer)];
                    case 2:
                        t = _a.sent();
                        if (Reflect.get(t, 'constructor') !== ast_1.ASTList || t.numChildren() > 0) {
                            res.push(t);
                        }
                        if (this.onlyOnce) {
                            return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Repeat.prototype.match = function (lexer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.parser.match(lexer)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Repeat;
}(Element));
var Leaf = /** @class */ (function (_super) {
    __extends(Leaf, _super);
    function Leaf(tokens) {
        var _this = _super.call(this) || this;
        _this.tokens = tokens;
        return _this;
    }
    Leaf.prototype.parse = function (lexer, res) {
        return __awaiter(this, void 0, void 0, function () {
            var t, _a, _b, token;
            var e_2, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, lexer.read()];
                    case 1:
                        t = _d.sent();
                        if (t.isIdentifier()) {
                            try {
                                for (_a = __values(this.tokens), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    token = _b.value;
                                    if (token === t.getText()) {
                                        this.find(res, t);
                                        return [2 /*return*/];
                                    }
                                }
                            }
                            catch (e_2_1) { e_2 = { error: e_2_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_2) throw e_2.error; }
                            }
                        }
                        if (this.tokens.length > 0) {
                            throw new errors_1.ParseError(this.tokens[0] + " expected.");
                        }
                        else {
                            throw new errors_1.ParseError(t.getText());
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    Leaf.prototype.find = function (res, t) {
        res.push(new ast_1.ASTLeaf(t));
    };
    Leaf.prototype.match = function (lexer) {
        return __awaiter(this, void 0, void 0, function () {
            var t, _a, _b, token;
            var e_3, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, lexer.peek(0)];
                    case 1:
                        t = _d.sent();
                        if (t.isIdentifier()) {
                            try {
                                for (_a = __values(this.tokens), _b = _a.next(); !_b.done; _b = _a.next()) {
                                    token = _b.value;
                                    if (token === t.getText()) {
                                        return [2 /*return*/, true];
                                    }
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                        }
                        return [2 /*return*/, false];
                }
            });
        });
    };
    return Leaf;
}(Element));
var Skip = /** @class */ (function (_super) {
    __extends(Skip, _super);
    function Skip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Skip.prototype.find = function (res, t) { };
    return Skip;
}(Leaf));
exports.Skip = Skip;
var AToken = /** @class */ (function (_super) {
    __extends(AToken, _super);
    function AToken(ctor) {
        var _this = _super.call(this) || this;
        if (ctor === null) {
            ctor = ast_1.ASTLeaf;
        }
        _this.factory = Factory.get(ctor);
        return _this;
    }
    AToken.prototype.parse = function (lexer, res) {
        return __awaiter(this, void 0, void 0, function () {
            var t, leaf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, lexer.read()];
                    case 1:
                        t = _a.sent();
                        if (this.test(t)) {
                            leaf = this.factory.make(t);
                            res.push(leaf);
                        }
                        else {
                            throw new errors_1.ParseError(t.getText());
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    AToken.prototype.match = function (lexer) {
        return __awaiter(this, void 0, void 0, function () {
            var t;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, lexer.peek(0)];
                    case 1:
                        t = _a.sent();
                        return [2 /*return*/, this.test(t)];
                }
            });
        });
    };
    return AToken;
}(Element));
var IdToken = /** @class */ (function (_super) {
    __extends(IdToken, _super);
    function IdToken(ctor, reserved) {
        var _this = _super.call(this, ctor) || this;
        _this.reserved = reserved !== null ? reserved : new Set();
        return _this;
    }
    IdToken.prototype.test = function (t) {
        return t.isIdentifier() && !this.reserved.has(t.getText());
    };
    return IdToken;
}(AToken));
exports.IdToken = IdToken;
var NumToken = /** @class */ (function (_super) {
    __extends(NumToken, _super);
    function NumToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumToken.prototype.test = function (t) {
        return t.isNumber();
    };
    return NumToken;
}(AToken));
exports.NumToken = NumToken;
var StrToken = /** @class */ (function (_super) {
    __extends(StrToken, _super);
    function StrToken() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StrToken.prototype.test = function (t) {
        return t.isString();
    };
    return StrToken;
}(AToken));
exports.StrToken = StrToken;
var Factory = /** @class */ (function () {
    function Factory() {
    }
    Factory.prototype.make = function (arg) {
        return this.make0(arg);
    };
    Factory.getForASTList = function (ctor) {
        var f = this.get(ctor);
        if (f == null) {
            f = new /** @class */ (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_1.prototype.make0 = function (arg) {
                    var results = arg;
                    if (results.length === 1) {
                        return results[0];
                    }
                    else {
                        return new ast_1.ASTList(results);
                    }
                };
                return class_1;
            }(Factory));
        }
        return f;
    };
    Factory.get = function (ctor) {
        if (ctor == null) {
            return null;
        }
        var make = Reflect.get(ctor, this.factoryName);
        if (typeof make === 'function') {
            return new /** @class */ (function (_super) {
                __extends(class_2, _super);
                function class_2() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                class_2.prototype.make0 = function (arg) {
                    return make(arg);
                };
                return class_2;
            }(Factory));
        }
        return new /** @class */ (function (_super) {
            __extends(class_3, _super);
            function class_3() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            class_3.prototype.make0 = function (arg) {
                return new ctor(arg);
            };
            return class_3;
        }(Factory));
    };
    Factory.factoryName = 'create';
    return Factory;
}());
exports.Factory = Factory;
var Parser = /** @class */ (function () {
    function Parser(pOrCtor) {
        this.elements = [];
        if (pOrCtor instanceof Parser) {
            this.elements = pOrCtor.elements;
            this.factory = pOrCtor.factory;
        }
        else {
            this.reset(pOrCtor);
        }
    }
    Parser.prototype.parse = function (l) {
        return __awaiter(this, void 0, void 0, function () {
            var results, _a, _b, e, e_4_1;
            var e_4, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        results = [];
                        _d.label = 1;
                    case 1:
                        _d.trys.push([1, 6, 7, 8]);
                        _a = __values(this.elements), _b = _a.next();
                        _d.label = 2;
                    case 2:
                        if (!!_b.done) return [3 /*break*/, 5];
                        e = _b.value;
                        return [4 /*yield*/, e.parse(l, results)];
                    case 3:
                        _d.sent();
                        _d.label = 4;
                    case 4:
                        _b = _a.next();
                        return [3 /*break*/, 2];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        e_4_1 = _d.sent();
                        e_4 = { error: e_4_1 };
                        return [3 /*break*/, 8];
                    case 7:
                        try {
                            if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                        }
                        finally { if (e_4) throw e_4.error; }
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/, this.factory.make(results)];
                }
            });
        });
    };
    Parser.prototype.number = function (ctor) {
        if (ctor === void 0) { ctor = null; }
        this.elements.push(new NumToken(ctor));
        return this;
    };
    Parser.prototype.identifier = function (ctorOrReserved, reserved) {
        if (ctorOrReserved instanceof Set) {
            this.identifier(null, ctorOrReserved);
        }
        else {
            this.elements.push(new IdToken(ctorOrReserved, reserved));
        }
        return this;
    };
    Parser.prototype.string = function (ctor) {
        if (ctor === void 0) { ctor = null; }
        this.elements.push(new StrToken(ctor));
        return this;
    };
    Parser.prototype.sep = function () {
        var pats = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            pats[_i] = arguments[_i];
        }
        this.elements.push(new Skip(pats));
        return this;
    };
    Parser.prototype.ast = function (p) {
        this.elements.push(new Tree(p));
        return this;
    };
    Parser.prototype.option = function (p) {
        this.elements.push(new Repeat(p, true));
        return this;
    };
    Parser.prototype.or = function () {
        var ps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ps[_i] = arguments[_i];
        }
        this.elements.push(new OrTree(ps));
        return this;
    };
    Parser.prototype.maybe = function (p) {
        var p2 = new Parser(p);
        p2.reset();
        this.elements.push(new OrTree([p, p2]));
        return this;
    };
    Parser.prototype.repeat = function (p) {
        this.elements.push(new Repeat(p, false));
        return this;
    };
    Parser.prototype.expression = function (ctorOrParser, parserOrOperators, ops) {
        if (ctorOrParser instanceof Parser && parserOrOperators instanceof Operators) {
            this.elements.push(new Expr(null, ctorOrParser, parserOrOperators));
        }
        else {
            this.elements.push(new Expr(ctorOrParser, parserOrOperators, ops));
        }
        return this;
    };
    Parser.prototype.insertChoice = function (p) {
        var e = this.elements[0];
        if (e instanceof OrTree) {
            e.insert(p);
        }
        else {
            var otherwise = new Parser(this);
            this.reset(null);
            this.or(p, otherwise);
        }
        return this;
    };
    Parser.prototype.reset = function (ctor) {
        this.elements = [];
        if (ctor !== undefined) {
            this.factory = Factory.getForASTList(ctor);
        }
        return this;
    };
    Parser.prototype.match = function (lexer) {
        return __awaiter(this, void 0, void 0, function () {
            var c, e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, lexer.peek(0)];
                    case 1:
                        c = _a.sent();
                        if (!(this.elements.length === 0)) return [3 /*break*/, 2];
                        return [2 /*return*/, true];
                    case 2:
                        e = this.elements[0];
                        return [4 /*yield*/, e.match(lexer)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return Parser;
}());
exports.Parser = Parser;
function rule(ctor) {
    if (ctor === void 0) { ctor = null; }
    return new Parser(ctor);
}
exports.rule = rule;
//# sourceMappingURL=parser.js.map