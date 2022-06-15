import ytp from 'yt-play-cli';
import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import { getLocalStorage } from '../../utils';


export default async function (duration:number = 3) {
  
  const argv = new Set(hideBin(process.argv));
  const list:{playlist:{videoId:string, duration: number}[]} = JSON.parse(await fs.readFileSync(`${getLocalStorage()}/music.json`, 'utf-8'));
  const relevantSongs = list.playlist.filter(item => item.duration <= duration);
  if (argv.has('-p') || argv.has('-play') || argv.has('--play')) {
    const song = Math.round(Math.random() * relevantSongs.length);
    ytp.play(relevantSongs[song]?.videoId ?? list.playlist[0]?.videoId);
  }
}