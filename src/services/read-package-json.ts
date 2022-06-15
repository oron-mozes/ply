import {ShellString } from 'shelljs';

type packageJson = {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
}

export const getPackageJson = (): packageJson => {
    const givenShell = new ShellString('givenShell');
   return JSON.parse(givenShell.cat('package.json').replace('givenShell', ''));
}
