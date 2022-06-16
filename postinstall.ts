#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { exec } from 'shelljs';
import fs from 'fs';
import { userInfo } from 'os';
import { apiBaseUrl } from './consts';
import { getLocalStorage } from './utils';
import readline from 'readline';

const user = userInfo();
const axios = require('axios');

exec(`mkdir -p ${getLocalStorage()}`);

const signupUser = async () => {
  if (!fs.existsSync(`${getLocalStorage()}/user.json`)) {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('What is your email? ', async function (answer) {
      console.log('Thank you for registering for our ply cli:', answer);
      const { data } = await axios.put(`${apiBaseUrl}/user`, {
        name: user.username,
        email: answer.trim(),
      });

      fs.writeFile(
        `${getLocalStorage()}/user.json`,
        JSON.stringify(data),
        function (err) {
          if (err) throw err;
        }
      );
      rl.close();
    });
  }
};

const saveData = async () => {
  const keys = ['music', 'feed'];
  const timestamp = Date.now();
  await Promise.all(
    keys.map(async (key) => {
      const { data } = await axios.get(`${apiBaseUrl}/${key}`);

      data.timestamp = timestamp;

      fs.writeFile(
        `${getLocalStorage()}/${key}.json`,
        JSON.stringify(data),
        (err) => {
          if (err) throw err;
        }
      );
    })
  );
};

signupUser();
saveData();
