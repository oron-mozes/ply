#! /usr/bin/env node

import { echo, exec } from 'shelljs';
import { userInfo } from 'os';
import { hideBin } from 'yargs/helpers'
import { buildFn } from '../bin/build';
import axios from 'axios';
import { apiBaseUrl } from '../consts';
import { getPackageJson } from './services/read-package-json';
import fs from 'fs';
import { getLocalStorage } from '../utils';

enum ACTION {
  INSTALL,
  BUILD,
  TEST,
  ADD,
  GENERIC,
}
(async function () {
let action: ACTION = ACTION.BUILD;
const user = userInfo();
const argv = hideBin(process.argv);

// const interpretYarn = (cmd: string[]): ACTION => {

// }

// const interpretNPM = (cmd: string[]): ACTION => {

// }

if (!argv.length) {
  echo('Please enter a command')
} else {
  
  const executionCommand = argv.filter(arg => !['-p', '--play', '-play'].includes(arg)).join(" ");
  const startTime: number = Date.now();
  const executionProcess = exec(executionCommand, { async: true });
  const pkg = getPackageJson();
  const user = JSON.parse(await fs.readFileSync(`${getLocalStorage()}/user.json`, 'utf-8'));

  const {data: projectData} = await axios.get(`${apiBaseUrl}/project?name=${pkg.name}&userId=${user.id}&action=${action}`)
  
  // echo(JSON.stringify(argv))
  // if (executionCommand.toLocaleLowerCase().includes('yarn')) {
  //   action = interpretYarn(argv);
  // } else if (executionCommand.toLowerCase().includes('npm')) {
  //   action = interpretNPM(argv);
  // }

  switch (action) {
    case ACTION.BUILD: {
      buildFn(executionProcess, startTime, projectData);
    }
  }
};
})()