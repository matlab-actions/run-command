function plugins = getDefaultPlugins(pluginProviderData)

%   Copyright 2024-2025 The MathWorks, Inc.

arguments
    pluginProviderData (1,1) struct = struct();
end

if isMATLABReleaseOlderThan("R2026a")
    reportPlugin = buildframework.BuildSummaryPlugin();
else
    reportPlugin = buildframework.ParallelizableBuildSummaryPlugin();
end

plugins = [ ...
    matlab.buildtool.internal.getFactoryDefaultPlugins(pluginProviderData) ...
    buildframework.GitHubLogPlugin() ...
    reportPlugin ...
];
end
