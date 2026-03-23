export default {
    testEnvironment: "node",
    collectCoverage: true,
    testMatch: ["**/*.test.ts"],
    transform: {
        "^.+\\.[jt]s$": [
            "ts-jest",
            {
                diagnostics: {
                    ignoreCodes: [151002],
                },
            },
        ],
    },
    transformIgnorePatterns: ["node_modules/(?!(@actions)/)"],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
        "^@actions/core$": "<rootDir>/node_modules/@actions/core/lib/core.js",
        "^@actions/exec$": "<rootDir>/node_modules/@actions/exec/lib/exec.js",
    },
};
