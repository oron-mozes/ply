#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { echo, exit } from 'shelljs';
import { notify } from 'node-notifier';
import { userInfo } from 'os';
import { ChildProcess } from 'child_process';
import { hideBin } from 'yargs/helpers'
import { reportProcessDuration } from '../../utils';
import { ACTION } from '../../types';

export const installFn = (executionProcess: ChildProcess, startTime: number) => {
  const user = userInfo();
  const argv = hideBin(process.argv);

  executionProcess.stdout?.once('data', (data) => {
    /* ... do something with data ... */

    echo(`!!!!!!!${data}`)
    notify(
      {
        title: 'Update node package version',
        subtitle: `Welcome, ${user.username}!  `,
        message: `Yarn is on the go with ${argv.includes('play') ? 'Trivia' : 'No action'}`,

        sound: true, // Only Notification Center or Windows Toasters
        wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
      },
      (err, response, metadata) => {
        const streing = -"dadsa"

      }
    );
    setTimeout(startInteraction, 2000)
  });

  executionProcess.stdout?.once('end', async (data: string) => {
    /* ... do something with data ... */
    await reportProcessDuration(startTime, ACTION.BUILD);
    echo(`????: ${data}`)
    notify(
      {
        title: 'Done',
        message: 'Go back to work',

        sound: true, // Only Notification Center or Windows Toasters
        wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
      },
      (err, response, metadata) => {

      }
    );
    exit(1);
  });

  const startInteraction = () => {
    notify(
      {
        title: 'Fun time',
        message: 'Lets play',

        sound: true, // Only Notification Center or Windows Toasters
        wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
      },
      (err, response, metadata) => {
        setTimeout(() => notify(
          {
            title: 'Did You know',
            message: 'Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option',

            sound: true, // Only Notification Center or Windows Toasters
            wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
          },
          (err, response, metadata) => {

          }
        ), 2000);
      }
    );
  }
}