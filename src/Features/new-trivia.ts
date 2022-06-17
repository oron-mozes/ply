#! /usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import figlet from "figlet";
import { exec } from "shelljs";

// console.log(chalk.bgRed('hi mom'));
type Question = {
  name: string;
  message: string;
  choices: string[];
  correctAnswer: string;
};
const data: Question[] = [
  {
    name: "question_1",
    message: "What is ReactJS? \n",
    choices: [
      "A JavaScript Framework",
      "A JavaScript Library",
      "verb: act in response to something; respond in a particular way",
      "A Mark-up Language",
    ],
    correctAnswer: "A JavaScript Library",
  },
  {
    name: "question_2",
    message: "Who created React? \n",
    choices: ["Twitter", "Tesla", "Meta", "Thomas Edison"],
    correctAnswer: "Meta",
  },
];

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

async function handleAnswer(isCorrect: boolean) {
  const spinner = createSpinner("And the answer is....");
  if (isCorrect) {
    spinner.success({ text: `That is CORRECT!` });
  } else {
    spinner.error({ text: `💀💀 WRONG 💀💀` });
  }
}

async function winningTitle() {
  console.clear();
  const msg = `WELL DONE`;

  figlet(msg, (_err, data) => {
    console.log(gradient.pastel.multiline(data));
  });
}

const askQuestion = async (question: Question) => {
  const answer = await inquirer.prompt({
    ...question,
    type: "list",
  });

  return handleAnswer(answer[question.name] == question.correctAnswer);
};

const initTrivia = async () => {
  exec("clear");
  await welcome();
  for await (const question of data) {
    await askQuestion(question);
  }
  await winningTitle();
};

initTrivia();
