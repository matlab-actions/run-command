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
export declare function generateScript(workspaceDir: string, command: string): Promise<HelperScript>;
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
export declare function runCommand(hs: HelperScript, platform: string, architecture: string, fn: ExecFn, args?: string[]): Promise<void>;
/**
 * Get the path of the script containing RunMATLABCommand for the host OS.
 *
 * @param platform Operating system of the runner (e.g., "win32" or "linux")
 * @param architecture Architecture of the runner (e.g., "x64")
*/
export declare function getRunMATLABCommandScriptPath(platform: string, architecture: string): string;
