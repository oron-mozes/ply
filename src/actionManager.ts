import { shouldReportError, onProcessEnd } from "./utils";
import { ChildProcess } from 'child_process';
import { ACTION } from "../types";

export default async function({executionProcess, startTime, action}:{executionProcess:ChildProcess, startTime:number, action:ACTION}) {
    let errors: string[] = [];
  executionProcess?.stderr?.on('data', (error:any) => {
    if (shouldReportError(error)) {
      errors.push(error);
    }
  })

  executionProcess.stdout?.once('end', async () => {
    await onProcessEnd(startTime, action, errors);
  });

}