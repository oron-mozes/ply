#! /usr/bin/env node
import { ChildProcess } from 'child_process';
export declare const testFn: ({ executionProcess, startTime }: {
    executionProcess: ChildProcess;
    startTime: number;
}) => Promise<void>;
