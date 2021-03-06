import { ACTION } from '../types';
interface IGeneralConfig {
    rootDirectory: string;
    userFileName: string;
    serverUrl: string;
    configFileName: string;
}
declare const _default: () => IGeneralConfig;
export default _default;
export declare function getAction(cmd: string[]): ACTION;
