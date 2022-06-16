#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { ChildProcess } from 'child_process';
import { reportErrors, reportProcessDuration } from '../../utils';
import { ACTION } from '../../types';
import { exit } from 'shelljs';

export const addFn = async ({ executionProcess, startTime }:
  {
    executionProcess: ChildProcess;
    startTime: number;
  }) => {
  let errors: string[] = [];
  executionProcess?.stderr?.on('data', (error) => {
    const filters = ['error', 'failed']; //TODO: find a better filters
    const shouldReportError = filters.some(filter => error?.toLowerCase()?.includes?.(filter));
    if (shouldReportError) {
      errors.push(error);
    }
  })

  executionProcess.stdout?.once('end', async () => {
    await reportProcessDuration(startTime, ACTION.ADD);
    await reportErrors(errors)
    exit(1);
  });
}