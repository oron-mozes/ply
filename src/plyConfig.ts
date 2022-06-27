#! /usr/bin/env node

import fs from 'fs';
import chalk from 'chalk'
import inquirer from 'inquirer';
import config from './config';

export interface IModuleConfig {
  sound: boolean;
  ambianceSound: boolean
}

let started = false;
export async function setupPly() {
  if (started) {
    return;
  }
  started = true;
  const { rootDirectory, configFileName } = config();

  console.log(chalk.blue("Nice to see you again, lets go over your configuration"));


  const { sound } = await inquirer.prompt({
    name: "sound",
    message: chalk.magenta("We use notification for communication. Can we use sound?"),
    type: 'confirm',
    prefix: ''
  });

  const { ambianceSound } = await inquirer.prompt({
    name: "ambianceSound",
    message: chalk.magenta("Would you like us to play some music while you wait for your process to be over?"),
    type: 'confirm',
    prefix: ''
  });
  const data: IModuleConfig = { sound, ambianceSound }
  await Promise.all([
    fs.writeFileSync(
      `${rootDirectory}${configFileName}`,
      JSON.stringify(data)
    )]);
}


