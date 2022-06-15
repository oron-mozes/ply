#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { exec, echo } from 'shelljs';
import { hideBin } from 'yargs/helpers'
import path from 'path';
import fs from 'fs';

const axios = require("axios");
const argv = hideBin(process.argv);
const localStoragePath = path.resolve(
  __dirname.replace("/bin", ""),
  "local-storage"
);
exec(`mkdir ${localStoragePath}`);
echo(JSON.stringify(argv))

saveData();

async function saveData() {
  const { data: music } = await axios.get(
    "https://oronm8.wixsite.com/ply-cli/_functions-dev/music"
  );

  music.timestamp = Date.now()

  fs.writeFile(
    `${localStoragePath}/music.json`,
    JSON.stringify(music),
    function (err) {
      if (err) throw err;
      console.log("Results Received");
    }
  );
}
