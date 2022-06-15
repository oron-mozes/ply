#! /usr/bin/env node

import { echo, exec } from 'shelljs';
import { hideBin } from 'yargs/helpers'
import { buildFn } from '../bin/build';
import axios from 'axios';
import { apiBaseUrl } from '../consts';
import { getPackageJson } from './services/read-package-json';
import fs from 'fs';
import { getLocalStorage } from '../utils';
import { installFn } from '../bin/install';
import { ACTION } from '../types';
import { testFn } from '../bin/test';
import { addFn } from '../bin/add';
import { defaultFn } from '../bin/default';


(async function () {

  let action: ACTION = ACTION.BUILD;
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

    const { data: projectData } = await axios.get(`${apiBaseUrl}/project?name=${pkg.name}&userId=${user.id}&action=${action}`)

    // echo(JSON.stringify(argv))
    // if (executionCommand.toLocaleLowerCase().includes('yarn')) {
    //   action = interpretYarn(argv);
    // } else if (executionCommand.toLowerCase().includes('npm')) {
    //   action = interpretNPM(argv);
    // }

    switch (action) {
      case ACTION.BUILD:
        buildFn(executionProcess, startTime, projectData);
      //@ts-ignore
      case ACTION.INSTALL:
        installFn(executionProcess, startTime);
      //@ts-ignore
      case ACTION.TEST:
        testFn(executionProcess, startTime);
      //@ts-ignore
      case ACTION.ADD:
        addFn(executionProcess, startTime);
      default:
        defaultFn(executionProcess, startTime, executionCommand)
    }
  };

})();