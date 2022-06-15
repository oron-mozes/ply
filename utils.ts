import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { apiBaseUrl } from './consts';
import { getPackageJson } from './src/services/read-package-json';
import { ACTION, UserData } from './types';
import { homedir } from 'os';

export const getLocalStorage = (): string => `${homedir()}/.ply/local-storage`;

export async function reportProcessDuration(startTime: number, action: ACTION | string) {
  const durationInMs = Date.now() - startTime;
  const userData: UserData = JSON.parse(fs.readFileSync(`${getLocalStorage()}/user.json`, 'utf8'))
  const packageJson = getPackageJson();

  const { data } = await axios.post(`${apiBaseUrl}/project`,
    {
      userId: userData.id,
      name: packageJson.name,
      action,
      time: durationInMs
    }
  );

  console.log({ data })
}
