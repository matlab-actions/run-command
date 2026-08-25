classdef GitHubLogPlugin < matlab.buildtool.plugins.BuildRunnerPlugin

%   Copyright 2024-25 The MathWorks, Inc.

    methods (Access=protected)

        function runTask(plugin, pluginData)
           % Add Github workflow command for grouping the tasks
           disp("::group::" + pluginData.TaskResults.Name);

           runTask@matlab.buildtool.plugins.BuildRunnerPlugin(plugin, pluginData);

           % Add Github workflow command ::error:: if the task is failed
           if pluginData.TaskResults.Failed
              disp("::error::" + pluginData.TaskResults.Name + " task failed");
           end

           % Complete the group command
           disp("::endgroup::");
        end
    end
 end