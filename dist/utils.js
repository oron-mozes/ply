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
exports.sleep = exports.sendProcessDoneSlackMessage = exports.onProcessEnd = exports.shouldReFecthData = exports.reportErrors = exports.reportProcessDuration = exports.shouldReportError = exports.getUserData = exports.getLocalStorage = void 0;
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const consts_1 = require("./consts");
const read_package_json_1 = require("./src/services/read-package-json");
const os_1 = require("os");
const controller_1 = require("./src/controller");
const shelljs_1 = require("shelljs");
const chalk_1 = __importDefault(require("chalk"));
const getLocalStorage = () => `${(0, os_1.homedir)()}/.ply/local-storage`;
exports.getLocalStorage = getLocalStorage;
const getUserData = () => JSON.parse(fs_1.default.readFileSync(`${(0, exports.getLocalStorage)()}/user.json`, 'utf8'));
exports.getUserData = getUserData;
function shouldReportError(error) {
    const type = error.split(' ').shift();
    return ['error', 'failed'].includes(type);
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
    return __awaiter(this, void 0, void 0, function* () {
        if (errors.length > 0) {
            const userData = (0, exports.getUserData)();
            const packageJson = (0, read_package_json_1.getPackageJson)();
            const { data: reportErrorsResult } = yield axios_1.default.post(`${consts_1.apiBaseUrl}/error`, {
                bulk: errors,
                userId: userData.id,
                name: packageJson.name,
                action,
                dependencies: Array.from(new Set(Object.keys(packageJson.dependencies).concat(Object.keys(packageJson.devDependencies)))),
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
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
exports.sleep = sleep;
