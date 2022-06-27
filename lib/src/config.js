"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
exports.default = (function () {
    return {
        rootDirectory: "".concat((0, os_1.homedir)(), "/.ply/local-storage/"),
        userFileName: 'user.json',
        configFileName: 'config.json',
        serverUrl: 'http://localhost:3000/'
    };
});
