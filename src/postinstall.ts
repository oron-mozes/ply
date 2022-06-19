#! /usr/bin/env node
//https://www.npmjs.com/package/shelljs
//https://www.npmjs.com/package/node-notifier
//https://www.npmjs.com/package/os

import { exec } from 'shelljs';
import { getLocalStorage } from './utils';
import fs from 'fs';

// exec("chmod a+x dist/src/**/*.js");
exec(`mkdir -p ${getLocalStorage()}`);

const saveUserFile = () => {
  fs.writeFileSync(
    `${getLocalStorage()}/user.json`,
    JSON.stringify({ "id": '' }),
  );
}

saveUserFile();
