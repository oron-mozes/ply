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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeTerminalIfNeeded = void 0;
var shelljs_1 = require("shelljs");
var helpers_1 = require("yargs/helpers");
var build_1 = require("./bin/build");
var axios_1 = __importDefault(require("axios"));
var consts_1 = require("./consts");
var read_package_json_1 = require("./services/read-package-json");
var services_1 = require("./services");
var install_1 = require("./bin/install");
var types_1 = require("../types");
var test_1 = require("./bin/test");
var add_1 = require("./bin/add");
var YT_1 = __importDefault(require("./Features/YT"));
var generic_1 = require("./bin/generic");
var feed_1 = __importDefault(require("./Features/feed"));
var path_1 = __importDefault(require("path"));
var postinstall_1 = require("./postinstall");
var config_1 = __importDefault(require("./config"));
var isTerminalActive = false;
var promises_1 = require("node:fs/promises");
function init() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var _b, rootDirectory, userFileName, files, argv, getYarnAction, getNpmAction, getPackageManager, interpretCommand, startTime, _c, internalFlags, executionCommand, packageManager, action, executionProcess, pkg, user, projectData, pathToGame;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _b = (0, config_1.default)(), rootDirectory = _b.rootDirectory, userFileName = _b.userFileName;
                    return [4 /*yield*/, (0, promises_1.readdir)(rootDirectory)];
                case 1:
                    files = _d.sent();
                    if (!!files.includes(userFileName)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, postinstall_1.saveUserFile)()];
                case 2:
                    _d.sent();
                    _d.label = 3;
                case 3:
                    argv = (0, helpers_1.hideBin)(process.argv);
                    getYarnAction = function (cmd) {
                        if (cmd.length === 1) {
                            return types_1.ACTION.INSTALL;
                        }
                        if (cmd.some(function (arg) { return arg.toLowerCase() === 'install'; })) {
                            return types_1.ACTION.INSTALL;
                        }
                        if (cmd.some(function (arg) { return arg.toLowerCase() === 'add'; })) {
                            return types_1.ACTION.ADD;
                        }
                        if (cmd.some(function (arg) { return arg.toLowerCase() === 'build'; })) {
                            return types_1.ACTION.BUILD;
                        }
                        if (cmd.some(function (arg) { return arg.toLowerCase() === 'test'; })) {
                            return types_1.ACTION.TEST;
                        }
                        return types_1.ACTION.GENERIC;
                    };
                    getNpmAction = function (cmd) {
                        if (cmd.some(function (arg) { return arg.toLowerCase() === 'install'; })) {
                            if (cmd.some(function (arg) { return arg.toLowerCase().includes('@'); })) {
                                return types_1.ACTION.ADD;
                            }
                            else {
                                return types_1.ACTION.INSTALL;
                            }
                        }
                        if (cmd.some(function (arg) { return arg === 'i'; })) {
                            return types_1.ACTION.ADD;
                        }
                        if (cmd.some(function (arg) { return arg === "build"; })) {
                            return types_1.ACTION.BUILD;
                        }
                        if (cmd.some(function (arg) { return arg === 'test'; })) {
                            return types_1.ACTION.TEST;
                        }
                        return types_1.ACTION.GENERIC;
                    };
                    getPackageManager = function (cmd) {
                        if (cmd.some(function (arg) { return arg.toLowerCase().includes('yarn'); }))
                            return types_1.PACKAGE_MANAGER.YARN;
                        if (cmd.some(function (arg) { return arg.toLowerCase().includes('npm'); }))
                            return types_1.PACKAGE_MANAGER.NPM;
                        return types_1.PACKAGE_MANAGER.NONE;
                    };
                    interpretCommand = function (cmd) {
                        var internalFlags = cmd.filter(function (arg) { return arg.startsWith('--p-'); });
                        var executionCommand = cmd.filter(function (arg) { return !arg.startsWith('--p-'); }).join(" ");
                        var packageManager = getPackageManager(cmd);
                        var action;
                        switch (packageManager) {
                            case types_1.PACKAGE_MANAGER.NONE: {
                                action = types_1.ACTION.GENERIC;
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
                            internalFlags: internalFlags,
                            executionCommand: executionCommand,
                            packageManager: packageManager,
                            action: action,
                        };
                    };
                    if (!!argv.length) return [3 /*break*/, 4];
                    return [3 /*break*/, 6];
                case 4:
                    startTime = Date.now();
                    _c = interpretCommand(argv), internalFlags = _c.internalFlags, executionCommand = _c.executionCommand, packageManager = _c.packageManager, action = _c.action;
                    executionProcess = (0, shelljs_1.exec)(executionCommand, { async: true });
                    pkg = (0, read_package_json_1.getPackageJson)();
                    user = (0, services_1.getUserData)();
                    return [4 /*yield*/, axios_1.default.get("".concat(consts_1.apiBaseUrl, "/project?name=").concat(pkg.name, "&userId=").concat(user.id, "&action=").concat(action))];
                case 5:
                    projectData = (_d.sent()).data;
                    (0, YT_1.default)((_a = projectData.personalDuration) !== null && _a !== void 0 ? _a : 3);
                    (0, feed_1.default)();
                    if (internalFlags.includes("--p-game")) {
                        // echo(`path  is: ${__dirname}/Features/Game/**/*.js`);
                        (0, shelljs_1.exec)("chmod a+x ".concat(__dirname, "/Features/Game/*.js"));
                        pathToGame = path_1.default.resolve(__dirname, './Features/Game/index.js');
                        (0, shelljs_1.echo)("path  for game: ".concat(__dirname, "/Features/Game/*.js"));
                        (0, shelljs_1.exec)("open -a iTerm ".concat(pathToGame));
                        isTerminalActive = true;
                    }
                    switch (action) {
                        case types_1.ACTION.BUILD:
                            (0, build_1.buildFn)({ executionProcess: executionProcess, startTime: startTime });
                            break;
                        case types_1.ACTION.INSTALL:
                            (0, install_1.installFn)({ executionProcess: executionProcess, startTime: startTime });
                            break;
                        case types_1.ACTION.TEST:
                            (0, test_1.testFn)({ executionProcess: executionProcess, startTime: startTime });
                            break;
                        case types_1.ACTION.ADD:
                            (0, add_1.addFn)({ executionProcess: executionProcess, startTime: startTime });
                            break;
                        case types_1.ACTION.GENERIC:
                            (0, generic_1.genericFn)({ executionProcess: executionProcess, startTime: startTime, executionCommand: executionCommand });
                            break;
                    }
                    _d.label = 6;
                case 6:
                    ;
                    return [2 /*return*/];
            }
        });
    });
}
;
init();
var closeTerminalIfNeeded = function () {
    if (isTerminalActive) {
        (0, shelljs_1.exec)('osascript -e \'tell application "iTerm" to close first window\'');
        isTerminalActive = false;
    }
};
exports.closeTerminalIfNeeded = closeTerminalIfNeeded;
