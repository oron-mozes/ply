import ytp from 'yt-play-cli';
import { hideBin } from 'yargs/helpers';
import path from 'path';
import fs from 'fs';

const localStoragePath = path.resolve(__dirname, '../../../../../.ply/local-storage')

export default async function (duration:number = 1) {
  const argv = new Set(hideBin(process.argv));
  const list:{playlist:{videoId:string}[]} = JSON.parse(await fs.readFileSync(`${localStoragePath}/music.json`, 'utf-8'));
  // const relevantSongs = 
  // console.log(list);
  if (argv.has('-p') || argv.has('-play') || argv.has('--play')) {
    ytp.play(list.playlist[0].videoId);
  }
}