import axios from 'axios';
import fs from 'fs';
import { apiBaseUrl } from './consts';
import { getPackageJson } from './src/services/read-package-json';
import { ACTION, UserData } from './types';
import { homedir } from 'os';
import { closeTerminalIfNeeded } from './src/controller';
import { echo, exit } from 'shelljs';
import chalk from 'chalk';

export const getLocalStorage = (): string => `${homedir()}/.ply/local-storage`;

export const getUserData = (): UserData =>
  JSON.parse(fs.readFileSync(`${getLocalStorage()}/user.json`, 'utf8'));

export function shouldReportError(error: string) {
  // TODO: find a better filters
  const containKeywords = ['error', 'failed'];
  const notContainKeywords = ['command failed with exit code'];

  return (
    containKeywords.some((keyword) =>
      error?.toLowerCase()?.includes?.(keyword)
    ) &&
    !notContainKeywords.some((keyword) =>
      error?.toLowerCase()?.includes(keyword)
    )
  );
}

export async function reportProcessDuration(
  startTime: number,
  action: ACTION | string
) {
  const durationInMs = Date.now() - startTime;
  const userData = getUserData();
  const packageJson = getPackageJson();

  await axios.post(`${apiBaseUrl}/project`, {
    userId: userData.id,
    name: packageJson.name,
    action,
    time: durationInMs,
  });

  echo(chalk.green(`Thanks for helping our dev flow better.`));
}

export async function reportErrors(errors: string[], action: string) {
  if (errors.length > 0) {
    const userData = getUserData();
    const packageJson = getPackageJson();

    const { data: reportErrorsResult } = await axios.post(
      `${apiBaseUrl}/error`,
      {
        bulk: errors,
        userId: userData.id,
        name: packageJson.name,
        action,
        dependencies: Array.from(
          new Set(
            Object.keys(packageJson.dependencies).concat(
              Object.keys(packageJson.devDependencies)
            )
          )
        ),
      }
    );

    echo(
      chalk.bgRedBright(
        `We have found some issues and here are our recommendation: ${JSON.stringify(
          reportErrorsResult.results.map((row:any) => row.solutions.reduce((acc:string, nextVal:string) => {
            if (acc !== '') {
              acc += ' | ';
            }
            acc += nextVal;
            return acc;
          }, '')
        ))}`
      )
    );
  }
}

export const shouldReFecthData = (timesetmp: number, timeInHours = 1) => {
  const currentTime = Date.now();
  const totalTime = Math.round((currentTime - timesetmp) / 1000) / 60 / 60;

  return totalTime > timeInHours;
};

export const onProcessEnd = async (
  startTime: number,
  action: ACTION,
  errors: string[]
) => {
  await reportProcessDuration(startTime, action);
  await reportErrors(errors, action);
  closeTerminalIfNeeded();
  exit(1);
};
