#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { echo, exec } from 'shelljs';
import { userInfo } from 'os';
import { apiBaseUrl } from './consts';
import { getLocalStorage, getUserData } from './utils';
import chalk from "chalk";
import fs from 'fs';
import inquirer from "inquirer";
import axios from 'axios';

const user = userInfo();

exec(`mkdir -p ${getLocalStorage()}`);

export const signupUser = async () => {
  if (fs.existsSync(`${getLocalStorage()}/user.json`)) return;

  console.clear();
  console.log(`Welcome To The ${chalk.redBright(chalk.bold("</Sideshow>"))}\n`)
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

const saveData = async () => {
  const keys = ['music', 'feed', 'trivia'];
  const timestamp = Date.now();
  const { id: userId } = getUserData();
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

// signupUser();
saveData();
