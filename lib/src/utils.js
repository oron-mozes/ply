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
exports.sleep = exports.signupUser = exports.saveData = exports.sendProcessDoneSlackMessage = exports.onProcessEnd = exports.shouldReFecthData = exports.reportErrors = exports.reportProcessDuration = exports.shouldReportError = exports.getUserData = exports.getLocalStorage = void 0;
var axios_1 = __importDefault(require("axios"));
var fs_1 = __importDefault(require("fs"));
var consts_1 = require("./consts");
var read_package_json_1 = require("./services/read-package-json");
var os_1 = require("os");
var controller_1 = require("./controller");
var shelljs_1 = require("shelljs");
var chalk_1 = __importDefault(require("chalk"));
var inquirer_1 = __importDefault(require("inquirer"));
var os_2 = require("os");
var getLocalStorage = function () { return "".concat((0, os_1.homedir)(), "/.ply/local-storage"); };
exports.getLocalStorage = getLocalStorage;
var getUserData = function () { return JSON.parse(fs_1.default.readFileSync("".concat((0, exports.getLocalStorage)(), "/user.json"), 'utf8')); };
exports.getUserData = getUserData;
function shouldReportError(error) {
    var type = error.split(' ').shift();
    // console.log('??????????????', type)
    return ['error', 'failed', 'err'].includes(type.trim().toLowerCase());
}
exports.shouldReportError = shouldReportError;
function reportProcessDuration(startTime, action) {
    return __awaiter(this, void 0, void 0, function () {
        var durationInMs, userData, packageJson;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    durationInMs = Date.now() - startTime;
                    userData = (0, exports.getUserData)();
                    packageJson = (0, read_package_json_1.getPackageJson)();
                    return [4 /*yield*/, axios_1.default.post("".concat(consts_1.apiBaseUrl, "/project"), {
                            userId: userData.id,
                            name: packageJson.name,
                            action: action,
                            time: durationInMs,
                        })];
                case 1:
                    _a.sent();
                    (0, shelljs_1.echo)("\n".concat(chalk_1.default.green("Thanks for helping our dev flow be better.")));
                    return [2 /*return*/];
            }
        });
    });
}
exports.reportProcessDuration = reportProcessDuration;
function reportErrors(errors, action) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var userData, packageJson, reportErrorsResult;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!(errors.length > 0)) return [3 /*break*/, 2];
                    userData = (0, exports.getUserData)();
                    packageJson = (0, read_package_json_1.getPackageJson)();
                    return [4 /*yield*/, axios_1.default.post("".concat(consts_1.apiBaseUrl, "/error"), {
                            bulk: errors,
                            userId: userData.id,
                            name: packageJson.name,
                            action: action,
                            dependencies: Array.from(new Set(Object.keys((_a = packageJson === null || packageJson === void 0 ? void 0 : packageJson.dependencies) !== null && _a !== void 0 ? _a : {}).concat(Object.keys((_b = packageJson === null || packageJson === void 0 ? void 0 : packageJson.devDependencies) !== null && _b !== void 0 ? _b : {})))),
                        })];
                case 1:
                    reportErrorsResult = (_c.sent()).data;
                    (0, shelljs_1.echo)(chalk_1.default.bgRedBright("We have found some issues and here are our recommendation: ".concat(JSON.stringify(reportErrorsResult.results.map(function (row) { return row.solutions.reduce(function (acc, nextVal) {
                        if (acc !== '') {
                            acc += ' | ';
                        }
                        acc += nextVal;
                        return acc;
                    }, ''); })))));
                    _c.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.reportErrors = reportErrors;
