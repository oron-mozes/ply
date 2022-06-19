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
exports.sleep = exports.signupUser = exports.saveData = exports.sendProcessDoneSlackMessage = exports.onProcessEnd = exports.shouldReFecthData = exports.reportErrors = exports.reportProcessDuration = exports.shouldReportError = exports.getUserData = exports.getLocalStorage = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const consts_1 = require("../consts");
const read_package_json_1 = require("./services/read-package-json");
const os_1 = require("os");
const controller_1 = require("./controller");
const shelljs_1 = require("shelljs");
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const os_2 = require("os");
const getLocalStorage = () => `${(0, os_1.homedir)()}/.ply/local-storage`;
exports.getLocalStorage = getLocalStorage;
const getUserData = () => JSON.parse(fs_1.default.readFileSync(`${(0, exports.getLocalStorage)()}/user.json`, 'utf8'));
exports.getUserData = getUserData;
function shouldReportError(error) {
    const type = error.split(' ').shift();
    // console.log('??????????????', type)
    return ['error', 'failed', 'err'].includes(type.trim().toLowerCase());
}
exports.shouldReportError = shouldReportError;
function reportProcessDuration(startTime, action) {
    return __awaiter(this, void 0, void 0, function* () {
        const durationInMs = Date.now() - startTime;
        const userData = (0, exports.getUserData)();
        const packageJson = (0, read_package_json_1.getPackageJson)();
        yield axios_1.default.post(`${consts_1.apiBaseUrl}/project`, {
            userId: userData.id,
            name: packageJson.name,
            action,
            time: durationInMs,
        });
        (0, shelljs_1.echo)(`\n${chalk_1.default.green(`Thanks for helping our dev flow be better.`)}`);
    });
}
exports.reportProcessDuration = reportProcessDuration;
function reportErrors(errors, action) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (errors.length > 0) {
            const userData = (0, exports.getUserData)();
            const packageJson = (0, read_package_json_1.getPackageJson)();
            const { data: reportErrorsResult } = yield axios_1.default.post(`${consts_1.apiBaseUrl}/error`, {
                bulk: errors,
                userId: userData.id,
                name: packageJson.name,
                action,
                dependencies: Array.from(new Set(Object.keys((_a = packageJson === null || packageJson === void 0 ? void 0 : packageJson.dependencies) !== null && _a !== void 0 ? _a : {}).concat(Object.keys((_b = packageJson === null || packageJson === void 0 ? void 0 : packageJson.devDependencies) !== null && _b !== void 0 ? _b : {})))),
            });
            (0, shelljs_1.echo)(chalk_1.default.bgRedBright(`We have found some issues and here are our recommendation: ${JSON.stringify(reportErrorsResult.results.map((row) => row.solutions.reduce((acc, nextVal) => {
                if (acc !== '') {
                    acc += ' | ';
                }
                acc += nextVal;
                return acc;
            }, '')))}`));
        }
    });
}
exports.reportErrors = reportErrors;
const shouldReFecthData = (timesetmp, timeInHours = 1) => {
    const currentTime = Date.now();
    const totalTime = Math.round((currentTime - timesetmp) / 1000) / 60 / 60;
    return totalTime > timeInHours;
};
exports.shouldReFecthData = shouldReFecthData;
const onProcessEnd = (startTime, action, errors) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = (0, exports.getUserData)();
    const packageJson = (0, read_package_json_1.getPackageJson)();
    yield reportProcessDuration(startTime, action);
    yield reportErrors(errors, action);
    yield (0, exports.sendProcessDoneSlackMessage)(userData.id, packageJson.name, action);
    (0, controller_1.closeTerminalIfNeeded)();
    (0, shelljs_1.exit)(1);
});
exports.onProcessEnd = onProcessEnd;
const sendProcessDoneSlackMessage = (userId, projectName, action) => __awaiter(void 0, void 0, void 0, function* () {
    yield axios_1.default.post(`${consts_1.apiBaseUrl}/sendSlackDirectMessage`, {
        userId,
        message: `${action.toLowerCase()} process finished on ${projectName}`,
    });
});
exports.sendProcessDoneSlackMessage = sendProcessDoneSlackMessage;
const saveData = () => __awaiter(void 0, void 0, void 0, function* () {
    const keys = ['music', 'feed', 'trivia'];
    const timestamp = Date.now();
    const userData = (0, exports.getUserData)();
    const userId = userData.id || '';
    yield Promise.all(keys.map((key) => __awaiter(void 0, void 0, void 0, function* () {
        const { data } = yield axios_1.default.get(`${consts_1.apiBaseUrl}/${key}?userId=${userId}`);
        data.timestamp = timestamp;
        fs_1.default.writeFile(`${(0, exports.getLocalStorage)()}/${key}.json`, JSON.stringify(data), (err) => {
            if (err)
                throw err;
        });
    })));
});
exports.saveData = saveData;
const signupUser = () => __awaiter(void 0, void 0, void 0, function* () {
    console.clear();
    console.log(`Welcome To The ${chalk_1.default.redBright(chalk_1.default.bold("</Sideshow>"))}\n`);
    const user = (0, os_2.userInfo)();
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
    fs_1.default.writeFile(`${(0, exports.getLocalStorage)()}/user.json`, JSON.stringify(data), function (err) {
        if (err)
            throw err;
    });
    yield new Promise(resolve => setTimeout(resolve, 250));
});
exports.signupUser = signupUser;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.sleep = sleep;
