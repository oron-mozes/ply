import { homedir } from 'os';

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