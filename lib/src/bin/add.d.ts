#! /usr/bin/env node
import { ChildProcess } from 'child_process';
export declare const addFn: ({ executionProcess, startTime }: {
    executionProcess: ChildProcess;
    startTime: number;
}) => Promise<void>;
