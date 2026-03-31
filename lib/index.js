// Copyright 2020-2025 The MathWorks, Inc.
import * as core from "@actions/core";
import * as exec from "@actions/exec";
import { matlab, testResultsSummary, buildSummary } from "common-utils";
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
        env: {
            ...process.env,
            MW_BATCH_LICENSING_ONLINE: 'true', // Remove when online batch licensing is the default
            "MW_MATLAB_BUILDTOOL_DEFAULT_PLUGINS_FCN_OVERRIDE": "buildframework.getDefaultPlugins",
        }
    };
    await matlab.runCommand(helperScript, platform, architecture, (cmd, args) => exec.exec(cmd, args, execOpts), startupOpts).finally(() => {
        const runnerTemp = process.env.RUNNER_TEMP || '';
        const runId = process.env.GITHUB_RUN_ID || '';
        const actionName = process.env.GITHUB_ACTION || '';
        buildSummary.processAndAddBuildSummary(runnerTemp, runId, actionName);
        testResultsSummary.processAndAddTestSummary(runnerTemp, runId, actionName, workspaceDir);
        core.summary.write();
    });
}
run().catch((e) => {
    core.setFailed(e);
});
//# sourceMappingURL=index.js.map