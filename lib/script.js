"use strict";
// Copyright 2020 The MathWorks, Inc.
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeName = exports.pathToCharVec = exports.cdAndCall = void 0;
/**
 * Generate MATLAB command for changing directories and calling a command in it.
 *
 * @param dir Directory to change to.
 * @param command Command to run in directory.
 * @returns MATLAB command.
 */
function cdAndCall(dir, command) {
    return `cd('${pathToCharVec(dir)}'); ${command}`;
}
exports.cdAndCall = cdAndCall;
/**
 * Convert a path-like string to MATLAB character vector literal.
 *
 * @param s Input string.
 * @returns Input string in MATLAB character vector literal.
 */
function pathToCharVec(s) {
    return s.replace(/'/g, "''");
}
exports.pathToCharVec = pathToCharVec;
/**
 * Convert an identifier (i.e., a script name) to one that is callable by MATLAB.
 *
 * @param s Input identifier.
 */
function safeName(s) {
    return s.replace(/-/g, "_");
}
exports.safeName = safeName;
//# sourceMappingURL=script.js.map