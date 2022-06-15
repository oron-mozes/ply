import { hideBin } from 'yargs/helpers';
import {exec} from 'shelljs';
import path from 'path';

export default async function () {
  const argv = new Set(hideBin(process.argv));

  if ( argv.has('--p-game')) {
    const pathToGame = path.resolve(__dirname, 'game.js');
    const child = await exec(`open -a iTerm . ${pathToGame}`);
    
  }
}