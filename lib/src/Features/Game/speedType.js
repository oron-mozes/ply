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
exports.initSpeedType = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var _1 = require(".");
var inquirer_1 = __importDefault(require("inquirer"));
var axios_1 = __importDefault(require("axios"));
var consts_1 = require("../../consts");
var services_1 = require("../../services");
var chalk_1 = __importDefault(require("chalk"));
var initSpeedType = function () {
    function flagExists(shortFlag, longFlag) {
        return process.argv.indexOf("-".concat(shortFlag)) !== process.argv.indexOf("--".concat(longFlag));
    }
    // Show help if at least one of these flags are present
    if (flagExists('h', 'help')) {
        console.log('Usage:');
        console.log('  cli-typer [options]');
        console.log('\nOptions:');
        console.log('  -t, --time\t\tGiven time in seconds to complete the test');
        console.log('  -w, --words\t\tNumber of words to display per line');
        console.log('  -i, --input\t\tPath to a wordlist file with new line separated words');
        console.log('  -V, --verbose\t\tShow settings on start');
        console.log('  -s, --save\t\tPath to file for saving results');
        console.log('  -h, --help\t\tShow help');
        process.exit();
    }
    var CONFIG = initConfig();
    var stdin = process.stdin;
    var stdout = process.stdout;
    var SPECIAL = {
        CTRL_C: '\u0003',
        BACKSPACE: '\u007f',
        GREEN_BG: '\x1b[42m',
        RED_BG: '\x1b[41m',
        GREEN_TEXT: '\x1b[32m',
        RESET: '\x1b[0m'
    };
    var ALPHANUMERIC = /[\u0000-\u007F\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u0370-\u03FF\u0400-\u04FF\u0500-\u052F]/u;
    var ANSI_ESCAPE = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;
    var lineGen = lineGenerator(CONFIG.inputFile, CONFIG.wordsPerLine);
    var text, nextText, cursor;
    function removeAnsiEscape(text) {
        return text.replace(ANSI_ESCAPE, '');
    }
    function timePad(time) {
        return ('00' + time).slice(-2);
    }
    function calcRemainingTime() {
        var allSeconds = CONFIG.givenSeconds - Math.round((Date.now() - startTime) / 1000);
        var minutes = Math.floor(allSeconds / 60);
        var seconds = allSeconds % 60;
        return timePad(minutes) + ':' + timePad(seconds);
    }
    // TODO maybe merge box functions to one
    function boxTop(width) {
        if (width === void 0) { width = 79; }
        return '╭' + '─'.repeat(width - 14) + '┨ ' + calcRemainingTime() + ' ┠───╮';
    }
    function boxText(text, width) {
        if (width === void 0) { width = 79; }
        var spaceAvailable = width - 4 - removeAnsiEscape(text).length;
        if (spaceAvailable < 0) {
            return '│ ' + text;
        }
        return '│ ' + text + ' '.repeat(spaceAvailable) + ' │';
    }
    function boxSeparator(width) {
        if (width === void 0) { width = 79; }
        return '├' + '─'.repeat(width - 2) + '┤';
    }
    function boxBottom(width) {
        if (width === void 0) { width = 79; }
        return '╰' + '─'.repeat(width - 2) + '╯';
    }
    function drawBox() {
        if (boxDrawIsLocked) {
            return;
        }
        boxDrawIsLocked = true;
        // Erase the whole thing and display the next words to type
        stdout.clearLine(0);
        stdout.moveCursor(0, -2);
        stdout.clearLine(0);
        stdout.moveCursor(0, -1);
        stdout.clearLine(0);
        stdout.moveCursor(0, -1);
        stdout.clearLine(0);
        stdout.cursorTo(0);
        stdout.write(boxTop() + '\n' + boxText(results + text.substring(cursor)) + '\n' + boxText(nextText) + '\n\n│ ' + wrote);
        boxDrawIsLocked = false;
    }
    function printStatsAndSendResults() {
        STATS.wpm = Math.round(STATS.corrects / 5 * (60 / CONFIG.givenSeconds));
        STATS.accuracy = Math.round(STATS.corrects / STATS.keypresses * 10000) / 100;
        console.log(' '.repeat(79 - 3 - wrote.length) + '│\n' + boxSeparator());
        console.log(boxText('Time\'s up!'));
        console.log(boxText("WPM: ".concat(STATS.wpm)));
        console.log(boxText("All keystrokes: ".concat(STATS.keypresses)));
        console.log(boxText("Correct keystrokes: ".concat(STATS.corrects)));
        console.log(boxText("Wrong keystrokes: ".concat(STATS.errors)));
        console.log(boxText("Accuracy: ".concat(STATS.accuracy, "%")));
        console.log(boxBottom());
    }
    function initConfig() {
        var textFilePath = "".concat(path_1.default.resolve(__dirname, '../../../../'), "/speedTypeData/mostCommon1000.txt");
        return {
            wordsPerLine: argvParser(['-w', '--words'], 9, validateIntArg),
            givenSeconds: argvParser(['-t', '--time'], 45, validateIntArg),
            inputFile: argvParser(['-i', '--input'], textFilePath),
            verbose: flagExists('V', 'verbose'),
            debug: flagExists('d', 'debug'),
            savePath: argvParser(['-s', '--save'], false)
        };
    }
    function plural(times, noun) {
        var output = "".concat(times, " ").concat(noun);
        return times !== 1 ? output + 's' : output;
    }
    function printConfig(config) {
        console.log(boxTop());
        console.log(boxText('Settings'));
        console.log(boxSeparator());
        console.log(boxText(plural(config.givenSeconds, 'second')));
        console.log(boxText("".concat(plural(config.wordsPerLine, 'word'), " per line")));
        console.log(boxText("Input: ".concat(config.inputFile)));
        if (config.savePath !== false) {
            console.log(boxText("Save path: ".concat(config.savePath)));
        }
        console.log(boxBottom());
    }
    function validateIntArg(flags, arg) {
        var intArg = parseInt(arg, 10);
        if (isNaN(intArg)) {
            console.log("\"".concat(arg, "\"\n").concat(flags.join(', '), " arg should be a whole number.\n"));
            return false;
        }
        if (intArg < 1) {
            console.log("".concat(flags.join(', '), " must be higher than 0. Set to default.\n"));
            return false;
        }
        return !!intArg;
    }
    function argvParser(flags, dflt, validateFunction) {
        for (var _i = 0, flags_1 = flags; _i < flags_1.length; _i++) {
            var flag = flags_1[_i];
            if (process.argv.indexOf(flag) !== -1) {
                var param = process.argv[process.argv.indexOf(flag) + 1];
                if (!validateFunction) {
                    return param;
                }
                var validatedParam = validateFunction(flags, param);
                if (!validatedParam) {
                    break;
                }
                return validatedParam;
            }
        }
        return dflt;
    }
    function random(min, max) {
        if (max === null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    }
    function shuffle(obj) {
        var sample = obj.slice();
        var last = sample.length - 1;
        for (var index = 0; index < sample.length; index++) {
            var rand = random(index, last);
            var temp = sample[index];
            sample[index] = sample[rand];
            sample[rand] = temp;
        }
        return sample.slice();
    }
    function lineGenerator(path, numberOfWords) {
        var words, shuffledWords, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    words = fs_1.default.readFileSync(path, 'utf8').split('\n');
                    shuffledWords = shuffle(words);
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i + numberOfWords < shuffledWords.length - 1)) return [3 /*break*/, 4];
                    return [4 /*yield*/, shuffledWords.slice(i, i + numberOfWords).join(' ')];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i += numberOfWords;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }
    // TODO tidy up
    function saveStats(stats, config) {
        var date = new Date(startTime).toLocaleString();
        var headers = 'Date\tLength (seconds)\tWPM\tKeystrokes\tCorrect\tWrong\tAccuracy\tInput\n';
        var content = [date, config.givenSeconds, stats.wpm, stats.keypresses, stats.corrects,
            stats.errors, stats.accuracy, config.inputFile].join('\t') + '\n';
        var data;
        try {
            fs_1.default.statSync(config.savePath).isFile();
            // If the file exists, assume headers have already been written
            data = content;
        }
        catch (exception) {
            if (exception.code === 'ENOENT') {
                // Since the file does not exist, write the headers as well
                data = headers + content;
            }
            else {
                throw exception;
            }
        }
        fs_1.default.appendFileSync(config.savePath, data);
    }
    function start() {
        var _this = this;
        setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
            var id, _a, avgWpm, bestWpm, firstPlaceUserId, firstPlaceUserEmail, answer;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        printStatsAndSendResults();
                        boxDrawIsLocked = true;
                        id = (0, services_1.getUserData)().id;
                        return [4 /*yield*/, axios_1.default.get("".concat(consts_1.apiBaseUrl, "/speedTypeScore"))];
                    case 1: return [4 /*yield*/, (_b.sent()).data.items];
                    case 2:
                        _a = _b.sent(), avgWpm = _a.avgWpm, bestWpm = _a.bestWpm, firstPlaceUserId = _a.firstPlaceUserId, firstPlaceUserEmail = _a.firstPlaceUserEmail;
                        return [4 /*yield*/, axios_1.default.post("".concat(consts_1.apiBaseUrl, "/speedTypeScore"), {
                                userId: id,
                                wpm: STATS.wpm,
                            })];
                    case 3:
                        _b.sent();
                        if (STATS.wpm > bestWpm) {
                            if (id === firstPlaceUserId) {
                                // cungrats - brok your record.
                                console.log("Congratulations! you broke your previous record of ".concat(chalk_1.default.greenBright("".concat(bestWpm, " WPM")), "\nand you are still ").concat(chalk_1.default.bold(chalk_1.default.greenBright('leading the board'))));
                            }
                            else {
                                // cungrats - new leader.
                                console.log("Congratulations! ".concat(chalk_1.default.bold(chalk_1.default.greenBright('you overtook the throne!')), "\nYou have beaten ").concat(chalk_1.default.redBright(firstPlaceUserEmail), "'s previous record of ").concat(chalk_1.default.redBright("".concat(bestWpm, " WPM")), "\nThe new score is ").concat(chalk_1.default.greenBright.bold("".concat(STATS.wpm, " WPM"))));
                            }
                        }
                        else if (STATS.wpm > avgWpm) {
                            // better then most users
                            console.log("Doing great! you passed the average of ".concat(chalk_1.default.greenBright("".concat(avgWpm, " WPM")), "\nBut still need to do better to pass ").concat(chalk_1.default.yellowBright(firstPlaceUserEmail), "'s record of ").concat(chalk_1.default.yellowBright("".concat(bestWpm, " WPM"))));
                        }
                        else {
                            // get some practice :) run it again.
                            console.log("Nice try! but you need to ".concat(chalk_1.default.redBright('warm up'), " to at least pass the average ").concat(chalk_1.default.yellowBright("".concat(avgWpm, " WPM")), "\nAnd have a lot to go to pass ").concat(chalk_1.default.yellowBright(firstPlaceUserEmail), "'s record of ").concat(chalk_1.default.yellowBright("".concat(bestWpm, " WPM"))));
                        }
                        return [4 /*yield*/, inquirer_1.default.prompt({
                                name: 'rematch',
                                message: 'Do you want to ply another game?',
                                choices: ['YES', 'NO'],
                                type: "list",
                            })];
                    case 4:
                        answer = _b.sent();
                        console.clear();
                        if (answer.rematch === 'NO') {
                            (0, _1.gameSelectorScreen)();
                        }
                        else {
                            (0, exports.initSpeedType)();
                        }
                        return [2 /*return*/];
                }
            });
        }); }, CONFIG.givenSeconds * 1000);
        setInterval(drawBox, 250);
        startTime = Date.now();
        started = true;
    }
    // The upper text which shows what to type
    var results = '';
    var interResults = '';
    // The lower text which shows what you typed
    var wrote = '';
    var started = false;
    var startTime = Date.now();
    var boxDrawIsLocked = false;
    // TODO explicit code / variable name standards
    var STATS = {
        corrects: 0,
        errors: 0,
        keypresses: 0,
        wpm: 0,
        accuracy: 0
    };
    // Skip waiting for the first char on debug
    if (CONFIG.debug) {
        start();
    }
    stdin.on('data', function (key) {
        if (!started) {
            start();
        }
        // Exit on ctrl-c
        if (key.toString() === SPECIAL.CTRL_C) {
            process.exit();
        }
        else if (key.toString() === SPECIAL.BACKSPACE) {
            // Do nothing on the beginning of the line
            if (cursor === 0) {
                return;
            }
            // Remove error from stats for a more fair calculation
            if (interResults.slice(-1) === 'x') {
                STATS.errors--;
            }
            else {
                STATS.corrects--;
            }
            STATS.keypresses--;
            wrote = wrote.slice(0, -1);
            interResults = interResults.slice(0, -1);
            // The last char with the colored background takes up 10 characters
            results = results.slice(0, -10);
            cursor--;
        }
        else if (cursor >= text.length) {
            text = nextText;
            nextText = lineGen.next().value;
            cursor = 0;
            wrote = '';
            results = '';
        }
        else if (!ALPHANUMERIC.test(key.toString())) {
            // Return on non-alphanumeric unicode characters
            // Regex generated with: http://kourge.net/projects/regexp-unicode-block
            return;
        }
        else {
            wrote += key;
            if (key.toString() === text[cursor]) {
                interResults += 'o';
                results += SPECIAL.GREEN_BG;
                STATS.corrects++;
            }
            else {
                interResults += 'x';
                results += SPECIAL.RED_BG;
                STATS.errors++;
            }
            results += text[cursor] + SPECIAL.RESET;
            cursor++;
            STATS.keypresses++;
        }
        drawBox();
    });
    var play = function () {
        stdin.setRawMode(true);
        stdin.resume();
        stdin.setEncoding('utf8');
        if (CONFIG.verbose) {
            printConfig(CONFIG);
        }
        console.log('\n  Start typing the words below:\n');
        text = lineGen.next().value;
        nextText = lineGen.next().value;
        process.stdout.write(boxTop() + '\n' + boxText(text) + '\n' + boxText(nextText) + '\n' + boxSeparator() + '\n│ ');
        cursor = 0;
    };
    play();
};
exports.initSpeedType = initSpeedType;
