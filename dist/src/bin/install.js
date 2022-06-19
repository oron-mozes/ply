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
exports.installFn = void 0;
const utils_1 = require("../utils");
const types_1 = require("../../types");
const shelljs_1 = require("shelljs");
const chalk_1 = __importDefault(require("chalk"));
const installFn = ({ executionProcess, startTime }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let errors = [];
    const errList = new Set([]);
    (_a = executionProcess === null || executionProcess === void 0 ? void 0 : executionProcess.stderr) === null || _a === void 0 ? void 0 : _a.on('data', (error) => {
        const e = error.split(' ');
        errList.add(JSON.stringify({ type: e.shift(), e: e.join(' ') }));
        //we can use that in the BE to label those type of issues as VPN issues
        // if(error.includes('http://npm.dev.wixpress.com/') && error.includes('ETIMEDOUT')) {
        //   echo(chalk.red('Seems that you are not connected to VPN'))
        // }
        if ((0, utils_1.shouldReportError)(error)) {
            (0, shelljs_1.echo)(chalk_1.default.redBright(error));
            errors.push(error);
        }
    });
    (_b = executionProcess.stdout) === null || _b === void 0 ? void 0 : _b.once('end', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, utils_1.onProcessEnd)(startTime, types_1.ACTION.INSTALL, errors);
    }));
});
exports.installFn = installFn;
