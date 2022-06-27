import axios from 'axios';
import fs from 'fs';
import { apiBaseUrl } from './consts';
import { getPackageJson } from './services/read-package-json';
import { ACTION, UserData } from '../types';
import { homedir } from 'os';
import { closeTerminalIfNeeded } from '.';
import { echo, exit } from 'shelljs';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { userInfo } from 'os';

export const getLocalStorage = (): string => `${homedir()}/.ply/local-storage`;

export const getUserData = (): UserData => JSON.parse(fs.readFileSync(`${getLocalStorage()}/user.json`, 'utf8'))

export function shouldReportError(error: string): boolean {
  const type = error.split(' ').shift() as string;
  return ['error', 'failed'].includes(type)
}

export async function reportProcessDuration(
  startTime: number,
  action: ACTION | string
) {
  const durationInMs = Date.now() - startTime;
  const userData = getUserData();
  const packageJson = getPackageJson();

  await axios.post(`${apiBaseUrl}/project`, {
    userId: userData.id,
    name: packageJson.name,
    action,
    time: durationInMs,
  });

  echo(`\n${chalk.green(`Thanks for helping our dev flow be better.`)}`);
}

export async function reportErrors(errors: string[], action: string) {
  if (errors.length > 0) {
    const userData = getUserData();
    const packageJson = getPackageJson();

    const { data: reportErrorsResult } = await axios.post(
      `${apiBaseUrl}/error`,
      {
        bulk: errors,
        userId: userData.id,
        name: packageJson.name,
        action,
        dependencies: Array.from(
          new Set(
            Object.keys(packageJson.dependencies).concat(
              Object.keys(packageJson.devDependencies)
            )
          )
        ),
      }
    );

    echo(
      chalk.bgRedBright(
        `We have found some issues and here are our recommendation: ${JSON.stringify(
          reportErrorsResult.results.map((row: any) => row.solutions.reduce((acc: string, nextVal: string) => {
            if (acc !== '') {
              acc += ' | ';
            }
            acc += nextVal;
            return acc;
          }, '')
          ))}`
      )
    );
  }
}

export const shouldReFecthData = (timesetmp: number, timeInHours = 1) => {
  const currentTime = Date.now();
  const totalTime = Math.round((currentTime - timesetmp) / 1000) / 60 / 60;

  return totalTime > timeInHours;
};

export const onProcessEnd = async (
  startTime: number,
  action: ACTION,
  errors: string[]
) => {
  const userData = getUserData();
  const packageJson = getPackageJson();

  await reportProcessDuration(startTime, action);
  await reportErrors(errors, action);
  await sendProcessDoneSlackMessage(userData.id, packageJson.name, action);
  closeTerminalIfNeeded();
  exit(1);
};

export const sendProcessDoneSlackMessage = async (userId: string, projectName: string, action: ACTION) => {
  await axios.post(`${apiBaseUrl}/sendSlackDirectMessage`, {
    userId,
    message: `${action.toLowerCase()} process finished on ${projectName}`,
  });
}

export const saveData = async () => {
  const keys = ['music', 'feed', 'trivia'];
  const timestamp = Date.now();
  const userData = getUserData();
  const userId = userData.id || '';
  await Promise.all(
    keys.map(async (key) => {
      const { data } = await axios.get(`${apiBaseUrl}/${key}?userId=${userId}`);
      data.timestamp = timestamp;

      fs.writeFile(
        `${getLocalStorage()}/${key}.json`,
        JSON.stringify(data),
        (err) => {
          if (err) throw err;
        }
      );
    })
  );
};

export const signupUser = async () => {
  console.clear();
  console.log(`Welcome To The ${chalk.redBright(chalk.bold("</Sideshow>"))}\n`)
  const user = userInfo();
  const { userType } = await inquirer.prompt({
    name: "userType",
    message: "Are you signing up to a workspace or as a private user?",
    choices: ['Private', 'Workspace'],
    type: "list",
    prefix: '',
  });

  let userOrg: string = '';
  const isAnEmployee = userType === "Workspace";

  if (isAnEmployee) {
    const { organization } = await inquirer.prompt({
      name: "organization",
      message: "Please select a workspace to join",
      choices: ['WIX', 'Microsoft', 'Floatplane'],
      type: "list",
      prefix: '',

    });

    userOrg = organization;
  }

  const { userEmail } = await inquirer.prompt({
    name: "userEmail",
    message: `Please enter an email${isAnEmployee ? ` (Must be a valid ${userOrg} email)` : ''}:`,
    type: "input",
    prefix: '',
  });


  console.log(`\n${chalk.greenBright("Thank you for registering!")}`);
  if (isAnEmployee) {
    console.log(`Please note you will not be presented with ${userOrg} related content until you ${chalk.bold("verify your email.")}`);
  }

  const { data } = await axios.put(`${apiBaseUrl}/user`, {
    name: user.username,
    email: userEmail.trim(),
  });

  fs.writeFile(
    `${getLocalStorage()}/user.json`,
    JSON.stringify(data),
    function (err) {
      if (err) throw err;
    }
  );
  await new Promise(resolve => setTimeout(resolve, 250))
};


export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));