"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var helpers_1 = require("yargs/helpers");
var fs_1 = __importDefault(require("fs"));
var utils_1 = require("../utils");
var node_notifier_1 = require("node-notifier");
var axios_1 = __importDefault(require("axios"));
var consts_1 = require("../consts");
function default_1() {
    return __awaiter(this, void 0, void 0, function () {
        var argv, feed, _a, _b, id, seen, called, killFeed, _loop_1, _i, _c, feedItem;
        var _this = this;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    argv = new Set((0, helpers_1.hideBin)(process.argv));
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, fs_1.default.readFileSync("".concat((0, utils_1.getLocalStorage)(), "/feed.json"), 'utf-8')];
                case 1:
                    feed = _b.apply(_a, [_d.sent()]);
                    id = (0, utils_1.getUserData)().id;
                    seen = [];
                    called = false;
                    killFeed = function () { return __awaiter(_this, void 0, void 0, function () {
                        var refetchData, data;
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    if (called) {
                                        return [2 /*return*/];
                                    }
                                    refetchData = (0, utils_1.shouldReFecthData)(feed.timestamp, 3);
                                    called = true;
                                    if (!refetchData) return [3 /*break*/, 3];
                                    return [4 /*yield*/, axios_1.default.post("".concat(consts_1.apiBaseUrl, "/updateFeed"), {
                                            items: seen.concat((_a = feed.seen) !== null && _a !== void 0 ? _a : []),
                                            userId: id,
                                        })];
                                case 1:
                                    _c.sent();
                                    return [4 /*yield*/, axios_1.default.get("".concat(consts_1.apiBaseUrl, "/feed"))];
                                case 2:
                                    data = (_c.sent()).data;
                                    data.timestamp = Date.now();
                                    data.seen = [];
                                    fs_1.default.writeFile("".concat((0, utils_1.getLocalStorage)(), "/feed.json"), JSON.stringify(data), function (err) {
                                        if (err)
                                            throw err;
                                    });
                                    return [3 /*break*/, 4];
                                case 3:
                                    fs_1.default.writeFile("".concat((0, utils_1.getLocalStorage)(), "/feed.json"), JSON.stringify(__assign(__assign({}, feed), { seen: seen.concat((_b = feed.seen) !== null && _b !== void 0 ? _b : []) })), function (err) {
                                        if (err)
                                            throw err;
                                    });
                                    _c.label = 4;
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); };
                    if (!argv.has('--p-feed')) return [3 /*break*/, 6];
                    _loop_1 = function (feedItem) {
                        return __generator(this, function (_e) {
                            switch (_e.label) {
                                case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                        seen.push(feedItem.id);
                                        (0, node_notifier_1.notify)({
                                            title: feedItem.title,
                                            message: feedItem.description,
                                            icon: feedItem.icon,
                                            contentImage: feedItem.image,
                                            open: feedItem.externalLink,
                                            sound: true,
                                            wait: true,
                                        }, function (err, response, metadata) { });
                                        setTimeout(resolve, 2000);
                                    })];
                                case 1:
                                    _e.sent();
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, _c = feed.items.filter(function (item) { var _a; return !((_a = feed.seen) === null || _a === void 0 ? void 0 : _a.includes(item.id)); });
                    _d.label = 2;
                case 2:
                    if (!(_i < _c.length)) return [3 /*break*/, 5];
                    feedItem = _c[_i];
                    return [5 /*yield**/, _loop_1(feedItem)];
                case 3:
                    _d.sent();
                    _d.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5:
                    killFeed();
                    _d.label = 6;
                case 6: return [2 /*return*/, killFeed];
            }
        });
    });
}
exports.default = default_1;
