import axios from 'axios';
import fs from 'fs';
import { apiBaseUrl } from './consts';
import { getPackageJson } from './src/services/read-package-json';
import { ACTION, UserData } from './types';
import { homedir } from 'os';
import { closeTerminalIfNeeded } from './src/controller';
import { exit } from 'shelljs';

export const getLocalStorage = (): string => `${homedir()}/.ply/local-storage`;

export const getUserData = (): UserData => JSON.parse(fs.readFileSync(`${getLocalStorage()}/user.json`, 'utf8'));

export function shouldReportError(error: string) {
  // TODO: find a better filters
  const containKeywords = ['error', 'failed'];
  const notContainKeywords = ['command failed with exit code'];

  return (
    containKeywords.some(keyword => error?.toLowerCase()?.includes?.(keyword)) &&
    !notContainKeywords.some(keyword => error?.toLowerCase()?.includes(keyword))
  )
}

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
}


export async function reportErrors(errors: string[], action:string) {
  if (errors.length > 0) {
    const userData = getUserData();
    const packageJson = getPackageJson();

    const { data: reportErrorsResult } = await axios.put(`${apiBaseUrl}/error`,
      {
        bulk: errors,
        userId: userData.id,
        name: packageJson.name,
        action,
        dependencies: Array.from(new Set(Object.keys(packageJson.dependencies).concat(Object.keys(packageJson.devDependencies)))
      });

    console.log(JSON.stringify({ reportErrorsResult }))
  }
}

export const shouldReFecthData = (timesetmp: number, timeInHours = 1) => {
  const currentTime = Date.now();
  const totalTime = (Math.round((currentTime - timesetmp) / 1000) / 60) / 60;

  return totalTime > timeInHours;
}

export const onProcessEnd = async (startTime: number, action: ACTION, errors: string[]) => {
  await reportProcessDuration(startTime, action);
  await reportErrors(errors, action)
  closeTerminalIfNeeded()
  exit(1);
}