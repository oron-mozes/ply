#! /usr/bin/env node
"use strict";
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
exports.closeTerminalIfNeeded = void 0;
const shelljs_1 = require("shelljs");
const helpers_1 = require("yargs/helpers");
const build_1 = require("./bin/build");
const axios_1 = __importDefault(require("axios"));
const consts_1 = require("../consts");
const read_package_json_1 = require("./services/read-package-json");
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
const install_1 = require("./bin/install");
const types_1 = require("../types");
const test_1 = require("./bin/test");
const add_1 = require("./bin/add");
const YT_1 = __importDefault(require("./Features/YT"));
const generic_1 = require("./bin/generic");
const feed_1 = __importDefault(require("./Features/feed"));
const path_1 = __importDefault(require("path"));
const postinstall_1 = require("../postinstall");
let isTerminalActive = false;
(function () {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, postinstall_1.signupUser)();
        const argv = (0, helpers_1.hideBin)(process.argv);
        const getYarnAction = (cmd) => {
            if (cmd.length === 1) {
                return types_1.ACTION.INSTALL;
            }
            if (cmd.some(arg => arg.toLowerCase() === 'install')) {
                return types_1.ACTION.INSTALL;
            }
            if (cmd.some(arg => arg.toLowerCase() === 'add')) {
                return types_1.ACTION.ADD;
            }
            if (cmd.some(arg => arg.toLowerCase() === 'build')) {
                return types_1.ACTION.BUILD;
            }
            if (cmd.some(arg => arg.toLowerCase() === 'test')) {
                return types_1.ACTION.TEST;
            }
            return types_1.ACTION.GENERIC;
        };
        const getNpmAction = (cmd) => {
            if (cmd.some(arg => arg.toLowerCase() === 'install')) {
                if (cmd.some(arg => arg.toLowerCase().includes('@'))) {
                    return types_1.ACTION.ADD;
                }
                else {
                    return types_1.ACTION.INSTALL;
                }
            }
            if (cmd.some(arg => arg === 'i')) {
                return types_1.ACTION.ADD;
            }
            if (cmd.some(arg => arg === "build")) {
                return types_1.ACTION.BUILD;
            }
            if (cmd.some(arg => arg === 'test')) {
                return types_1.ACTION.TEST;
            }
            return types_1.ACTION.GENERIC;
        };
        const getPackageManager = (cmd) => {
            if (cmd.some(arg => arg.toLowerCase().includes('yarn')))
                return types_1.PACKAGE_MANAGER.YARN;
            if (cmd.some(arg => arg.toLowerCase().includes('npm')))
                return types_1.PACKAGE_MANAGER.NPM;
            return types_1.PACKAGE_MANAGER.NONE;
        };
        const interpretCommand = (cmd) => {
            const internalFlags = cmd.filter(arg => arg.startsWith('--p-'));
            const executionCommand = cmd.filter(arg => !arg.startsWith('--p-')).join(" ");
            const packageManager = getPackageManager(cmd);
            let action;
            switch (packageManager) {
                case types_1.PACKAGE_MANAGER.NONE: {
                    throw new Error('Package Manager Was Not Entered');
                }
                case types_1.PACKAGE_MANAGER.YARN: {
                    action = getYarnAction(cmd);
                    break;
                }
                case types_1.PACKAGE_MANAGER.NPM: {
                    action = getNpmAction(cmd);
                    break;
                }
            }
            return {
                internalFlags,
                executionCommand,
                packageManager,
                action,
            };
        };
        if (!argv.length) {
            // echo('Please enter a command')
        }
        else {
            const startTime = Date.now();
            const { internalFlags, executionCommand, packageManager, action } = interpretCommand(argv);
            const executionProcess = (0, shelljs_1.exec)(executionCommand, { async: true });
            const pkg = (0, read_package_json_1.getPackageJson)();
            const user = JSON.parse(fs_1.default.readFileSync(`${(0, utils_1.getLocalStorage)()}/user.json`, 'utf-8'));
            const { data: projectData } = yield axios_1.default.get(`${consts_1.apiBaseUrl}/project?name=${pkg.name}&userId=${user.id}&action=${action}`);
            (0, YT_1.default)((_a = projectData.personalDuration) !== null && _a !== void 0 ? _a : 3);
            (0, feed_1.default)();
            if (internalFlags.includes("--p-game")) {
                const pathToGame = path_1.default.resolve(__dirname, './Features/Game/index.js');
                (0, shelljs_1.exec)(`open -a Terminal ${pathToGame}`);
                isTerminalActive = true;
            }
            switch (action) {
                case types_1.ACTION.BUILD:
                    (0, build_1.buildFn)({ executionProcess, startTime });
                    break;
                case types_1.ACTION.INSTALL:
                    (0, install_1.installFn)({ executionProcess, startTime });
                    break;
                case types_1.ACTION.TEST:
                    (0, test_1.testFn)({ executionProcess, startTime });
                    break;
                case types_1.ACTION.ADD:
                    (0, add_1.addFn)({ executionProcess, startTime });
                    break;
                case types_1.ACTION.GENERIC:
                    (0, generic_1.genericFn)({ executionProcess, startTime, executionCommand });
                    break;
            }
        }
        ;
    });
})();
const closeTerminalIfNeeded = () => {
    if (isTerminalActive) {
        (0, shelljs_1.exec)('osascript -e \'tell application "Terminal" to close first window\'');
        isTerminalActive = false;
    }
};
exports.closeTerminalIfNeeded = closeTerminalIfNeeded;
