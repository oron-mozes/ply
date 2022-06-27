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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTrivia = void 0;
var chalk_1 = __importDefault(require("chalk"));
var inquirer_1 = __importDefault(require("inquirer"));
var gradient_string_1 = __importDefault(require("gradient-string"));
var chalk_animation_1 = __importDefault(require("chalk-animation"));
var figlet_1 = __importDefault(require("figlet"));
var fs_1 = __importDefault(require("fs"));
;
var nanospinner_1 = require("nanospinner");
var shelljs_1 = require("shelljs");
var consts_1 = require("../../consts");
var axios_1 = __importDefault(require("axios"));
var _1 = require(".");
var utils_1 = require("../../utils");
var sleep = function (ms) {
    if (ms === void 0) { ms = 1000; }
    return new Promise(function (r) { return setTimeout(r, ms); });
};
var welcome = function () { return __awaiter(void 0, void 0, void 0, function () {
    var title;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                title = chalk_animation_1.default.neon("\n        Let's Play Some Trivia\n\n    ");
                return [4 /*yield*/, sleep()];
            case 1:
                _a.sent();
                title.stop();
                console.log("\n                            ".concat(chalk_1.default.blue("INSTRUCTIONS"), "\n        ==============================================================\n        ").concat(chalk_1.default.green("You need to get all answers correct"), " to get to the final prize.\n        ").concat(chalk_1.default.red("If you get any question wrong"), ", you lose...\n    "));
                return [2 /*return*/];
        }
    });
}); };
var emptyState = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                (0, shelljs_1.echo)("Is seems like there are no more questions for you, probably because you answered all of them.\nOur brilliant team is working on writing new ones.\n".concat(chalk_1.default.greenBright('Thank you for your patience!'), "\n"));
                return [4 /*yield*/, sleep()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var handleAnswer = function (_a) {
    var isCorrect = _a.isCorrect, additionalInfo = _a.additionalInfo, additionalLink = _a.additionalLink, successRate = _a.successRate, failureRate = _a.failureRate;
    return __awaiter(void 0, void 0, void 0, function () {
        var spinner, result, text, answerRate, additionInfoMsg, additionalLinkMsg;
        return __generator(this, function (_b) {
            spinner = (0, nanospinner_1.createSpinner)("And the answer is....");
            result = isCorrect ? "success" : "error";
            text = isCorrect ? "That is CORRECT!" : "\uD83D\uDC80\uD83D\uDC80 WRONG \uD83D\uDC80\uD83D\uDC80";
            answerRate = "This question was answered correctly ".concat(successRate, " times and incorrectly ").concat(failureRate, " times.");
            additionInfoMsg = additionalInfo
                ? "\n".concat(chalk_1.default.blueBright("FYI"), "\n\n").concat(additionalInfo)
                : "";
            additionalLinkMsg = additionalLink
                ? "You can read more about it here: ".concat(additionalLink)
                : "";
            spinner[result]({ text: text });
            (0, shelljs_1.echo)(answerRate);
            (0, shelljs_1.echo)(additionInfoMsg);
            (0, shelljs_1.echo)(additionalLinkMsg);
            return [2 /*return*/, isCorrect];
        });
    });
};
var winningTitle = function () { return __awaiter(void 0, void 0, void 0, function () {
    var msg;
    return __generator(this, function (_a) {
        msg = "WELL DONE";
        (0, figlet_1.default)(msg, function (_err, data) {
            console.log(gradient_string_1.default.pastel.multiline(data));
        });
        return [2 /*return*/];
    });
}); };
var askQuestion = function (data) { return __awaiter(void 0, void 0, void 0, function () {
    var _id, question, options, correctAnswer, additionalInfo, additionalLink, successRate, failureRate, answer, isCorrect;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _id = data._id, question = data.question, options = data.options, correctAnswer = data.correctAnswer, additionalInfo = data.additionalInfo, additionalLink = data.additionalLink, successRate = data.successRate, failureRate = data.failureRate;
                return [4 /*yield*/, inquirer_1.default.prompt({
                        name: _id,
                        message: question,
                        choices: options,
                        type: "list",
                    })];
            case 1:
                answer = _a.sent();
                isCorrect = options.findIndex(function (option) { return option === answer[_id]; }) === correctAnswer;
                return [2 /*return*/, handleAnswer({
                        isCorrect: isCorrect,
                        additionalInfo: additionalInfo,
                        additionalLink: additionalLink,
                        successRate: successRate,
                        failureRate: failureRate,
                    })];
        }
    });
}); };
var reportSeenQuestion = function (allQuestions, seenQuestions) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, bulk, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = (0, utils_1.getUserData)().id;
                bulk = allQuestions.reduce(function (acc, question) {
                    acc.push({
                        itemId: question._id,
                        correct: seenQuestions.some(function (seenQuestion) { return seenQuestion === question._id; }),
                    });
                    return acc;
                }, []);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios_1.default.post("".concat(consts_1.apiBaseUrl, "/updateTrivia"), {
                        userId: userId,
                        bulk: bulk,
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var writeNewSeenQuestion = function (items, seenQuestions, timestamp) {
    fs_1.default.writeFile("".concat((0, utils_1.getLocalStorage)(), "/trivia.json"), JSON.stringify({ items: __spreadArray([], items, true), seen: __spreadArray([], seenQuestions, true), timestamp: timestamp }), function (err) {
        if (err)
            throw err;
    });
};
var reFetchDataIfNeeded = function (timestamp) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!(0, utils_1.shouldReFecthData)(timestamp, 3)) return [3 /*break*/, 2];
                userId = (0, utils_1.getUserData)().id;
                return [4 /*yield*/, axios_1.default.get("".concat(consts_1.apiBaseUrl, "/trivia?userId=").concat(userId))];
            case 1:
                data = (_a.sent()).data;
                data.seen = [];
                data.timestamp = Date.now();
                fs_1.default.writeFile("".concat((0, utils_1.getLocalStorage)(), "/trivia.json"), JSON.stringify(data), function (err) {
                    if (err)
                        throw err;
                });
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
var initTrivia = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, questionArray, seenQuestions, timestamp, newSeenQuestions, notSeenYetQuestion, notSeenYetQuestion_1, notSeenYetQuestion_1_1, question, answer, e_1_1;
    var e_1, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = JSON.parse(fs_1.default.readFileSync("".concat((0, utils_1.getLocalStorage)(), "/trivia.json"), "utf-8")), questionArray = _a.items, seenQuestions = _a.seen, timestamp = _a.timestamp;
                newSeenQuestions = seenQuestions !== null && seenQuestions !== void 0 ? seenQuestions : [];
                notSeenYetQuestion = questionArray.filter(function (question) {
                    return !newSeenQuestions.some(function (seenQuestionId) { return seenQuestionId === question._id; });
                });
                (0, shelljs_1.exec)("clear");
                if (!(notSeenYetQuestion.length === 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, emptyState()];
            case 1:
                _c.sent();
                return [3 /*break*/, 19];
            case 2: return [4 /*yield*/, welcome()];
            case 3:
                _c.sent();
                _c.label = 4;
            case 4:
                _c.trys.push([4, 10, 11, 16]);
                notSeenYetQuestion_1 = __asyncValues(notSeenYetQuestion);
                _c.label = 5;
            case 5: return [4 /*yield*/, notSeenYetQuestion_1.next()];
            case 6:
                if (!(notSeenYetQuestion_1_1 = _c.sent(), !notSeenYetQuestion_1_1.done)) return [3 /*break*/, 9];
                question = notSeenYetQuestion_1_1.value;
                return [4 /*yield*/, askQuestion(question)];
            case 7:
                answer = _c.sent();
                if (answer) {
                    newSeenQuestions.push(question._id);
                }
                _c.label = 8;
            case 8: return [3 /*break*/, 5];
            case 9: return [3 /*break*/, 16];
            case 10:
                e_1_1 = _c.sent();
                e_1 = { error: e_1_1 };
                return [3 /*break*/, 16];
            case 11:
                _c.trys.push([11, , 14, 15]);
                if (!(notSeenYetQuestion_1_1 && !notSeenYetQuestion_1_1.done && (_b = notSeenYetQuestion_1.return))) return [3 /*break*/, 13];
                return [4 /*yield*/, _b.call(notSeenYetQuestion_1)];
            case 12:
                _c.sent();
                _c.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                if (e_1) throw e_1.error;
                return [7 /*endfinally*/];
            case 15: return [7 /*endfinally*/];
            case 16: return [4 /*yield*/, winningTitle()];
            case 17:
                _c.sent();
                return [4 /*yield*/, reportSeenQuestion(notSeenYetQuestion, newSeenQuestions)];
            case 18:
                _c.sent();
                writeNewSeenQuestion(questionArray, newSeenQuestions, timestamp);
                _c.label = 19;
            case 19:
                reFetchDataIfNeeded(timestamp);
                (0, _1.gameSelectorScreen)();
                return [2 /*return*/];
        }
    });
}); };
exports.initTrivia = initTrivia;
