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
var shelljs_1 = require("shelljs");
var config_1 = __importDefault(require("./config"));
var chalk_1 = __importDefault(require("chalk"));
var axios_1 = __importDefault(require("axios"));
var os_1 = require("os");
var inquirer_1 = __importDefault(require("inquirer"));
(0, shelljs_1.exec)("chmod a+x lib/src/**/*.js");
function saveUserFile() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, rootDirectory, userFileName, serverUrl, configFileName, email, placeOfWork, sound, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = (0, config_1.default)(), rootDirectory = _a.rootDirectory, userFileName = _a.userFileName, serverUrl = _a.serverUrl, configFileName = _a.configFileName;
                    return [4 /*yield*/, inquirer_1.default.prompt({
                            name: "email",
                            message: chalk_1.default.blue("Hi and welcome to \"ply-cli\". We would like to get some information in order to create the best service for you. In order to sign you up we need to know what is your email?"),
                            validate: function (input) {
                                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input);
                            },
                            type: 'input',
                            prefix: ''
                        })];
                case 1:
                    email = (_b.sent()).email;
                    return [4 /*yield*/, inquirer_1.default.prompt({
                            name: "placeOfWork",
                            message: chalk_1.default.yellow("If you can tell us where you work that would be great. We would use that to sync your workflow with your colleagues?"),
                            type: 'input',
                            prefix: '',
                            transformer: function (input) {
                                return input.toLowerCase();
                            }
                        })];
                case 2:
                    placeOfWork = (_b.sent()).placeOfWork;
                    return [4 /*yield*/, inquirer_1.default.prompt({
                            name: "sound",
                            message: chalk_1.default.magenta("We use notification for communication. Can we use sound?"),
                            type: 'confirm',
                            prefix: ''
                        })];
                case 3:
                    sound = (_b.sent()).sound;
                    return [4 /*yield*/, axios_1.default.put("".concat(serverUrl, "user"), { email: email, metadata: { placeOfWork: placeOfWork, osType: os_1.type, deviceID: "".concat((0, os_1.arch)(), ".").concat(os_1.type, "|").concat(email) }, config: { sound: sound } })
                        // await Promise.all([
                        //   fs.writeFileSync(
                        //     `${rootDirectory}${userFileName}`,
                        //     JSON.stringify({ "id": data.id }),
                        //   ), fs.writeFileSync(
                        //     `${rootDirectory}${configFileName}`,
                        //     JSON.stringify({ sound })
                        //   )]);
                    ];
                case 4:
                    data = (_b.sent()).data;
                    return [2 /*return*/];
            }
        });
    });
}
saveUserFile();
