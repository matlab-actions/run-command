// Copyright 2020 The MathWorks, Inc.

import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import { v4 as uuid } from "uuid";
import * as script from "./script";

export type TempScript = { dir: string; name: string };

export async function runCommand(workspaceDir: string, command: string) {
    const tempScript = await core.group("Generate script", async () => {
        const tempScript = await generateScript(workspaceDir, command);
        core.info("Sucessfully generated script");
        return tempScript;
    });

    await core.group("Run command", async () => {
        const ext = process.platform === "win32" ? "bat" : "sh";
        const rmcPath = path.join(__dirname, "bin", `run_matlab_command.${ext}`);
        await fs.promises.chmod(rmcPath, 0o777);

        const rmcArg = script.cdAndCall(tempScript.dir, tempScript.name);

        const exitCode = await exec.exec(rmcPath, [rmcArg]);
        if (exitCode !== 0) {
            return Promise.reject(Error(`Exited with non-zero code ${exitCode}`));
        }
    });
}

export async function generateScript(workspaceDir: string, command: string): Promise<TempScript> {
    const scriptName = script.safeName(`command_${uuid()}`);

    const temporaryDirectory = await fs.promises.mkdtemp(
        path.join(os.tmpdir(), "run_matlab_command-")
    );

    const scriptPath = path.join(temporaryDirectory, scriptName + ".m");
    await fs.promises.writeFile(scriptPath, script.cdAndCall(workspaceDir, command), {
        encoding: "utf8",
    });

    return { dir: temporaryDirectory, name: scriptName };
}
