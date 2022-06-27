#! /usr/bin/env node

import { exec } from 'shelljs';
import { hideBin } from 'yargs/helpers'
import { ACTION } from '../types';
import { saveUserFile } from './postinstall';
import config, { getAction } from './config';
import { readdir } from 'node:fs/promises';
import actionManager from './actionManager';

let isTerminalActive = false;

(async function init() {
 
  const { rootDirectory, userFileName } = config();
  const files = await readdir(rootDirectory);

  if (!files.includes(userFileName)) {
    
    await saveUserFile();
  }

  const argv = hideBin(process.argv);
  if (!argv.length) {
    //means the dev called ply w/o any other command we need to show config / help function here
    return
  }


  const interpretCommand = (cmd: string[]): {
    internalFlags: string[],
    executionCommand: string,
    action: ACTION,
  } => {
    const internalFlags = cmd.filter(arg => arg.startsWith('--p-'));
    const executionCommand = cmd.filter(arg => !arg.startsWith('--p-')).join(" ");

    const action = getAction(cmd);

    return {
      internalFlags,
      executionCommand,
      action,
    }
  }


  const startTime: number = Date.now();
  const { executionCommand, action } = interpretCommand(argv);
  const executionProcess = exec(executionCommand, { async: true });
  actionManager({ executionProcess, startTime, action })

})();


export const closeTerminalIfNeeded = () => {
  if (isTerminalActive) {
    exec('osascript -e \'tell application "iTerm" to close first window\'');
    isTerminalActive = false;
  }
}