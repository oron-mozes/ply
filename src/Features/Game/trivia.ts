#! /usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import fs from "fs";
;
import { createSpinner } from "nanospinner";
import { echo, exec } from "shelljs";
import { apiBaseUrl } from "../../../consts";
import axios from "axios";
import { gameSelectorScreen } from ".";
import { getLocalStorage, getUserData, shouldReFecthData } from '../../utils';

type Question = {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
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
};

const emptyState = async () => {
  echo(`Is seems like there are no more questions for you, probably because you answered all of them.\nOur brilliant team is working on writing new ones.\n${chalk.greenBright('Thank you for your patience!')}\n`)
  await sleep();
};

const handleAnswer = async ({
  isCorrect,
  additionalInfo,
  additionalLink,
  successRate,
  failureRate,
}: {
  isCorrect: boolean;
  additionalInfo: string;
  additionalLink: string;
  successRate: number;
  failureRate: number;
}) => {
  const spinner = createSpinner("And the answer is....");
  const result = isCorrect ? "success" : "error";
  const text = isCorrect ? "That is CORRECT!" : `💀💀 WRONG 💀💀`;
  const answerRate = `This question was answered correctly ${successRate} times and incorrectly ${failureRate} times.`;
  const additionInfoMsg = additionalInfo
    ? `\n${chalk.blueBright("FYI")}\n\n${additionalInfo}`
    : "";
  const additionalLinkMsg = additionalLink
    ? `You can read more about it here: ${additionalLink}`
    : "";

  spinner[result]({ text });
  echo(answerRate);
  echo(additionInfoMsg);
  echo(additionalLinkMsg);

  return isCorrect;
};

const winningTitle = async () => {
  const msg = `WELL DONE`;

  figlet(msg, (_err, data) => {
    console.log(gradient.pastel.multiline(data));
  });
};

const askQuestion = async (data: Question) => {
  const {
    _id,
    question,
    options,
    correctAnswer,
    additionalInfo,
    additionalLink,
    successRate,
    failureRate,
  } = data;
  const answer = await inquirer.prompt({
    name: _id,
    message: question,
    choices: options,
    type: "list",
  });

  const isCorrect =
    options.findIndex((option) => option === answer[_id]) === correctAnswer;
  return handleAnswer({
    isCorrect,
    additionalInfo,
    additionalLink,
    successRate,
    failureRate,
  });
};

const reportSeenQuestion = async (
  allQuestions: Question[],
  seenQuestions: string[]
) => {
  const { id: userId } = getUserData();
  const bulk = allQuestions.reduce<{ itemId: string; correct: boolean }[]>(
    (acc, question) => {
      acc.push({
        itemId: question._id,
        correct: seenQuestions.some(
          (seenQuestion) => seenQuestion === question._id
        ),
      });
      return acc;
    },
    []
  );
  try {
    await axios.post(`${apiBaseUrl}/updateTrivia`, {
      userId,
      bulk: bulk,
    });
  } catch (error) { }
};

const writeNewSeenQuestion = (
  items: Question[],
  seenQuestions: string[],
  timestamp: number
) => {
  fs.writeFile(
    `${getLocalStorage()}/trivia.json`,
    JSON.stringify({ items: [...items], seen: [...seenQuestions], timestamp }),
    (err) => {
      if (err) throw err;
    }
  );
};

const reFetchDataIfNeeded = async (timestamp: number) => {
  if (shouldReFecthData(timestamp, 3)) {
    const { id: userId } = getUserData();
    const { data } = await axios.get(`${apiBaseUrl}/trivia?userId=${userId}`);
    data.seen = [];
    data.timestamp = Date.now();
    fs.writeFile(
      `${getLocalStorage()}/trivia.json`,
      JSON.stringify(data),
      (err) => {
        if (err) throw err;
      }
    );
  }
};

export const initTrivia = async () => {
  const {
    items: questionArray,
    seen: seenQuestions,
    timestamp,
  }: {
    items: Question[];
    seen: Question["_id"][];
    timestamp: number;
  } = JSON.parse(fs.readFileSync(`${getLocalStorage()}/trivia.json`, "utf-8"));
  const newSeenQuestions = seenQuestions ?? [];
  const notSeenYetQuestion = questionArray.filter(
    (question) =>
      !newSeenQuestions.some(
        (seenQuestionId) => seenQuestionId === question._id
      )
  );
  exec("clear");
  if (notSeenYetQuestion.length === 0) {
    await emptyState();
  } else {
    await welcome();
    for await (const question of notSeenYetQuestion) {
      const answer = await askQuestion(question);
      if (answer) {
        newSeenQuestions.push(question._id);
      }
    }
    await winningTitle();
    await reportSeenQuestion(notSeenYetQuestion, newSeenQuestions);
    writeNewSeenQuestion(questionArray, newSeenQuestions, timestamp);
  }
  reFetchDataIfNeeded(timestamp);
  gameSelectorScreen();
};
