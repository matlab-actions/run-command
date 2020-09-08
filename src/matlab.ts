// Copyright 2020 The MathWorks, Inc.

import { promises as fs } from "fs";
import * as os from "os";
import * as path from "path";
import { v4 as uuid } from "uuid";
import * as script from "./script";

export interface HelperScript {
    dir: string;
    command: string;
}

export type ExecFn = (command: string, args?: string[]) => Promise<number>;

export async function generateScript(workspaceDir: string, command: string): Promise<HelperScript> {
    const scriptName = script.safeName(`command_${uuid()}`);

    const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "run_matlab_command-"));

    const scriptPath = path.join(temporaryDirectory, scriptName + ".m");
    await fs.writeFile(scriptPath, script.cdAndCall(workspaceDir, command), {
        encoding: "utf8",
    });

    return { dir: temporaryDirectory, command: scriptName };
}

export async function runCommand(hs: HelperScript, platform: string, fn: ExecFn): Promise<void> {
    const rmcPath = getRmcPath(platform);
    await fs.chmod(rmcPath, 0o777);

    const rmcArg = script.cdAndCall(hs.dir, hs.command);

    const exitCode = await fn(rmcPath, [rmcArg]);
    if (exitCode !== 0) {
        return Promise.reject(Error(`Exited with non-zero code ${exitCode}`));
    }
}

export function getRmcPath(platform: string): string {
    const ext = platform === "win32" ? "bat" : "sh";
    const rmcPath = path.join(__dirname, "bin", `run_matlab_command.${ext}`);
    return rmcPath;
}
