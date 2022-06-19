import { hideBin } from 'yargs/helpers';
import fs from 'fs';
import { getLocalStorage, getUserData, shouldReFecthData } from '../../utils';
import { notify } from 'node-notifier';
import axios from 'axios';
import { apiBaseUrl } from '../../consts';

export default async function () {
  const argv = new Set(hideBin(process.argv));
  const feed: {
    timestamp: number;
    seen?: string[];
    items: {
      id: string;
      description: string;
      icon: string;
      image: string;
      title: string;
      externalLink?: string;
    }[];
  } = JSON.parse(
    await fs.readFileSync(`${getLocalStorage()}/feed.json`, 'utf-8')
  );

  const { id } = getUserData();

  const seen: string[] = [];
  let called = false;
  const killFeed = async () => {
    if (called) {
      return;
    }

    const refetchData = shouldReFecthData(feed.timestamp, 3);

    called = true;
    if (refetchData) {
      await axios.post(`${apiBaseUrl}/updateFeed`, {
        items: seen.concat(feed.seen ?? []),
        userId: id,
      });
      const { data } = await axios.get(`${apiBaseUrl}/feed`);

      data.timestamp = Date.now();
      data.seen = [];
      fs.writeFile(
        `${getLocalStorage()}/feed.json`,
        JSON.stringify(data),
        (err) => {
          if (err) throw err;
        }
      );
    } else {
      fs.writeFile(
        `${getLocalStorage()}/feed.json`,
        JSON.stringify({ ...feed, seen: seen.concat(feed.seen ?? []) }),
        (err) => {
          if (err) throw err;
        }
      );
    }
  };
  if (argv.has('--p-feed')) {

    for (const feedItem of feed.items.filter(item => !feed.seen?.includes(item.id))) {
      await new Promise((resolve) => {
        seen.push(feedItem.id);
        notify(
          {
            title: feedItem.title,
            message: feedItem.description,
            icon: feedItem.icon,
            contentImage: feedItem.image,
            open: feedItem.externalLink,
            sound: true,
            wait: true,
          },
          (err, response, metadata) => { }
        );
        setTimeout(resolve, 2000);
      });
    }

    killFeed();
  }

  return killFeed;
}
