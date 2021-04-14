"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NestedEnv = exports.BasicEnv = void 0;
var errors_1 = require("./errors");
var BasicEnv = /** @class */ (function () {
    function BasicEnv() {
        this.values = new Map();
    }
    BasicEnv.prototype.put = function (name, value) {
        this.values.set(name, value);
    };
    BasicEnv.prototype.get = function (name) {
        if (this.values.has(name)) {
            return this.values.get(name);
        }
        throw new errors_1.StoneError("undefined name: " + name);
    };
    BasicEnv.prototype.putNew = function (name, value) {
        this.put(name, value);
    };
    BasicEnv.prototype.where = function (name) {
        return this;
    };
    BasicEnv.prototype.setOuter = function (e) { };
    return BasicEnv;
}());
exports.BasicEnv = BasicEnv;
var NestedEnv = /** @class */ (function () {
    function NestedEnv(outer) {
        if (outer === void 0) { outer = null; }
        this.values = new Map();
        this.outer = outer;
    }
    NestedEnv.prototype.setOuter = function (outer) {
        this.outer = outer;
    };
    NestedEnv.prototype.putNew = function (name, value) {
        this.values.set(name, value);
    };
    NestedEnv.prototype.where = function (name) {
        if (this.values.has(name)) {
            return this;
        }
        else if (this.outer == null) {
            return null;
        }
        else {
            return this.outer.where(name);
        }
    };
    NestedEnv.prototype.put = function (name, value) {
        var e = this.where(name);
        if (e == null) {
            e = this;
        }
        e.putNew(name, value);
    };
    NestedEnv.prototype.get = function (name) {
        var v = this.values.get(name);
        if (v == null && this.outer != null) {
            return this.outer.get(name);
        }
        else {
            return v;
        }
    };
    return NestedEnv;
}());
exports.NestedEnv = NestedEnv;
//# sourceMappingURL=env.js.map