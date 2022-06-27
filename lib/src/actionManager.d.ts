/// <reference types="node" />
import { ChildProcess } from 'child_process';
import { ACTION } from "../types";
export default function ({ executionProcess, startTime, action }: {
    executionProcess: ChildProcess;
    startTime: number;
    action: ACTION;
}): Promise<void>;
