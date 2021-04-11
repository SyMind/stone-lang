"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicEnv = void 0;
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
    return BasicEnv;
}());
exports.BasicEnv = BasicEnv;
//# sourceMappingURL=env.js.map