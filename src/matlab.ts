// Copyright 2020 The MathWorks, Inc.

import { promises as fs } from "fs";
import * as os from "os";
import * as path from "path";
import { v4 as uuid } from "uuid";
import * as script from "./script";

/**
 * Helper interface to represent a MATLAB script.
 */
export interface HelperScript {
    dir: string;
    command: string;
}

/**
 * Type of a function that executes a command on a runner and returns the error
 * code.
 */
export type ExecFn = (command: string, args?: string[]) => Promise<number>;

/**
 * Generate a MATLAB script in the temporary directory that runs a command in
 * the workspace.
 *
 * @param workspaceDir CI job workspace directory
 * @param command MATLAB command to run
 */
export async function generateScript(workspaceDir: string, command: string): Promise<HelperScript> {
    const scriptName = script.safeName(`command_${uuid()}`);

    const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "run_matlab_command-"));

    const scriptPath = path.join(temporaryDirectory, scriptName + ".m");
    await fs.writeFile(scriptPath, script.cdAndCall(workspaceDir, command), {
        encoding: "utf8",
    });

    return { dir: temporaryDirectory, command: scriptName };
}

/**
 * Run a HelperScript in MATLAB.
 *
 * Create the HelperScript using `generateScript`.
 *
 * @param hs HelperScript pointing to the script containing the command
 * @param platform Operating system of the runner (e.g., "win32" or "linux")
 * @param architecture Architecture of the runner (e.g., "x64")
 * @param fn ExecFn that will execute a command on the runner
 */
export async function runCommand(hs: HelperScript, platform: string, architecture: string, fn: ExecFn): Promise<void> {
    const rmcPath = getRunMATLABCommandScriptPath(platform, architecture);
    await fs.chmod(rmcPath, 0o777);

    const rmcArg = script.cdAndCall(hs.dir, hs.command);

    const exitCode = await fn(rmcPath, [rmcArg]);
    if (exitCode !== 0) {
        return Promise.reject(Error(`Exited with non-zero code ${exitCode}`));
    }
}

/**
 * Get the path of the script containing RunMATLABCommand for the host OS.
 *
 * @param platform Operating system of the runner (e.g., "win32" or "linux")
 * @param architecture Architecture of the runner (e.g., "x64")
*/
export function getRunMATLABCommandScriptPath(platform: string, architecture: string): string {
    if (architecture != "x64") {
        throw new Error(`This action is not supported on ${platform} runners using the ${architecture} architecture.`);
    }
    let ext;
    let platformDir;
    switch (platform) {
        case "win32":
            ext = ".exe";
            platformDir = "win64";
            break;
        case "darwin":
            ext = "";
            platformDir = "maci64";
            break;
        case "linux":
            ext = "";
            platformDir = "glnxa64";
            break;
        default:
            throw new Error(`This action is not supported on ${platform} runners using the ${architecture} architecture.`);
    }
    const rmcPath = path.join(__dirname, "bin", platformDir, `run-matlab-command${ext}`);
    return rmcPath;

}
