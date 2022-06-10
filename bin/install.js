#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os
const {exec, echo, } = require('shelljs');
const {notify} = require('node-notifier');
const user = require("os").userInfo();
const yargs = require("yargs");
const ytp = require( 'yt-play-cli' )

const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv._
echo(JSON.stringify(argv))
// // shell.exec('yarn build')
// exec('yarn build', function(code, stdout, stderr) {
// notify(
//   {
//     title: 'My awesome title',
//     message: 'Hello from node, Mr. User!',
   
//     sound: true, // Only Notification Center or Windows Toasters
//     wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
//   },
//   function (err, response, metadata) {
  
//   }
// );
// });

ytp.play("Wkof3nPK--Y");

exec('snake', {async:true});
var child = exec('yarn build', {async:true});
child.stdout.once('data', function(data) {
  /* ... do something with data ... */

  echo(`!!!!!!!${data}`)
  notify(
    {
      title: 'Test title',
      subtitle: `Welcome, ${user.username}!  `,
      message: `Yarn is on the go with ${argv.includes('play') ? 'Trivia' : 'No action'}`,
     
      sound: true, // Only Notification Center or Windows Toasters
      wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    },
    function (err, response, metadata) {
    
    }
  );
  setTimeout(startInteraction, 2000)
});

child.stdout.once('end', function(data) {
  /* ... do something with data ... */
  echo(`????: ${data}`)
  notify(
    {
      title: 'Done',
      message: 'Go back to work',
     
      sound: true, // Only Notification Center or Windows Toasters
      wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    },
    function (err, response, metadata) {
     
    }
  );
});

function startInteraction () {
  notify(
    {
      title: 'Fun time',
      message: 'Lets play',
     
      sound: true, // Only Notification Center or Windows Toasters
      wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
    },
    function (err, response, metadata) {
      setTimeout(() => notify(
        {
          title: 'Did You know',
          message: 'Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option',
          
          sound: true, // Only Notification Center or Windows Toasters
          wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
        },
        function (err, response, metadata) {
         
        }
      ), 2000);
    }
  );
  
}