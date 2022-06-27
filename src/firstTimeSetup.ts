#! /usr/bin/env node

import { exec } from 'shelljs';
import fs from 'fs';
import config from './config';
import chalk from 'chalk'
import axios from 'axios';
import { type as osType, arch, hostname } from 'os';
import inquirer from 'inquirer';
import { IModuleConfig } from './plyConfig';

exec("chmod a+x lib/src/**/*.js")

let started = false;
export async function saveUserFile() {
  if(started) {
    return;
  }
  started = true;
  const { rootDirectory, userFileName, serverUrl, configFileName } = config();

  const { email } = await inquirer.prompt({
    name: "email",
    message: `${chalk.blue("Congrats and hope you will like \"ply-cli\".")}
${chalk.green("This message appears only because this is the first time you used the \"ply\" command.\nBecacuse this is your first time we would like to get some information in order to create the best service for you. In order to sign you up we need to know what is your email?")}`,
    validate: function (input:string) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input)
    },
    type: 'input',
    prefix: ''
  })

  const { placeOfWork } = await inquirer.prompt({
    name: "placeOfWork",
    message: chalk.yellow("If you can tell us where you work that would be great. We would use that to sync your workflow with your colleagues?"),
    type: 'input',
    prefix: '',
    transformer: function (input) {
      return input.toLowerCase();
    }
  });
  const { sound } = await inquirer.prompt({
    name: "sound",
    message: chalk.magenta("We use notification for communication. Can we use sound?"),
    type: 'confirm',
    prefix: ''
  });

  const { data } = await axios.put(`${serverUrl}user`, { email, metadata: { placeOfWork, osType, deviceID: `${arch()}.${osType}|${email}` }, config: { sound } })
  const setupPly: IModuleConfig = { sound, ambianceSound: false }

  await Promise.all([
    fs.writeFileSync(
      `${rootDirectory}${userFileName}`,
      JSON.stringify({ "id": data.id }),
    ), fs.writeFileSync(
      `${rootDirectory}${configFileName}`,
      JSON.stringify(setupPly)
    )]);
}


