#! /usr/bin/env node

import { exec } from 'shelljs';
import inquirer from "inquirer";
import { initSnake } from './snake';
import { initTrivia } from './trivia';
import { initSpeedType } from './speedType';

export const gameSelectorScreen = async () => {
  const answer = await inquirer.prompt({
    name: "gameSelector",
    message: "Welcome To The </Sideshow>\nWhat are you waiting for?\n",
    choices: [
      "Snake",
      "Trivia",
      "Speed Type",
    ],
    type: "list",
    prefix: '',
  });

  exec("clear");

  switch (answer.gameSelector) {
    case "Snake": {
      initSnake();
      break;
    }

    case "Trivia": {
      await initTrivia();
      break;
    }

    case "Speed Type": {
      initSpeedType();
      break;
    }
  }
}

(async function () {
  // exec('osascript -e \'tell application "System Events" to keystroke "f" using {control down, command down}\'');
  exec("clear");
  gameSelectorScreen()
})()
