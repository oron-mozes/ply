#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { ChildProcess } from 'child_process';
import { exit } from 'shelljs';
import { reportErrors, reportProcessDuration } from '../../utils';

export const genericFn = async (executionProcess: ChildProcess, startTime: number, executionCommand: string) => {

  let errors: string[] = [];
  executionProcess?.stderr?.on('data', async (error) => {
    const shouldReportError = error?.includes?.('Error');
    if (shouldReportError) {
      errors.push(error);
    }
  })

  executionProcess?.once('exit', async () => {
    console.log({exit: true, errors})
    await reportErrors(errors)
  });

  executionProcess.stdout?.once('end', async () => {
    await reportProcessDuration(startTime, executionCommand);
    /* ... do something with data ... */
    exit(1);
  });

  // executionProcess.stdout?.once('data', (data) => {
  //   /* ... do something with data ... */
  // });

  // executionProcess.stdout?.once('end', async (data: string) => {
  //   await reportProcessDuration(startTime, executionCommand);
  //   exit(1);
  // });
}