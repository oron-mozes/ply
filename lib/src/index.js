#! /usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var firstTimeSetup_1 = require("./firstTimeSetup");
var config_1 = __importStar(require("./config"));
var promises_1 = require("node:fs/promises");
var actionManager_1 = __importDefault(require("./actionManager"));
var plyConfig_1 = require("./plyConfig");
var isTerminalActive = false;
(function init() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, rootDirectory, userFileName, files, argv, interpretCommand, startTime, _b, executionCommand, action, executionProcess;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = (0, config_1.default)(), rootDirectory = _a.rootDirectory, userFileName = _a.userFileName;
                    return [4 /*yield*/, (0, promises_1.readdir)(rootDirectory)];
                case 1:
                    files = _c.sent();
                    if (!!files.includes(userFileName)) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, firstTimeSetup_1.saveUserFile)()];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    argv = (0, helpers_1.hideBin)(process.argv);
                    if (!!argv.length) return [3 /*break*/, 5];
                    return [4 /*yield*/, (0, plyConfig_1.setupPly)()];
                case 4:
                    _c.sent();
                    return [2 /*return*/];
                case 5:
                    interpretCommand = function (cmd) {
                        var internalFlags = cmd.filter(function (arg) { return arg.startsWith('--p-'); });
                        var executionCommand = cmd.filter(function (arg) { return !arg.startsWith('--p-'); }).join(" ");
                        var action = (0, config_1.getAction)(cmd);
                        return {
                            internalFlags: internalFlags,
                            executionCommand: executionCommand,
                            action: action,
                        };
                    };
                    startTime = Date.now();
                    _b = interpretCommand(argv), executionCommand = _b.executionCommand, action = _b.action;
                    executionProcess = (0, shelljs_1.exec)(executionCommand, { async: true });
                    (0, actionManager_1.default)({ executionProcess: executionProcess, startTime: startTime, action: action });
                    return [2 /*return*/];
            }
        });
    });
})();
var closeTerminalIfNeeded = function () {
    if (isTerminalActive) {
        (0, shelljs_1.exec)('osascript -e \'tell application "iTerm" to close first window\'');
        isTerminalActive = false;
    }
};
exports.closeTerminalIfNeeded = closeTerminalIfNeeded;
