classdef TestResultsSummaryPluginService < matlab.buildtool.internal.services.ciplugins.CITestRunnerPluginService
    % Copyright 2025 The MathWorks, Inc.

    methods
        function plugins = providePlugins(~, ~)
            if strcmpi(getenv("MW_INPUT_GENERATE_SUMMARY"), "true")
                plugins = testframework.TestResultsSummaryPlugin();
            else
                plugins = matlab.unittest.plugins.TestRunnerPlugin.empty(1,0);
            end
        end
    end
end