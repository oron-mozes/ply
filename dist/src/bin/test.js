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
Object.defineProperty(exports, "__esModule", { value: true });
exports.testFn = void 0;
const utils_1 = require("../../utils");
const types_1 = require("../../types");
const testFn = ({ executionProcess, startTime }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let errors = [];
    (_a = executionProcess === null || executionProcess === void 0 ? void 0 : executionProcess.stderr) === null || _a === void 0 ? void 0 : _a.on('data', (error) => {
        if ((0, utils_1.shouldReportError)(error)) {
            errors.push(error);
        }
    });
    (_b = executionProcess.stdout) === null || _b === void 0 ? void 0 : _b.once('end', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, utils_1.onProcessEnd)(startTime, types_1.ACTION.TEST, errors);
    }));
});
exports.testFn = testFn;
