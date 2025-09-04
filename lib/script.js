"use strict";
// Copyright 2020-2025 The MathWorks, Inc.
Object.defineProperty(exports, "__esModule", { value: true });
exports.cdAndCall = cdAndCall;
exports.pathToCharVec = pathToCharVec;
exports.safeName = safeName;
/**
 * Generate MATLAB command for changing directories and calling a command in it.
 *
 * @param dir Directory to change to.
 * @param command Command to run in directory.
 * @returns MATLAB command.
 */
function cdAndCall(command) {
    return `cd(getenv('MW_ORIG_WORKING_FOLDER')); ${command}`;
}
/**
 * Convert a path-like string to MATLAB character vector literal.
 *
 * @param s Input string.
 * @returns Input string in MATLAB character vector literal.
 */
function pathToCharVec(s) {
    return s.replace(/'/g, "''");
}
/**
 * Convert an identifier (i.e., a script name) to one that is callable by MATLAB.
 *
 * @param s Input identifier.
 */
function safeName(s) {
    return s.replace(/-/g, "_");
}
//# sourceMappingURL=script.js.map