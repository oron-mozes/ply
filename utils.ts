import axios from 'axios';
import fs from 'fs';
import { apiBaseUrl } from './consts';
import { getPackageJson } from './src/services/read-package-json';
import { ACTION, UserData } from './types';
import { homedir } from 'os';
import { ChildProcess } from 'child_process';
import { exit } from 'shelljs';

export const getLocalStorage = (): string => `${homedir()}/.ply/local-storage`;

export const getUserData = (): UserData => JSON.parse(fs.readFileSync(`${getLocalStorage()}/user.json`, 'utf8'));

export async function reportProcessDuration(startTime: number, action: ACTION | string) {
  const durationInMs = Date.now() - startTime;
  const userData = getUserData();
  const packageJson = getPackageJson();

  const { data } = await axios.post(`${apiBaseUrl}/project`,
    {
      userId: userData.id,
      name: packageJson.name,
      action,
      time: durationInMs
    }
  );

  console.log({ reportDurationResult: data })

  exit(1);
}


export async function reportErrors(errors: string[]) {
  const userData = getUserData();
  const packageJson = getPackageJson();
  const reportErrorsResult = await Promise.all(errors.map(async (err) => {
    const { data } = await axios.put(`${apiBaseUrl}/error`,
      {
        message: err,
        userId: userData.id,
        name: packageJson.name
      });

    return data;
  }));

  console.log({ reportErrorsResult })
}