var shouldReFecthData = function (timesetmp, timeInHours) {
    if (timeInHours === void 0) { timeInHours = 1; }
    var currentTime = Date.now();
    var totalTime = Math.round((currentTime - timesetmp) / 1000) / 60 / 60;
    return totalTime > timeInHours;
};
exports.shouldReFecthData = shouldReFecthData;
var onProcessEnd = function (startTime, action, errors) { return __awaiter(void 0, void 0, void 0, function () {
    var userData, packageJson;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userData = (0, exports.getUserData)();
                packageJson = (0, read_package_json_1.getPackageJson)();
                return [4 /*yield*/, reportProcessDuration(startTime, action)];
            case 1:
                _a.sent();
                return [4 /*yield*/, reportErrors(errors, action)];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, exports.sendProcessDoneSlackMessage)(userData.id, packageJson.name, action)];
            case 3:
                _a.sent();
                (0, controller_1.closeTerminalIfNeeded)();
                (0, shelljs_1.exit)(1);
                return [2 /*return*/];
        }
    });
}); };
exports.onProcessEnd = onProcessEnd;
var sendProcessDoneSlackMessage = function (userId, projectName, action) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, axios_1.default.post("".concat(consts_1.apiBaseUrl, "/sendSlackDirectMessage"), {
                    userId: userId,
                    message: "".concat(action.toLowerCase(), " process finished on ").concat(projectName),
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.sendProcessDoneSlackMessage = sendProcessDoneSlackMessage;
var saveData = function () { return __awaiter(void 0, void 0, void 0, function () {
    var keys, timestamp, userData, userId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                keys = ['music', 'feed', 'trivia'];
                timestamp = Date.now();
                userData = (0, exports.getUserData)();
                userId = userData.id || '';
                return [4 /*yield*/, Promise.all(keys.map(function (key) { return __awaiter(void 0, void 0, void 0, function () {
                        var data;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, axios_1.default.get("".concat(consts_1.apiBaseUrl, "/").concat(key, "?userId=").concat(userId))];
                                case 1:
                                    data = (_a.sent()).data;
                                    data.timestamp = timestamp;
                                    fs_1.default.writeFile("".concat((0, exports.getLocalStorage)(), "/").concat(key, ".json"), JSON.stringify(data), function (err) {
                                        if (err)
                                            throw err;
                                    });
                                    return [2 /*return*/];
                            }
                        });
                    }); }))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.saveData = saveData;
var signupUser = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user, userType, userOrg, isAnEmployee, organization, userEmail, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.clear();
                console.log("Welcome To The ".concat(chalk_1.default.redBright(chalk_1.default.bold("</Sideshow>")), "\n"));
                user = (0, os_2.userInfo)();
                return [4 /*yield*/, inquirer_1.default.prompt({
                        name: "userType",
                        message: "Are you signing up to a workspace or as a private user?",
                        choices: ['Private', 'Workspace'],
                        type: "list",
                        prefix: '',
                    })];
            case 1:
                userType = (_a.sent()).userType;
                userOrg = '';
                isAnEmployee = userType === "Workspace";
                if (!isAnEmployee) return [3 /*break*/, 3];
                return [4 /*yield*/, inquirer_1.default.prompt({
                        name: "organization",
                        message: "Please select a workspace to join",
                        choices: ['WIX', 'Microsoft', 'Floatplane'],
                        type: "list",
                        prefix: '',
                    })];
            case 2:
                organization = (_a.sent()).organization;
                userOrg = organization;
                _a.label = 3;
            case 3: return [4 /*yield*/, inquirer_1.default.prompt({
                    name: "userEmail",
                    message: "Please enter an email".concat(isAnEmployee ? " (Must be a valid ".concat(userOrg, " email)") : '', ":"),
                    type: "input",
                    prefix: '',
                })];
            case 4:
                userEmail = (_a.sent()).userEmail;
                console.log("\n".concat(chalk_1.default.greenBright("Thank you for registering!")));
                if (isAnEmployee) {
                    console.log("Please note you will not be presented with ".concat(userOrg, " related content until you ").concat(chalk_1.default.bold("verify your email.")));
                }
                return [4 /*yield*/, axios_1.default.put("".concat(consts_1.apiBaseUrl, "/user"), {
                        name: user.username,
                        email: userEmail.trim(),
                    })];
            case 5:
                data = (_a.sent()).data;
                fs_1.default.writeFile("".concat((0, exports.getLocalStorage)(), "/user.json"), JSON.stringify(data), function (err) {
                    if (err)
                        throw err;
                });
                return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 250); })];
            case 6:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.signupUser = signupUser;
var sleep = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
exports.sleep = sleep;
