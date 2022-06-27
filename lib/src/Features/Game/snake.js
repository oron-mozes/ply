#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initSnake = void 0;
var snake_js_1 = __importDefault(require("@marcster/snake-js"));
var initSnake = function () {
    var snake = new snake_js_1.default(10, 10, function () {
        var score = snake.score;
        // parse score to string
        snake.debug('' + score);
    }, 200);
};
exports.initSnake = initSnake;
