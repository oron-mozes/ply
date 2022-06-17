#! /usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import figlet from "figlet";
import { echo, exec } from "shelljs";
import fs from 'fs';
import { getLocalStorage } from "../../utils";

type Question = {
  _id: string;
  question: string;
  options: string[];
  currectAnswer: number;
  successRate: number;
  failureRate: number;
  additionalInfo: string;
  additionalLink: string;
};

//A helper function to show the animation using a timeout
//with a default of 4 seconds as JS does not allow a
//Promise-based timeout
const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
  const title = chalkAnimation.neon(`
        Who wants to be a ReactJS Millionaire? \n
    `);
  await sleep();
  title.stop();

  console.log(`
                            ${chalk.blue("INSTRUCTIONS")}
        ==============================================================
        ${chalk.green(
    "You need to get all answers correct"
  )} to get to the final prize.
        ${chalk.red("If you get any question wrong")}, you lose...
    `);
}

async function handleAnswer(isCorrect: boolean, additionalInfo: string, additionalLink: string) {
  const spinner = createSpinner("And the answer is....");
  const result = isCorrect ? "success" : "error";
  const text = isCorrect ? "That is CORRECT!" : `💀💀 WRONG 💀💀`;
  const additionalLinkMsg = additionalLink ? `You can read more about it here: ${additionalLink}` : '';

  spinner[result]({ text });
  echo(additionalInfo || '');
  echo(additionalLinkMsg);
}

async function winningTitle() {
  const msg = `WELL DONE`;

  figlet(msg, (_err, data) => {
    console.log(gradient.pastel.multiline(data));
  });
}

const askQuestion = async (data: Question) => {
  const { _id, question, options, currectAnswer, additionalInfo, additionalLink } = data;
  const answer = await inquirer.prompt({
    name: _id,
    message: question,
    choices: options,
    type: "list",
  });

  //answer = {"_id": "selected answer"}

  const isCorrect = options.findIndex(option => option === answer[_id]) === currectAnswer;
  return handleAnswer(isCorrect, additionalInfo, additionalLink);
};

const initTrivia = async () => {
  const { items: questionArray }: { items: Question[] } = JSON.parse(fs.readFileSync(`${getLocalStorage()}/trivia.json`, 'utf-8'))

  exec("clear");

  await welcome();
  for await (const question of questionArray) {
    await askQuestion(question);
  }
  await winningTitle();
};

initTrivia();
