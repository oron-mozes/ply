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
const yt_play_cli_1 = __importDefault(require("yt-play-cli"));
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../../utils");
const helpers_1 = require("yargs/helpers");
function default_1(duration = 3) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        const argv = new Set((0, helpers_1.hideBin)(process.argv));
        if (argv.has('--p-play')) {
            const list = JSON.parse(yield fs_1.default.readFileSync(`${(0, utils_1.getLocalStorage)()}/music.json`, 'utf-8'));
            const relevantSongs = list.playlist.filter(item => item.duration <= (duration / 1000));
            const song = Math.round(Math.random() * relevantSongs.length);
            yt_play_cli_1.default.play((_b = (_a = relevantSongs[song]) === null || _a === void 0 ? void 0 : _a.videoId) !== null && _b !== void 0 ? _b : (_c = list.playlist[0]) === null || _c === void 0 ? void 0 : _c.videoId);
        }
    });
}
exports.default = default_1;
