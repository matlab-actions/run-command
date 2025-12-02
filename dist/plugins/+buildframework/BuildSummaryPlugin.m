classdef BuildSummaryPlugin < matlab.buildtool.plugins.BuildRunnerPlugin

%   Copyright 2024-25 The MathWorks, Inc.

    properties (Access=private)
        TaskDetails = {};
    end

    methods (Access=protected)
        function runTaskGraph(plugin, pluginData)
            runTaskGraph@matlab.buildtool.plugins.BuildRunnerPlugin(plugin, pluginData);

            [fID, msg] = fopen(fullfile(getenv("RUNNER_TEMP") ,"buildSummary" + getenv("GITHUB_RUN_ID") + ".json"), "w");
            if fID == -1
                warning("buildframework:BuildSummaryPlugin:UnableToOpenFile","Unable to open a file required to create the MATLAB build summary table: %s", msg);
            else
                closeFile = onCleanup(@()fclose(fID));
                s = jsonencode(plugin.TaskDetails);
                fprintf(fID, "%s",s);
            end
        end

        function runTask(plugin, pluginData)
            runTask@matlab.buildtool.plugins.BuildRunnerPlugin(plugin, pluginData);

            taskDetail = getCommonTaskDetail(pluginData);
            plugin.TaskDetails = [plugin.TaskDetails, taskDetail];
        end

        function skipTask(plugin, pluginData)
            skipTask@matlab.buildtool.plugins.BuildRunnerPlugin(plugin, pluginData);

            taskDetail = getCommonTaskDetail(pluginData);
            taskDetail.skipReason = pluginData.SkipReason;
            plugin.TaskDetails = [plugin.TaskDetails, taskDetail];
        end
    end
end

function taskDetail = getCommonTaskDetail(pluginData)
    taskDetail = struct();
    taskDetail.name = pluginData.TaskResults.Name;
    taskDetail.description = pluginData.TaskGraph.Tasks.Description;
    taskDetail.failed = pluginData.TaskResults.Failed;
    taskDetail.skipped = pluginData.TaskResults.Skipped;
    taskDetail.duration = string(pluginData.TaskResults.Duration);
end