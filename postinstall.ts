#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { exec, echo } from 'shelljs';
import path from 'path';
import fs from 'fs';
import { userInfo } from 'os';
const user = userInfo();
const axios = require("axios");
const localStoragePath = path.resolve(__dirname, '../../../.ply/local-storage')
exec(`mkdir -p ${localStoragePath}`);

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
  const keys = ["music", "feed"];
  const timestamp = Date.now();
  await Promise.all(keys.map(async (key) => {
    const { data } = await axios.get(
      `https://oronm8.wixsite.com/ply-cli/_functions/${key}`
    );

    data.timestamp = timestamp;

    fs.writeFile(
      `${localStoragePath}/${key}.json`,
      JSON.stringify(data),
      function (err) {
        if (err) throw err;
      }
    );
  }));
}


signupUser();
saveData();