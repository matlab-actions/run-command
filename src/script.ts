// Copyright 2020 The MathWorks, Inc.

export function cdAndCall(dir: string, command: string): string {
    return `cd('${pathToCharVec(dir)}'); ${command}`;
}

export function pathToCharVec(s: string): string {
    return s.replace(/'/g, "''");
}

export function safeName(s: string): string {
    return s.replace(/-/g, "_");
}
