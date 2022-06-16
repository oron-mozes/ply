import { hideBin } from 'yargs/helpers';
import shell, { echo } from 'shelljs';
import path from 'path';

var isTerminalActive = false;

export default async function () {
  const argv = new Set(hideBin(process.argv));

  if ( argv.has('--p-game')) {
    const pathToGame = path.resolve(__dirname, 'game.js');
    shell.exec(`open -a iTerm  ${pathToGame}`);
    isTerminalActive = true;
  }
}

export const closeTerminalIfNeeded = () => {
  if (isTerminalActive) {
    shell.exec('osascript -e \'tell application "iTerm" to tell current window to close current tab\' & exit');
    isTerminalActive = false;
  }
}