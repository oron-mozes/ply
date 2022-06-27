"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAction = void 0;
var os_1 = require("os");
var types_1 = require("../types");
exports.default = (function () {
    return {
        rootDirectory: "".concat((0, os_1.homedir)(), "/.ply/local-storage/"),
        userFileName: 'user.json',
        configFileName: 'config.json',
        serverUrl: 'http://localhost:3000/'
    };
});
function getAction(cmd) {
    if (cmd.length === 1) {
        return types_1.ACTION.INSTALL;
    }
    var actionsMap = new Map([]);
    actionsMap.set(types_1.ACTION.INSTALL, ['install', '-i', 'add', '-D']);
    actionsMap.set(types_1.ACTION.BUILD, ['build']);
    actionsMap.set(types_1.ACTION.TEST, ['test']);
    return Array.from(actionsMap.keys()).reduce(function (acc, nextVal) {
        var list = actionsMap.get(nextVal);
        if (list === null || list === void 0 ? void 0 : list.some(function (type) { return cmd.includes(type); })) {
            acc = nextVal;
        }
        return acc;
    }, types_1.ACTION.GENERIC);
}
exports.getAction = getAction;
