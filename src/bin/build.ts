#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { ChildProcess } from 'child_process';
import { reportErrors, reportProcessDuration, shouldReportError } from '../../utils';
import { ACTION } from '../../types';
import shell, { echo, exit } from 'shelljs';
import { closeTerminalIfNeeded } from '../Features/trivia';
import { sendProcessEndMessage } from '../Features/slack';

export const buildFn = async ({ executionProcess, startTime }:
  {
    executionProcess: ChildProcess;
    startTime: number;
  }) => {

  let errors: string[] = [];
  executionProcess?.stderr?.on('data', (error) => {
    if (shouldReportError(error)) {
      errors.push(error);
    }
  })

  executionProcess.stdout?.once('end', async () => {
    await reportProcessDuration(startTime, ACTION.BUILD);
    await reportErrors(errors)
    await sendProcessEndMessage("dorch@wix.com", ACTION.BUILD);
    closeTerminalIfNeeded();
    exit(1);
  });
}