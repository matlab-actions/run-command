// Copyright 2020 The MathWorks, Inc.

import * as core from "@actions/core";
import * as exec from "@actions/exec";
import * as matlab from "./matlab";

export { matlab };

/**
 * Gather action inputs and then run action.
 */
async function run() {
    const platform = process.platform;
    const architecture = process.arch;
    const workspaceDir = process.cwd();
    const command = core.getInput("command");

    const helperScript = await core.group("Generate script", async () => {
        const helperScript = await matlab.generateScript(workspaceDir, command);
        core.info("Successfully generated script");
        return helperScript;
    });

    await core.group("Run command", async () => {
        await matlab.runCommand(helperScript, platform, architecture, exec.exec);
    });
}

// Only run this action if it is invoked directly. Do not run if this node
// module is required by another action such as run-tests.
if (require.main === module) {
    run().catch((e) => {
        core.setFailed(e);
    });
}
