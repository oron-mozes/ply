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
exports.signupUser = void 0;
const shelljs_1 = require("shelljs");
const os_1 = require("os");
const consts_1 = require("./consts");
const utils_1 = require("./utils");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const inquirer_1 = __importDefault(require("inquirer"));
const axios_1 = __importDefault(require("axios"));
const user = (0, os_1.userInfo)();
(0, shelljs_1.exec)(`mkdir -p ${(0, utils_1.getLocalStorage)()}`);
const signupUser = () => __awaiter(void 0, void 0, void 0, function* () {
    if (fs_1.default.existsSync(`${(0, utils_1.getLocalStorage)()}/user.json`))
        return;
    console.clear();
    console.log(`Welcome To The ${chalk_1.default.redBright(chalk_1.default.bold("</Sideshow>"))}\n`);
    const { userType } = yield inquirer_1.default.prompt({
        name: "userType",
        message: "Are you signing up to a workspace or as a private user?",
        choices: ['Private', 'Workspace'],
        type: "list",
        prefix: '',
    });
    let userOrg = '';
    const isAnEmployee = userType === "Workspace";
    if (isAnEmployee) {
        const { organization } = yield inquirer_1.default.prompt({
            name: "organization",
            message: "Please select a workspace to join",
            choices: ['WIX', 'Microsoft', 'Floatplane'],
            type: "list",
            prefix: '',
        });
        userOrg = organization;
    }
    const { userEmail } = yield inquirer_1.default.prompt({
        name: "userEmail",
        message: `Please enter an email${isAnEmployee ? ` (Must be a valid ${userOrg} email)` : ''}:`,
        type: "input",
        prefix: '',
    });
    console.log(`\n${chalk_1.default.greenBright("Thank you for registering!")}`);
    if (isAnEmployee) {
        console.log(`Please note you will not be presented with ${userOrg} related content until you ${chalk_1.default.bold("verify your email.")}`);
    }
    const { data } = yield axios_1.default.put(`${consts_1.apiBaseUrl}/user`, {
        name: user.username,
        email: userEmail.trim(),
    });
    fs_1.default.writeFile(`${(0, utils_1.getLocalStorage)()}/user.json`, JSON.stringify(data), function (err) {
        if (err)
            throw err;
    });
    yield new Promise(resolve => setTimeout(resolve, 250));
});
exports.signupUser = signupUser;
const saveFiles = () => {
    const keys = ['music', 'feed', 'trivia', 'user'];
    keys.map(key => {
        fs_1.default.writeFile(`${(0, utils_1.getLocalStorage)()}/${key}.json`, JSON.stringify({}), (err) => {
            if (err)
                throw err;
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
// signupUser();
saveFiles();
saveData();
