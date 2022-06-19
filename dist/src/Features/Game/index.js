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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameSelectorScreen = void 0;
const shelljs_1 = require("shelljs");
const inquirer_1 = __importDefault(require("inquirer"));
const snake_1 = require("./snake");
const trivia_1 = require("./trivia");
const speedType_1 = require("./speedType");
const gameSelectorScreen = () => __awaiter(void 0, void 0, void 0, function* () {
    const answer = yield inquirer_1.default.prompt({
        name: "gameSelector",
        message: "Welcome To The </Sideshow>\nWhat are you waiting for?\n",
        choices: [
            "Trivia",
            "Speed Type",
        ],
        type: "list",
        prefix: '',
    });
    (0, shelljs_1.exec)("clear");
    switch (answer.gameSelector) {
        case "Snake": {
            (0, snake_1.initSnake)();
            break;
        }
        case "Trivia": {
            yield (0, trivia_1.initTrivia)();
            break;
        }
        case "Speed Type": {
            (0, speedType_1.initSpeedType)();
            break;
        }
    }
});
exports.gameSelectorScreen = gameSelectorScreen;
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        // exec('osascript -e \'tell application "System Events" to keystroke "f" using {control down, command down}\'');
        (0, shelljs_1.exec)("clear");
        (0, exports.gameSelectorScreen)();
    });
})();
