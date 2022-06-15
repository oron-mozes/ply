#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { exec, echo, exit } from 'shelljs';
import { notify } from 'node-notifier';
import { userInfo } from 'os';
import { hideBin } from 'yargs/helpers'
import yargs from 'yargs';
import ytp from 'yt-play-cli';

const user = userInfo();
const argv = hideBin(process.argv);
echo(JSON.stringify(argv))

ytp.play("_grkKX2dKqc");

const child = exec('yarn build', { async: true });
child.stdout?.once('data', (data) => {
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

child.stdout?.once('end', (data: string) => {
  /* ... do something with data ... */
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