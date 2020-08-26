// Copyright 2020 The MathWorks, Inc.

import * as core from "@actions/core";
import * as matlab from "./matlab";

export async function run() {
    const workspaceDir = process.cwd();
    const command = core.getInput("command");

    await matlab.runCommand(workspaceDir, command);
}

run().catch((e) => {
    core.setFailed(e);
});
