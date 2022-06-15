#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { exit } from 'shelljs';
import { ChildProcess } from 'child_process';
import YT from '../src/Features/YT';
import { ACTION } from '../types';
import { reportProcessDuration } from '../utils';

export const defaultFn = (executionProcess: ChildProcess, startTime: number, executionCommand: string) => {
  YT();
  executionProcess.stdout?.once('data', (data) => {
    /* ... do something with data ... */
  });

  executionProcess.stdout?.once('end', async (data: string) => {
    await reportProcessDuration(startTime, executionCommand);
    exit(1);
  });
}