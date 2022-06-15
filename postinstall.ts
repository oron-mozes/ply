#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { exec, echo } from 'shelljs';
import { hideBin } from 'yargs/helpers'
import path from 'path';
import fs from 'fs';
import { userInfo } from 'os';

const user = userInfo();

const axios = require("axios");
const argv = hideBin(process.argv);
const localStoragePath = path.resolve(
  __dirname.replace("/bin", ""),
  "local-storage"
);
exec(`mkdir ${localStoragePath}`);
echo(JSON.stringify(argv))




const signupUser = async () => {
  const { data } = await axios.put(
    "https://oronm8.wixsite.com/ply-cli/_functions/user",
    { name: user.username }
  );

  fs.writeFile(
    `${localStoragePath}/user.json`,
    JSON.stringify(data),
    function (err) {
      if (err) throw err;
    }
  );
}

const saveData = async () => {
  const { data: music } = await axios.get(
    "https://oronm8.wixsite.com/ply-cli/_functions/music"
  );
  const { data: feed } = await axios.get(
    "https://oronm8.wixsite.com/ply-cli/_functions/feed"
  );

  const timestamp = Date.now();
  music.timestamp = timestamp;
  feed.timestamp = timestamp;

  fs.writeFile(
    `${localStoragePath}/music.json`,
    JSON.stringify(music),
    function (err) {
      if (err) throw err;
    }
  );

  fs.writeFile(
    `${localStoragePath}/feed.json`,
    JSON.stringify(feed),
    function (err) {
      if (err) throw err;
    }
  );
}


signupUser();
saveData();