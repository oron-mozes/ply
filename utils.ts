import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { apiBaseUrl } from './consts';
import { getPackageJson } from './src/services/read-package-json';
import { Action, UserData } from './types';

export async function reportProcessDuration(startTime: number, action: Action) {
  const localStoragePath = path.resolve(__dirname, '../../../.ply/local-storage')
  const durationInMs = Date.now() - startTime;
  const userData: UserData = JSON.parse(fs.readFileSync(`${localStoragePath}/user.json`, 'utf8'))
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
