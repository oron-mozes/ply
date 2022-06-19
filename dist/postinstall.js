#! /usr/bin/env node
"use strict";
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shelljs_1 = require("shelljs");
const os_1 = require("os");
const consts_1 = require("./consts");
const utils_1 = require("./utils");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const readline_1 = __importDefault(require("readline"));
const user = (0, os_1.userInfo)();
(0, shelljs_1.exec)(`mkdir -p ${(0, utils_1.getLocalStorage)()}`);
const signupUser = () => {
    var rl = readline_1.default.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('What is your email? ', function (answer) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Thank you for registering for our ply cli:', answer);
            const { data } = yield axios_1.default.put(`${consts_1.apiBaseUrl}/user`, {
                name: user.username,
                email: answer.trim(),
            });
            fs_1.default.writeFile(`${(0, utils_1.getLocalStorage)()}/user.json`, JSON.stringify(data), function (err) {
                if (err)
                    throw err;
            });
            rl.close();
        });
    });
};
const saveData = () => __awaiter(void 0, void 0, void 0, function* () {
    const keys = ['music', 'feed', 'trivia'];
    const timestamp = Date.now();
    const { id: userId } = (0, utils_1.getUserData)();
    yield Promise.all(keys.map((key) => __awaiter(void 0, void 0, void 0, function* () {
        const { data } = yield axios_1.default.get(`${consts_1.apiBaseUrl}/${key}?userId=${userId}`);
        data.timestamp = timestamp;
        fs_1.default.writeFile(`${(0, utils_1.getLocalStorage)()}/${key}.json`, JSON.stringify(data), (err) => {
            if (err)
                throw err;
        });
    })));
});
signupUser();
saveData();
