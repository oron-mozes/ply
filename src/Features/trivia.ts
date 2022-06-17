import { hideBin } from 'yargs/helpers';
import shell, { echo } from 'shelljs';
import path from 'path';

var isTerminalActive = false;

export default async function () {
  const argv = new Set(hideBin(process.argv));

  if ( argv.has('--p-game')) {
    const pathToGame = path.resolve(__dirname, 'type-game.js');
    shell.exec(`open -a Terminal ${pathToGame}`);
    shell.exec('osascript -e \'tell application "System Events" to keystroke "f" using {control down, command down}\'');
    isTerminalActive = true;
  }
}

export const closeTerminalIfNeeded = () => {
  if (isTerminalActive) {
    shell.exec('osascript -e \'tell application "Terminal" to close first window\'');
    // shell.exec('osascript -e \'tell application "iTerm" to tell current window to close current tab\' & exit');
    isTerminalActive = false;
  }
}