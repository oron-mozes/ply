import { homedir } from 'os';
import { ACTION } from '../types';

interface IGeneralConfig {
    rootDirectory: string;
    userFileName: string;
    serverUrl: string;
    configFileName:string;
}


export default ():IGeneralConfig => {
    return {
        rootDirectory: `${homedir()}/.ply/local-storage/`,
        userFileName: 'user.json',
        configFileName: 'config.json',
        serverUrl: 'http://localhost:3000/'
    }

}

export function getAction (cmd: string[]): ACTION {
    if (cmd.length === 1) {
        return ACTION.INSTALL;
      }

    const actionsMap: Map<ACTION, string[]> = new Map([]);
    actionsMap.set(ACTION.INSTALL, ['install', '-i', 'add', '-D']);
    actionsMap.set(ACTION.BUILD, ['build']);
    actionsMap.set(ACTION.TEST, ['test']);

    return Array.from(actionsMap.keys()).reduce((acc:ACTION, nextVal: ACTION) => {
        const list = actionsMap.get(nextVal);
        if(list?.some(type => cmd.includes(type))) {
            acc = nextVal;
        }
        return acc;
    } ,ACTION.GENERIC);
  }