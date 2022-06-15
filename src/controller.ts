#! /usr/bin/env node

import { echo, exec } from 'shelljs';
import { userInfo } from 'os';
import { hideBin } from 'yargs/helpers'
import { buildFn } from '../bin/build';

enum ACTION {
  INSTALL,
  BUILD,
  TEST,
  ADD,
  GENERIC,
}

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
  const executionCommand = argv.join(" ");
  const executionProcess = exec(executionCommand, { async: true })

  // echo(JSON.stringify(argv))
  // if (executionCommand.toLocaleLowerCase().includes('yarn')) {
  //   action = interpretYarn(argv);
  // } else if (executionCommand.toLowerCase().includes('npm')) {
  //   action = interpretNPM(argv);
  // }

  switch (action) {
    case ACTION.BUILD: {
      buildFn(executionProcess);
    }
  }
};
