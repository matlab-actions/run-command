// Copyright 2020-2025 The MathWorks, Inc.

import * as core from "@actions/core";
import * as exec from "@actions/exec";
// TODO: update common-utils version when new version is released
import { matlab, testResultsSummary, buildSummary } from "common-utils";
import * as path from "path";

/**
 * Gather action inputs and then run action.
 */
async function run() {
    const platform = process.platform;
    const architecture = process.arch;
    const workspaceDir = process.cwd();

    const pluginsPath = path.join(__dirname, "plugins").replaceAll("'","''");
    const command = "addpath('"+ pluginsPath +"'); " + core.getInput("command");
    const startupOpts = core.getInput("startup-options").split(" ");

    const helperScript = await matlab.generateScript(workspaceDir, command);
    const execOpts = {
        env: {
            ...process.env,
            MW_BATCH_LICENSING_ONLINE:'true', // Remove when online batch licensing is the default
            "MW_MATLAB_BUILDTOOL_DEFAULT_PLUGINS_FCN_OVERRIDE": "buildframework.getDefaultPlugins",
        }
    };
    await matlab.runCommand(helperScript, platform, architecture, (cmd,args)=>exec.exec(cmd,args,execOpts), startupOpts).finally(() => {
        const runnerTemp = process.env.RUNNER_TEMP || '';
        const runId = process.env.GITHUB_RUN_ID || '';
        const actionName = process.env.GITHUB_ACTION || '';

        buildSummary.processAndDisplayBuildSummary(runnerTemp, runId, actionName);

        const testResultsData = testResultsSummary.getTestResults(runnerTemp, runId, workspaceDir);
        if(testResultsData) {
            testResultsSummary.writeSummary(testResultsData, actionName);
        }
    });
}

// Only run this action if it is invoked directly. Do not run if this node
// module is required by another action such as run-tests.
if (require.main === module) {
    run().catch((e) => {
        core.setFailed(e);
    });
}
