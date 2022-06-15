import ytp from 'yt-play-cli';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import { getLocalStorage } from '../../utils';


export default async function (duration:number = 1) {
  
  const argv = new Set(hideBin(process.argv));
  const list:{playlist:{videoId:string}[]} = JSON.parse(await fs.readFileSync(`${getLocalStorage()}/music.json`, 'utf-8'));
  // const relevantSongs = 
  // console.log(list);
  if (argv.has('-p') || argv.has('-play') || argv.has('--play')) {
    ytp.play(list.playlist[0].videoId);
  }
}