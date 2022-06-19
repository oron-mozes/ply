#! /usr/bin/env node

import { echo, exec } from 'shelljs';
import { hideBin } from 'yargs/helpers'
import { buildFn } from './bin/build';
import axios from 'axios';
import { apiBaseUrl } from '../consts';
import { getPackageJson } from './services/read-package-json';
import { getUserData, signupUser, saveData } from '../utils';
import { installFn } from './bin/install';
import { ACTION, PACKAGE_MANAGER, ProjectData } from '../types';
import { testFn } from './bin/test';
import { addFn } from './bin/add';
import YT from './Features/YT';
import { genericFn } from './bin/generic';
import feed from './Features/feed';
import path from 'path';

let isTerminalActive = false;

(async function () {
  const user = getUserData();

  if (!user.id) {
    await signupUser();
    await saveData();
  }

  const argv = hideBin(process.argv);

  const getYarnAction = (cmd: string[]): ACTION => {
    if (cmd.length === 1) {
      return ACTION.INSTALL;
    }

    if (cmd.some(arg => arg.toLowerCase() === 'install')) {
      return ACTION.INSTALL;
    }
    if (cmd.some(arg => arg.toLowerCase() === 'add')) {
      return ACTION.ADD;
    }
    if (cmd.some(arg => arg.toLowerCase() === 'build')) {
      return ACTION.BUILD
    }

    if (cmd.some(arg => arg.toLowerCase() === 'test')) {
      return ACTION.TEST;
    }

    return ACTION.GENERIC;
  }

  const getNpmAction = (cmd: string[]): ACTION => {
    if (cmd.some(arg => arg.toLowerCase() === 'install')) {
      if (cmd.some(arg => arg.toLowerCase().includes('@'))) {
        return ACTION.ADD;
      } else {
        return ACTION.INSTALL;
      }
    }

    if (cmd.some(arg => arg === 'i')) {
      return ACTION.ADD;
    }

    if (cmd.some(arg => arg === "build")) {
      return ACTION.BUILD;
    }

    if (cmd.some(arg => arg === 'test')) {
      return ACTION.TEST;
    }

    return ACTION.GENERIC;
  }

  const getPackageManager = (cmd: string[]): PACKAGE_MANAGER => {
    if (cmd.some(arg => arg.toLowerCase().includes('yarn'))) return PACKAGE_MANAGER.YARN;
    if (cmd.some(arg => arg.toLowerCase().includes('npm'))) return PACKAGE_MANAGER.NPM;

    return PACKAGE_MANAGER.NONE;
  }

  const interpretCommand = (cmd: string[]): {
    internalFlags: string[],
    packageManager: PACKAGE_MANAGER,
    executionCommand: string,
    action: ACTION,
  } => {
    const internalFlags = cmd.filter(arg => arg.startsWith('--p-'));
    const executionCommand = cmd.filter(arg => !arg.startsWith('--p-')).join(" ");
    const packageManager = getPackageManager(cmd);
    let action;

    switch (packageManager) {
      case PACKAGE_MANAGER.NONE: {
        throw new Error('Package Manager Was Not Entered');
      }

      case PACKAGE_MANAGER.YARN: {
        action = getYarnAction(cmd);
        break;
      }

      case PACKAGE_MANAGER.NPM: {
        action = getNpmAction(cmd);
        break;
      }
    }

    return {
      internalFlags,
      executionCommand,
      packageManager,
      action,
    }
  }

  if (!argv.length) {
    // echo('Please enter a command')
  } else {
    const startTime: number = Date.now();
    const { internalFlags, executionCommand, packageManager, action } = interpretCommand(argv);
    const executionProcess = exec(executionCommand, { async: true });
    const pkg = getPackageJson();
    const user = getUserData();
    const { data: projectData }: { data: ProjectData } = await axios.get(`${apiBaseUrl}/project?name=${pkg.name}&userId=${user.id}&action=${action}`)

    YT(projectData.personalDuration ?? 3);
    feed();

    if (internalFlags.includes("--p-game")) {
      const pathToGame = path.resolve(__dirname, './Features/Game/index.js');
      exec(`open -a iTerm ${pathToGame}`);

      isTerminalActive = true;
    }

    switch (action) {
      case ACTION.BUILD:
        buildFn({ executionProcess, startTime });
        break;

      case ACTION.INSTALL:
        installFn({ executionProcess, startTime });
        break;

      case ACTION.TEST:
        testFn({ executionProcess, startTime });
        break;

      case ACTION.ADD:
        addFn({ executionProcess, startTime });
        break;

      case ACTION.GENERIC:
        genericFn({ executionProcess, startTime, executionCommand })
        break;
    }
  };
})();

export const closeTerminalIfNeeded = () => {
  if (isTerminalActive) {
    exec('osascript -e \'tell application "Terminal" to close first window\'');
    isTerminalActive = false;
  }
}