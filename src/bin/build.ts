#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import YT from '../Features/YT';
import { ChildProcess } from 'child_process';
import feed from '../Features/feed';
import trivia from '../Features/trivia';
import { reportErrors, reportProcessDuration } from '../../utils';
import { ACTION } from '../../types';
import { exit } from 'shelljs';

export const buildFn = async (executionProcess: ChildProcess, startTime: number, projectData: { name: string, averageDuration: number | null, personalDuration: number | null }) => {
  YT(projectData.personalDuration ?? 3);
  feed();
  trivia()

  executionProcess.stdout?.once('end', async () => {
    await reportProcessDuration(startTime, ACTION.BUILD);
    /* ... do something with data ... */
    exit(1);
  });


  let errors: string[] = [];
  executionProcess?.stderr?.on('data', async (error) => {
    const shouldReportError = error?.includes?.('Error'); //TODO: find a better filter
    if (shouldReportError) {
      errors.push(error);
    }
  })

  executionProcess?.once('exit', async () => {
    console.log({exit: true, errors})
    await reportErrors(errors)
  });

  // executionProcess.stdout?.once('data', (data) => {
  //   /* ... do something with data ... */

  //   notify(
  //     {
  //       title: 'Update node package version',
  //       subtitle: `Welcome, ${user.username}!  `,
  //       message: `Yarn is on the go with ${argv.includes('play') ? 'Trivia' : 'No action'}`,

  //       sound: true, // Only Notification Center or Windows Toasters
  //       wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
  //     },
  //     (err, response, metadata) => {
  //       const streing = -"dadsa"

  //     }
  //   );
  //   setTimeout(startInteraction, 2000)
  // });

  // executionProcess.stdout?.once('end', async (data: string) => {
  //   await reportProcessDuration(startTime, ACTION.BUILD);
  //   /* ... do something with data ... */
  //   notify(
  //     {
  //       title: 'Done',
  //       message: 'Go back to work',

  //       sound: true, // Only Notification Center or Windows Toasters
  //       wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
  //     },
  //     (err, response, metadata) => {

  //     }
  //   );
  //   exit(1);
  // });

  // const startInteraction = () => {
  //   notify(
  //     {
  //       title: 'Fun time',
  //       message: 'Lets play',

  //       sound: true, // Only Notification Center or Windows Toasters
  //       wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
  //     },
  //     (err, response, metadata) => {
  //       setTimeout(() => notify(
  //         {
  //           title: 'Did You know',
  //           message: 'Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option',

  //           sound: true, // Only Notification Center or Windows Toasters
  //           wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
  //         },
  //         (err, response, metadata) => {

  //         }
  //       ), 2000);
  //     }
  //   );
  // }
}