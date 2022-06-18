#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { ChildProcess } from 'child_process';
import { onProcessEnd, shouldReportError } from '../../utils';
import { ACTION } from '../../types';
import { echo } from 'shelljs';
import chalk from 'chalk';

export const installFn = async ({ executionProcess, startTime }:
  {
    executionProcess: ChildProcess;
    startTime: number;
  }) => {

  let errors: string[] = [];
  const errList:Set<string> = new Set([]);

  executionProcess?.stderr?.on('data', (error) => {
    const e = error.split(' ');
    errList.add(JSON.stringify({type: e.shift(), e: e.join(' ')}))
    //we can use that in the BE to label those type of issues as VPN issues
    // if(error.includes('http://npm.dev.wixpress.com/') && error.includes('ETIMEDOUT')) {
    //   echo(chalk.red('Seems that you are not connected to VPN'))
    // }

    if (shouldReportError(error)) {
      errors.push(error);
    }
  })
  executionProcess?.stderr?.on('error', (error) => {
    console.log('ERRR::::::::::::::::::::', error)
    // if (shouldReportError(error)) {
    //   errors.push(error);
    // }
  })

  executionProcess.stdout?.once('end', async () => {
    echo(chalk.redBright(Array.from(errList.values())))
    await onProcessEnd(startTime, ACTION.INSTALL, errors);
  });
}