// Copyright 2020 The MathWorks, Inc.

import * as matlab from "./matlab";
import { promises as fs } from "fs";

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
