"use strict";
// Copyright 2020-2023 The MathWorks, Inc.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRunMATLABCommandScriptPath = exports.runCommand = exports.generateScript = void 0;
const fs_1 = require("fs");
const os = __importStar(require("os"));
const path = __importStar(require("path"));
const uuid_1 = require("uuid");
const script = __importStar(require("./script"));
/**
 * Generate a MATLAB script in the temporary directory that runs a command in
 * the workspace.
 *
 * @param workspaceDir CI job workspace directory
 * @param command MATLAB command to run
 */
function generateScript(workspaceDir, command) {
    return __awaiter(this, void 0, void 0, function* () {
        const scriptName = script.safeName(`command_${(0, uuid_1.v4)()}`);
        const temporaryDirectory = yield fs_1.promises.mkdtemp(path.join(os.tmpdir(), "run_matlab_command-"));
        const scriptPath = path.join(temporaryDirectory, scriptName + ".m");
        yield fs_1.promises.writeFile(scriptPath, script.cdAndCall(command), {
            encoding: "utf8",
        });
        return {
            dir: temporaryDirectory,
            command: scriptName
        };
    });
}
exports.generateScript = generateScript;
/**
 * Run a HelperScript in MATLAB.
 *
 * Create the HelperScript using `generateScript`.
 *
 * @param hs HelperScript pointing to the script containing the command
 * @param platform Operating system of the runner (e.g., "win32" or "linux")
 * @param architecture Architecture of the runner (e.g., "x64")
 * @param fn ExecFn that will execute a command on the runner
 */
function runCommand(hs, platform, architecture, fn, args) {
    return __awaiter(this, void 0, void 0, function* () {
        const rmcPath = getRunMATLABCommandScriptPath(platform, architecture);
        yield fs_1.promises.chmod(rmcPath, 0o777);
        const rmcArg = `setenv('MW_ORIG_WORKING_FOLDER',cd('${script.pathToCharVec(hs.dir)}')); ${hs.command}`;
        let execArgs = [rmcArg];
        if (args) {
            execArgs = execArgs.concat(args);
        }
        const exitCode = yield fn(rmcPath, execArgs);
        if (exitCode !== 0) {
            return Promise.reject(Error(`Exited with non-zero code ${exitCode}`));
        }
    });
}
exports.runCommand = runCommand;
/**
 * Get the path of the script containing RunMATLABCommand for the host OS.
 *
 * @param platform Operating system of the runner (e.g., "win32" or "linux")
 * @param architecture Architecture of the runner (e.g., "x64")
*/
function getRunMATLABCommandScriptPath(platform, architecture) {
    if (architecture != "x64" && !(platform == "darwin" && architecture == "arm64")) {
        throw new Error(`This action is not supported on ${platform} runners using the ${architecture} architecture.`);
    }
    let ext;
    let platformDir;
    switch (platform) {
        case "win32":
            ext = ".exe";
            platformDir = "win64";
            break;
        case "darwin":
            ext = "";
            if (architecture == "x64") {
                platformDir = "maci64";
            }
            else {
                platformDir = "maca64";
            }
            break;
        case "linux":
            ext = "";
            platformDir = "glnxa64";
            break;
        default:
            throw new Error(`This action is not supported on ${platform} runners using the ${architecture} architecture.`);
    }
    const rmcPath = path.join(__dirname, "bin", platformDir, `run-matlab-command${ext}`);
    return rmcPath;
}
exports.getRunMATLABCommandScriptPath = getRunMATLABCommandScriptPath;
//# sourceMappingURL=matlab.js.map