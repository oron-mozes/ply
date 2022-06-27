#! /usr/bin/env node
export interface IModuleConfig {
    sound: boolean;
    ambianceSound: boolean;
}
export declare function setupPly(): Promise<void>;
