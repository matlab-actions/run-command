// Copyright 2020 The MathWorks, Inc.

import { promises as fs } from "fs";
import * as path from "path";
import * as matlab from "./matlab";

afterEach(() => {
    jest.resetAllMocks();
});

describe("script generation", () => {
    const mockPath = "/tmp/run-matlab-command-ABC123";
    const workspaceDir = "/home/sweet/home";
    const command = "disp('hello, world!');";

    const rejection = "yeah, no";

    it("properly generates a script", async () => {
        const mkdtemp = jest.spyOn(fs, "mkdtemp");
        const writeFile = jest.spyOn(fs, "writeFile");

        mkdtemp.mockResolvedValue(mockPath);
        writeFile.mockResolvedValue(undefined);

        const actual = matlab.generateScript(workspaceDir, command);
        await expect(actual).resolves.toBeDefined();
        expect(mkdtemp).toHaveBeenCalledTimes(1);
        expect(writeFile).toHaveBeenCalledTimes(1);
    });

    it("fails when the temporary directory cannot be made", async () => {
        const mkdtemp = jest.spyOn(fs, "mkdtemp");
        const writeFile = jest.spyOn(fs, "writeFile");

        mkdtemp.mockRejectedValue(rejection);
        writeFile.mockRejectedValue("this should not have been called");

        const actual = matlab.generateScript(workspaceDir, command);
        await expect(actual).rejects.toBeDefined();
        expect(mkdtemp).toHaveBeenCalledTimes(1);
        expect(writeFile).not.toHaveBeenCalled();
    });

    it("fails when there's an error writing to the file", async () => {
        const mkdtemp = jest.spyOn(fs, "mkdtemp");
        const writeFile = jest.spyOn(fs, "writeFile");

        mkdtemp.mockResolvedValue(mockPath);
        writeFile.mockRejectedValue(rejection);

        const actual = matlab.generateScript(workspaceDir, command);
        await expect(actual).rejects.toBeDefined();
        expect(mkdtemp).toHaveBeenCalledTimes(1);
        expect(writeFile).toHaveBeenCalledTimes(1);
    });
});

describe("run command", () => {
    const helperScript = { dir: "/home/sweet/home", command: "disp('hello, world');" };
    const platform = "win32";

    it("ideally works", async () => {
        const chmod = jest.spyOn(fs, "chmod");
        const execFn = jest.fn();

        chmod.mockResolvedValue(undefined);
        execFn.mockResolvedValue(0);

        const actual = matlab.runCommand(helperScript, platform, execFn);
        await expect(actual).resolves.toBeUndefined();
    });

    it("fails when chmod fails", async () => {
        const chmod = jest.spyOn(fs, "chmod");
        const execFn = jest.fn();

        chmod.mockRejectedValue(null);

        const actual = matlab.runCommand(helperScript, platform, execFn);
        await expect(actual).rejects.toBeDefined();
        expect(chmod).toHaveBeenCalledTimes(1);
        expect(execFn).not.toHaveBeenCalled();
    });

    it("fails when the execFn fails", async () => {
        const chmod = jest.spyOn(fs, "chmod");
        const execFn = jest.fn();

        chmod.mockResolvedValue(undefined);
        execFn.mockRejectedValue(null);

        const actual = matlab.runCommand(helperScript, platform, execFn);
        await expect(actual).rejects.toBeDefined();
        expect(chmod).toHaveBeenCalledTimes(1);
        expect(execFn).toHaveBeenCalledTimes(1);
    });

    it("fails when the execFn has a non-zero exit code", async () => {
        const chmod = jest.spyOn(fs, "chmod");
        const execFn = jest.fn();

        chmod.mockResolvedValue(undefined);
        execFn.mockResolvedValue(1);

        const actual = matlab.runCommand(helperScript, platform, execFn);
        await expect(actual).rejects.toBeDefined();
        expect(chmod).toHaveBeenCalledTimes(1);
        expect(execFn).toHaveBeenCalledTimes(1);
    });
});

describe("ci helper path", () => {
    const testCase = (platform: string, ext: string) => {
        it(`considers the appropriate script on ${platform}`, () => {
            const actualPath = matlab.getRunMATLABCommandScriptPath(platform);
            const actualExt = path.extname(actualPath);
            expect(actualExt).toMatch(ext);
        });
    };

    testCase("win32", "bat");
    testCase("darwin", "sh");
    testCase("linux", "sh");
});
