import ytp from 'yt-play-cli';
import { hideBin } from 'yargs/helpers'

export default async function () {
  const argv = new Set(hideBin(process.argv));
  if (argv.has('-p') || argv.has('-play') || argv.has('--play')) {
    ytp.play("_grkKX2dKqc");
  }

}