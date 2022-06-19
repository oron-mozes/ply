"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PACKAGE_MANAGER = exports.ACTION = void 0;
var ACTION;
(function (ACTION) {
    ACTION["INSTALL"] = "INSTALL";
    ACTION["BUILD"] = "BUILD";
    ACTION["TEST"] = "TEST";
    ACTION["ADD"] = "ADD";
    ACTION["GENERIC"] = "GENERIC";
})(ACTION = exports.ACTION || (exports.ACTION = {}));
var PACKAGE_MANAGER;
(function (PACKAGE_MANAGER) {
    PACKAGE_MANAGER[PACKAGE_MANAGER["YARN"] = 0] = "YARN";
    PACKAGE_MANAGER[PACKAGE_MANAGER["NPM"] = 1] = "NPM";
    PACKAGE_MANAGER[PACKAGE_MANAGER["NONE"] = 2] = "NONE";
})(PACKAGE_MANAGER = exports.PACKAGE_MANAGER || (exports.PACKAGE_MANAGER = {}));
