// Copyright 2020-2023 The MathWorks, Inc.

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
    const startupOpts = core.getInput("startup-options").split(" ");

    const helperScript = await matlab.generateScript(workspaceDir, command);
    const execOpts = {
        // env: {...process.env, MW_BATCH_LICENSING_ONLINE:'true'}  // Disabled while we work out online licensing kinks
    };
    await matlab.runCommand(helperScript, platform, architecture, (cmd,args)=>exec.exec(cmd,args,execOpts), startupOpts);
}

// Only run this action if it is invoked directly. Do not run if this node
// module is required by another action such as run-tests.
if (require.main === module) {
    run().catch((e) => {
        core.setFailed(e);
    });
}
