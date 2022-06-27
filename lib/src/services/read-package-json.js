"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageJson = void 0;
var shelljs_1 = require("shelljs");
var getPackageJson = function () {
    var givenShell = new shelljs_1.ShellString('givenShell');
    return JSON.parse(givenShell.cat('package.json').replace('givenShell', ''));
};
exports.getPackageJson = getPackageJson;
