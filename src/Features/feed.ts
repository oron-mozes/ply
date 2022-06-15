import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import { getLocalStorage } from '../../utils';
import { notify } from 'node-notifier';

export default async function () {
  const argv = new Set(hideBin(process.argv));
  
  if (argv.has('-feed') || argv.has('--feed')) {
    const feed:{timesetmp: number, items:{id: string, description:string,icon:string,image:string, title: string, externalLink?: string}[]} = JSON.parse(await fs.readFileSync(`${getLocalStorage()}/feed.json`, 'utf-8'));
    const seenIndex = new Set([]);
    //check if need to refetch / update the feed with more data
    for(const feedItem of feed.items) {
      notify(
        {
          title: feedItem.title,
          message:  feedItem.description,
          // icon: feedItem.icon,
          contentImage: feedItem.image,
          open: feedItem.externalLink,
          sound: true,
          wait: false 
        },
        (err, response, metadata) => {
          const streing = -"dadsa"
  
        }
      );
      await new Promise(resolved => {
        setTimeout(() => {
          resolved('')
        }, 3000)
      })
    }
    

  }
}