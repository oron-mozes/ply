#! /usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import fs from 'fs';
import { getLocalStorage } from "../../../utils";
import { createSpinner } from "nanospinner";
import { echo, exec } from "shelljs";

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

const sleep = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

const welcome = async () => {
  const title = chalkAnimation.neon(`
        Let's Play Some Trivia\n
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

const handleAnswer = async (isCorrect: boolean, additionalInfo: string, additionalLink: string) => {
  const spinner = createSpinner("And the answer is....");
  const result = isCorrect ? "success" : "error";
  const text = isCorrect ? "That is CORRECT!" : `💀💀 WRONG 💀💀`;
  const additionInfoMsg = additionalInfo ? `\n${chalk.blueBright("FYI")}\n\n${additionalInfo}` : '';
  const additionalLinkMsg = additionalLink ? `You can read more about it here: ${additionalLink}` : '';

  spinner[result]({ text });
  echo(additionInfoMsg);
  echo(additionalLinkMsg);
}

const winningTitle = async () => {
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

  const isCorrect = options.findIndex(option => option === answer[_id]) === currectAnswer;
  return handleAnswer(isCorrect, additionalInfo, additionalLink);
};

export const initTrivia = async () => {
  const { items: questionArray }: { items: Question[] } = JSON.parse(fs.readFileSync(`${getLocalStorage()}/trivia.json`, 'utf-8'))

  exec("clear");

  await welcome();
  for await (const question of questionArray) {
    await askQuestion(question);
  }
  await winningTitle();
};
