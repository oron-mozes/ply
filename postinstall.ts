#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { echo, exec } from 'shelljs';
import { userInfo } from 'os';
import { apiBaseUrl } from './consts';
import { getLocalStorage, getUserData } from './utils';
import fs from 'fs';
import axios from 'axios';
import readline from 'readline';


const user = userInfo();

exec(`mkdir -p ${getLocalStorage()}`);

const signupUser = () => {
 
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
  


const saveData = async () => {
  const keys = ['music', 'feed', 'trivia'];
  const timestamp = Date.now();
  const { id: userId } = getUserData();
  await Promise.all(
    keys.map(async (key) => {
      const { data } = await axios.get(`${apiBaseUrl}/${key}?userId=${userId}`);
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
