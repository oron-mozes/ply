#! /usr/bin/env node

import Snake from '@marcster/snake-js';

let snake = new Snake(10, 10, () => {

  let score = snake.score;

  // parse score to string
  snake.debug('' + score);
  
}, 200);