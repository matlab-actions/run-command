export interface HelperScript {
    dir: string;
    command: string;
}
export declare type ExecFn = (command: string, args?: string[]) => Promise<number>;
export declare function generateScript(workspaceDir: string, command: string): Promise<HelperScript>;
export declare function runCommand(hs: HelperScript, platform: string, fn: ExecFn): Promise<void>;
export declare function getRmcPath(platform: string): string;
