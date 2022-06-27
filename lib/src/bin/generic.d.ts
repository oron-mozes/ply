#! /usr/bin/env node
import { ChildProcess } from 'child_process';
export declare const genericFn: ({ executionProcess, startTime, executionCommand }: {
    executionProcess: ChildProcess;
    startTime: number;
    executionCommand: string;
}) => Promise<void>;
