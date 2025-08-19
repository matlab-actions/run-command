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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.matlab = void 0;
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const matlab = __importStar(require("./matlab"));
exports.matlab = matlab;
/**
 * Gather action inputs and then run action.
 */
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const platform = process.platform;
        const architecture = process.arch;
        const workspaceDir = process.cwd();
        const command = core.getInput("command");
        const startupOpts = core.getInput("startup-options").split(" ");
        const helperScript = yield matlab.generateScript(workspaceDir, command);
        const execOpts = {
        // env: {...process.env, MW_BATCH_LICENSING_ONLINE:'true'}  // Disabled while we work out online licensing kinks
        };
        yield matlab.runCommand(helperScript, platform, architecture, (cmd, args) => exec.exec(cmd, args, execOpts), startupOpts);
    });
}
// Only run this action if it is invoked directly. Do not run if this node
// module is required by another action such as run-tests.
if (require.main === module) {
    run().catch((e) => {
        core.setFailed(e);
    });
}
//# sourceMappingURL=index.js.map