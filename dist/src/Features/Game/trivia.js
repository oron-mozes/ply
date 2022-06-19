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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initTrivia = void 0;
const chalk_1 = __importDefault(require("chalk"));
const inquirer_1 = __importDefault(require("inquirer"));
const gradient_string_1 = __importDefault(require("gradient-string"));
const chalk_animation_1 = __importDefault(require("chalk-animation"));
const figlet_1 = __importDefault(require("figlet"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../../utils");
const nanospinner_1 = require("nanospinner");
const shelljs_1 = require("shelljs");
const consts_1 = require("../../../consts");
const axios_1 = __importDefault(require("axios"));
const _1 = require(".");
const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
const welcome = () => __awaiter(void 0, void 0, void 0, function* () {
    const title = chalk_animation_1.default.neon(`
        Let's Play Some Trivia\n
    `);
    yield sleep();
    title.stop();
    console.log(`
                            ${chalk_1.default.blue("INSTRUCTIONS")}
        ==============================================================
        ${chalk_1.default.green("You need to get all answers correct")} to get to the final prize.
        ${chalk_1.default.red("If you get any question wrong")}, you lose...
    `);
});
const emptyState = () => __awaiter(void 0, void 0, void 0, function* () {
    (0, shelljs_1.echo)(`Is seems like there are no more questions for you, probably because you answered all of them.\nOur brilliant team is working on writing new ones.\n${chalk_1.default.greenBright('Thank you for your patience!')}\n`);
    yield sleep();
});
const handleAnswer = ({ isCorrect, additionalInfo, additionalLink, successRate, failureRate, }) => __awaiter(void 0, void 0, void 0, function* () {
    const spinner = (0, nanospinner_1.createSpinner)("And the answer is....");
    const result = isCorrect ? "success" : "error";
    const text = isCorrect ? "That is CORRECT!" : `💀💀 WRONG 💀💀`;
    const answerRate = `This question was answered correctly ${successRate} times and incorrectly ${failureRate} times.`;
    const additionInfoMsg = additionalInfo
        ? `\n${chalk_1.default.blueBright("FYI")}\n\n${additionalInfo}`
        : "";
    const additionalLinkMsg = additionalLink
        ? `You can read more about it here: ${additionalLink}`
        : "";
    spinner[result]({ text });
    (0, shelljs_1.echo)(answerRate);
    (0, shelljs_1.echo)(additionInfoMsg);
    (0, shelljs_1.echo)(additionalLinkMsg);
    return isCorrect;
});
const winningTitle = () => __awaiter(void 0, void 0, void 0, function* () {
    const msg = `WELL DONE`;
    (0, figlet_1.default)(msg, (_err, data) => {
        console.log(gradient_string_1.default.pastel.multiline(data));
    });
});
const askQuestion = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, question, options, correctAnswer, additionalInfo, additionalLink, successRate, failureRate, } = data;
    const answer = yield inquirer_1.default.prompt({
        name: _id,
        message: question,
        choices: options,
        type: "list",
    });
    const isCorrect = options.findIndex((option) => option === answer[_id]) === correctAnswer;
    return handleAnswer({
        isCorrect,
        additionalInfo,
        additionalLink,
        successRate,
        failureRate,
    });
});
const reportSeenQuestion = (allQuestions, seenQuestions) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = (0, utils_1.getUserData)();
    const bulk = allQuestions.reduce((acc, question) => {
        acc.push({
            itemId: question._id,
            correct: seenQuestions.some((seenQuestion) => seenQuestion === question._id),
        });
        return acc;
    }, []);
    try {
        yield axios_1.default.post(`${consts_1.apiBaseUrl}/updateTrivia`, {
            userId,
            bulk: bulk,
        });
    }
    catch (error) { }
});
const writeNewSeenQuestion = (items, seenQuestions, timestamp) => {
    fs_1.default.writeFile(`${(0, utils_1.getLocalStorage)()}/trivia.json`, JSON.stringify({ items: [...items], seen: [...seenQuestions], timestamp }), (err) => {
        if (err)
            throw err;
    });
};
const reFetchDataIfNeeded = (timestamp) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, utils_1.shouldReFecthData)(timestamp, 3)) {
        const { id: userId } = (0, utils_1.getUserData)();
        const { data } = yield axios_1.default.get(`${consts_1.apiBaseUrl}/trivia?userId=${userId}`);
        data.seen = [];
        data.timestamp = Date.now();
        fs_1.default.writeFile(`${(0, utils_1.getLocalStorage)()}/trivia.json`, JSON.stringify(data), (err) => {
            if (err)
                throw err;
        });
    }
});
const initTrivia = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const { items: questionArray, seen: seenQuestions, timestamp, } = JSON.parse(fs_1.default.readFileSync(`${(0, utils_1.getLocalStorage)()}/trivia.json`, "utf-8"));
    const newSeenQuestions = seenQuestions !== null && seenQuestions !== void 0 ? seenQuestions : [];
    const notSeenYetQuestion = questionArray.filter((question) => !newSeenQuestions.some((seenQuestionId) => seenQuestionId === question._id));
    (0, shelljs_1.exec)("clear");
    if (notSeenYetQuestion.length === 0) {
        yield emptyState();
    }
    else {
        yield welcome();
        try {
            for (var notSeenYetQuestion_1 = __asyncValues(notSeenYetQuestion), notSeenYetQuestion_1_1; notSeenYetQuestion_1_1 = yield notSeenYetQuestion_1.next(), !notSeenYetQuestion_1_1.done;) {
                const question = notSeenYetQuestion_1_1.value;
                const answer = yield askQuestion(question);
                if (answer) {
                    newSeenQuestions.push(question._id);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (notSeenYetQuestion_1_1 && !notSeenYetQuestion_1_1.done && (_a = notSeenYetQuestion_1.return)) yield _a.call(notSeenYetQuestion_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        yield winningTitle();
        yield reportSeenQuestion(notSeenYetQuestion, newSeenQuestions);
        writeNewSeenQuestion(questionArray, newSeenQuestions, timestamp);
    }
    reFetchDataIfNeeded(timestamp);
    (0, _1.gameSelectorScreen)();
});
exports.initTrivia = initTrivia;
