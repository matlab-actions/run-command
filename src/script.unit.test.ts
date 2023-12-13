// Copyright 2020-2023 The MathWorks, Inc.

import * as script from "./script";

describe("call generation", () => {
    it("ideally works", () => {
        // I know what your thinking
        const testName = "command_uuid_123";
        const testCommand = "disp('hello world')";
        const expectedString = `function command_uuid_123(folder)\ncd(folder);${testCommand}`;

        expect(script.cdAndCall(testName, testCommand)).toMatch(expectedString);
    });
});

describe("safe names", () => {
    it("turns dashes into underscores", () => {
        const testString = "__this-is-a-kebab---";
        const expectedString = "__this_is_a_kebab___";

        expect(script.safeName(testString)).toMatch(expectedString);
    });
});

describe("path to character vector", () => {
    it("duplicates single quotes", () => {
        // I know what your thinking
        const testString = String.raw`C:\Users\you\You're Documents`;
        const expectedString = String.raw`C:\Users\you\You''re Documents`;

        expect(script.pathToCharVec(testString)).toMatch(expectedString);
    });
});
