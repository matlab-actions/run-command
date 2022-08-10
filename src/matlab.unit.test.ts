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
    const architecture = "x64"

    it("ideally works", async () => {
        const chmod = jest.spyOn(fs, "chmod");
        const execFn = jest.fn();

        chmod.mockResolvedValue(undefined);
        execFn.mockResolvedValue(0);

        const actual = matlab.runCommand(helperScript, platform, architecture, execFn);
        await expect(actual).resolves.toBeUndefined();
    });

    it("fails when chmod fails", async () => {
        const chmod = jest.spyOn(fs, "chmod");
        const execFn = jest.fn();

        chmod.mockRejectedValue(null);

        const actual = matlab.runCommand(helperScript, platform, architecture, execFn);
        await expect(actual).rejects.toBeDefined();
        expect(chmod).toHaveBeenCalledTimes(1);
        expect(execFn).not.toHaveBeenCalled();
    });

    it("fails when the execFn fails", async () => {
        const chmod = jest.spyOn(fs, "chmod");
        const execFn = jest.fn();

        chmod.mockResolvedValue(undefined);
        execFn.mockRejectedValue(null);

        const actual = matlab.runCommand(helperScript, platform, architecture, execFn);
        await expect(actual).rejects.toBeDefined();
        expect(chmod).toHaveBeenCalledTimes(1);
        expect(execFn).toHaveBeenCalledTimes(1);
    });

    it("fails when the execFn has a non-zero exit code", async () => {
        const chmod = jest.spyOn(fs, "chmod");
        const execFn = jest.fn();

        chmod.mockResolvedValue(undefined);
        execFn.mockResolvedValue(1);

        const actual = matlab.runCommand(helperScript, platform, architecture, execFn);
        await expect(actual).rejects.toBeDefined();
        expect(chmod).toHaveBeenCalledTimes(1);
        expect(execFn).toHaveBeenCalledTimes(1);
    });
});

describe("ci helper path", () => {
    const platform = "linux"
    const architecture = "x64"
    const testExtension = (platform: string, ext: string) => {
        it(`considers the appropriate script on ${platform}`, () => {
            const actualPath = matlab.getRunMATLABCommandScriptPath(platform, architecture);
            const actualExt = path.extname(actualPath);
            expect(actualExt).toMatch(ext);
        });
    };

    const testDirectory = (platform: string, subdirectory: string) => {
        it(`considers the appropriate script on ${platform}`, () => {
            const actualPath = matlab.getRunMATLABCommandScriptPath(platform, architecture);
            expect(actualPath).toContain(subdirectory);
        });
    };
    
    testExtension("win32", "exe");
    testExtension("darwin", "");
    testExtension("linux", "");

    testDirectory("win32", "win64");
    testDirectory("darwin", "maci64");
    testDirectory("linux", "glnxa64");

    it("errors on unsupported platform", () => {
        expect(() => matlab.getRunMATLABCommandScriptPath('sunos',architecture)).toThrow();
    })

    it("errors on unsupported architecture", () => {
        expect(() => matlab.getRunMATLABCommandScriptPath(platform, 'x86')).toThrow();
    })
});
