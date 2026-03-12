classdef ParallelizableBuildSummaryPlugin < matlab.buildtool.plugins.BuildRunnerPlugin

    %   Copyright 2025 The MathWorks, Inc.

    properties
        TempFolder
    end

    methods
        function plugin = ParallelizableBuildSummaryPlugin()
            tempRoot = getenv("RUNNER_TEMP");
            plugin.TempFolder = fullfile(tempRoot, "taskDetails");
        end
    end

    methods (Access=protected)
        function runBuild(plugin, pluginData)
            % Create temp folder
            mkdir(plugin.TempFolder);
            cleanup = onCleanup(@()rmdir(plugin.TempFolder, "s"));
 
            runBuild@matlab.buildtool.plugins.BuildRunnerPlugin(plugin, pluginData);

            % Construct task details
            taskDetails = {};
            fs = what(plugin.TempFolder).mat;
            for i = 1:numel(fs)
                f = fs{i};
                s = load(fullfile(plugin.TempFolder, f));
                taskDetails = [taskDetails s.taskDetail]; %#ok<AGROW>
            end

            % Write to file
            [fID, msg] = fopen(fullfile(getenv("RUNNER_TEMP"), "buildSummary" + getenv("GITHUB_RUN_ID") + ".json"), "w");
            if fID == -1
                warning("buildframework:BuildSummaryPlugin:UnableToOpenFile","Unable to open a file required to create the MATLAB build summary table: %s", msg);
            else
                closeFile = onCleanup(@()fclose(fID));
                s = jsonencode(taskDetails);
                fprintf(fID, "%s", s);
            end
        end

        function runTask(plugin, pluginData)
            runTask@matlab.buildtool.plugins.BuildRunnerPlugin(plugin, pluginData);

            name = fullfile(plugin.TempFolder, pluginData.Name + ".mat");
            taskDetail = getCommonTaskDetail(pluginData);
            save(name, "taskDetail");
        end

        function skipTask(plugin, pluginData)
            skipTask@matlab.buildtool.plugins.BuildRunnerPlugin(plugin, pluginData);

            name = fullfile(plugin.TempFolder, pluginData.Name + ".mat");
            taskDetail = getCommonTaskDetail(pluginData);
            taskDetail.skipReason = pluginData.SkipReason;
            save(name, "taskDetail");
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
