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
const helpers_1 = require("yargs/helpers");
const fs_1 = __importDefault(require("fs"));
const utils_1 = require("../utils");
const node_notifier_1 = require("node-notifier");
const axios_1 = __importDefault(require("axios"));
const consts_1 = require("../../consts");
function default_1() {
    return __awaiter(this, void 0, void 0, function* () {
        const argv = new Set((0, helpers_1.hideBin)(process.argv));
        const feed = JSON.parse(yield fs_1.default.readFileSync(`${(0, utils_1.getLocalStorage)()}/feed.json`, 'utf-8'));
        const { id } = (0, utils_1.getUserData)();
        const seen = [];
        let called = false;
        const killFeed = () => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (called) {
                return;
            }
            const refetchData = (0, utils_1.shouldReFecthData)(feed.timestamp, 3);
            called = true;
            if (refetchData) {
                yield axios_1.default.post(`${consts_1.apiBaseUrl}/updateFeed`, {
                    items: seen.concat((_a = feed.seen) !== null && _a !== void 0 ? _a : []),
                    userId: id,
                });
                const { data } = yield axios_1.default.get(`${consts_1.apiBaseUrl}/feed`);
                data.timestamp = Date.now();
                data.seen = [];
                fs_1.default.writeFile(`${(0, utils_1.getLocalStorage)()}/feed.json`, JSON.stringify(data), (err) => {
                    if (err)
                        throw err;
                });
            }
            else {
                fs_1.default.writeFile(`${(0, utils_1.getLocalStorage)()}/feed.json`, JSON.stringify(Object.assign(Object.assign({}, feed), { seen: seen.concat((_b = feed.seen) !== null && _b !== void 0 ? _b : []) })), (err) => {
                    if (err)
                        throw err;
                });
            }
        });
        if (argv.has('--p-feed')) {
            for (const feedItem of feed.items.filter(item => { var _a; return !((_a = feed.seen) === null || _a === void 0 ? void 0 : _a.includes(item.id)); })) {
                yield new Promise((resolve) => {
                    seen.push(feedItem.id);
                    (0, node_notifier_1.notify)({
                        title: feedItem.title,
                        message: feedItem.description,
                        icon: feedItem.icon,
                        contentImage: feedItem.image,
                        open: feedItem.externalLink,
                        sound: true,
                        wait: true,
                    }, (err, response, metadata) => { });
                    setTimeout(resolve, 2000);
                });
            }
            killFeed();
        }
        return killFeed;
    });
}
exports.default = default_1;
