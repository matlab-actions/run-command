classdef TestResultsSummaryPlugin < matlab.unittest.plugins.TestRunnerPlugin
    % Copyright 2025-26 The MathWorks, Inc.
    
    methods (Access=protected)
        function reportFinalizedSuite(plugin, pluginData)
            testDetails = struct([]);
            for idx = 1:numel(pluginData.TestResult)
                testDetails(idx).TestResult.Duration = pluginData.TestResult(idx).Duration;
                if isfield(pluginData.TestResult(idx).Details, "DiagnosticRecord") && ~isempty(pluginData.TestResult(idx).Details.DiagnosticRecord)
                    testDetails(idx).TestResult.Details.DiagnosticRecord.Event = pluginData.TestResult(idx).Details.DiagnosticRecord.Event;
                    testDetails(idx).TestResult.Details.DiagnosticRecord.Report = pluginData.TestResult(idx).Details.DiagnosticRecord.Report;
                else
                    testDetails(idx).TestResult.Details = struct();
                end
                testDetails(idx).TestResult.Name = pluginData.TestResult(idx).Name;
                testDetails(idx).TestResult.Passed = pluginData.TestResult(idx).Passed;
                testDetails(idx).TestResult.Failed = pluginData.TestResult(idx).Failed;
                testDetails(idx).TestResult.Incomplete = pluginData.TestResult(idx).Incomplete;
                testDetails(idx).BaseFolder = pluginData.TestSuite(idx).BaseFolder;
            end

            try
                jsonTestResults = jsonencode(testDetails, "PrettyPrint", true);
                testArtifactFile = fullfile(getenv("RUNNER_TEMP"), "matlabTestResults" + getenv("GITHUB_ACTION") + "_" + string(datetime('now', 'Format', 'yyyyMMdd_HHmmss_SSS')) + ".json");
                [fID, msg] = fopen(testArtifactFile, "w");
                if fID == -1
                    warning("testframework:TestResultsSummaryPlugin:UnableToOpenFile","Unable to open a file required to create the table of test results. (Cause: %s)", msg);
                else
                    closeFile = onCleanup(@()fclose(fID));
                    fprintf(fID, '%s', jsonTestResults);
                end
            catch e
                warning("testframework:TestResultsSummaryPlugin:UnableToJsonEncode","Unable to jsonencode test results data. (Cause: %s)", e.message);
            end

            % Invoke the superclass method
            reportFinalizedSuite@matlab.unittest.plugins.TestRunnerPlugin(plugin, pluginData);
        end
    end
end