#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { ChildProcess } from 'child_process';
import { exit } from 'shelljs';
import { reportErrors, reportProcessDuration, shouldReportError } from '../../utils';
import { closeTerminalIfNeeded } from '../Features/trivia';

export const genericFn = async ({ executionProcess, startTime, executionCommand }:
  {
    executionProcess: ChildProcess;
    startTime: number;
    executionCommand: string;
  }) => {

  let errors: string[] = [];
  executionProcess?.stderr?.on('data', (error) => {
    if (shouldReportError(error)) {
      errors.push(error);
    }
  })

  executionProcess.stdout?.once('end', async () => {
    await reportProcessDuration(startTime, executionCommand);
    await reportErrors(errors)
    closeTerminalIfNeeded();
    exit(1);
  });
}