classdef TestResultsSummaryPlugin < matlab.unittest.plugins.TestRunnerPlugin & ...
        matlab.unittest.plugins.Parallelizable
    % Copyright 2025-26 The MathWorks, Inc.

    methods
        function tf = supportsParallelThreadPool_(~)
            tf = true;
        end
    end

    methods (Access=protected)
        function reportFinalizedSuite(plugin, pluginData)
            % Invoke the superclass method
            reportFinalizedSuite@matlab.unittest.plugins.TestRunnerPlugin(plugin, pluginData);

            % Collecting and writing the results is best-effort: any failure
            % here must only surface as a warning so that the plugin never
            % blocks or fails the user's build.
            try
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

                % Write test results for this session to a unique file.
                timestamp = string(datetime('now', 'Format', 'yyyyMMdd_HHmmss_SSS'));
                [~, tempToken] = fileparts(tempname);
                tempToken = string(tempToken);
                uniqueToken = extractAfter(tempToken, max(strlength(tempToken) - 8, 0));
                testArtifactFile = fullfile(getenv("RUNNER_TEMP"), "matlabTestResults" + getenv("GITHUB_ACTION") + "_" + timestamp + "_" + uniqueToken + ".json");

                jsonTestResults = jsonencode(testDetails, "PrettyPrint", true);
                [fID, msg] = fopen(testArtifactFile, "w");
                if fID == -1
                    warning("testframework:TestResultsSummaryPlugin:UnableToOpenFile","Unable to open a file required to create the table of test results. (Cause: %s)", msg);
                else
                    closeFile = onCleanup(@()fclose(fID));
                    fprintf(fID, '%s', jsonTestResults);
                end
            catch e
                warning("testframework:TestResultsSummaryPlugin:UnableToReportResults","Unable to report test results in the job summary. (Cause: %s)", e.message);
            end
        end
    end
end