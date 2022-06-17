#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { ChildProcess } from 'child_process';
import { onProcessEnd, shouldReportError } from '../../utils';
import { ACTION } from '../../types';

export const addFn = async ({ executionProcess, startTime }:
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
    await onProcessEnd(startTime, ACTION.ADD, errors);
  });
}