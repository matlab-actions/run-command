"use strict";
// Copyright 2020 The MathWorks, Inc.
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeName = exports.pathToCharVec = exports.cdAndCall = void 0;
function cdAndCall(dir, command) {
    return `cd('${pathToCharVec(dir)}'); ${command}`;
}
exports.cdAndCall = cdAndCall;
function pathToCharVec(s) {
    return s.replace(/'/g, "''");
}
exports.pathToCharVec = pathToCharVec;
function safeName(s) {
    return s.replace(/-/g, "_");
}
exports.safeName = safeName;
//# sourceMappingURL=script.js.map