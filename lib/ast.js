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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullStmnt = exports.WhileStmnt = exports.IfStmnt = exports.BinaryExpr = exports.Name = exports.StringLiteral = exports.NumberLiteral = exports.ASTList = exports.ASTLeaf = exports.ASTree = void 0;
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
    ASTList.prototype.child = function (i) {
        return this.children[i];
    };
    ASTList.prototype.numChildren = function () {
        return this.children.length;
    };
    ASTList.prototype[Symbol.iterator] = function () {
        var _i, _a, child;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = this.children;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    child = _a[_i];
                    return [4 /*yield*/, child];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    ASTList.prototype.location = function () {
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var s = child.location();
            if (s != null) {
                return s;
            }
        }
        return null;
    };
    ASTList.prototype.toString = function () {
        var ss = [];
        for (var _i = 0, _a = this.children; _i < _a.length; _i++) {
            var child = _a[_i];
            ss.push(child.toString());
        }
        return "(" + ss.join(' ') + ")";
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
    return WhileStmnt;
}(ASTList));
exports.WhileStmnt = WhileStmnt;
var NullStmnt = /** @class */ (function (_super) {
    __extends(NullStmnt, _super);
    function NullStmnt() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NullStmnt;
}(ASTList));
exports.NullStmnt = NullStmnt;
//# sourceMappingURL=ast.js.map