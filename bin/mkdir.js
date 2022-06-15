#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os
const { exec, echo } = require("shelljs");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const { notify } = require("node-notifier");
const user = require("os").userInfo();
const yargs = require("yargs");
const ytp = require("yt-play-cli");

const { hideBin } = require("yargs/helpers");
const argv = hideBin(process.argv);
const localStoragePath = path.resolve(
  __dirname.replace("/bin", ""),
  "local-storage"
);
exec(`mkdir ${localStoragePath}`);

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
