#! /usr/bin/env node
"use strict";
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = require("shelljs");
const utils_1 = require("./utils");
const fs_1 = __importDefault(require("fs"));
// exec("chmod a+x dist/src/**/*.js");
(0, shelljs_1.exec)(`mkdir -p ${(0, utils_1.getLocalStorage)()}`);
const saveUserFile = () => {
    fs_1.default.writeFileSync(`${(0, utils_1.getLocalStorage)()}/user.json`, JSON.stringify({ "id": '' }));
};
saveUserFile();
