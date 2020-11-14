#!/usr/bin/env node

import * as path from "path";

import { DisplayHelp } from "./help";
import { RemovePath, MovePath, CopyPath } from "../fsutilities";

//#region CLI Actions
async function Copy(params: Array<string>): Promise<boolean> {
    if (params.length !== 2)
        return true;

    const sourcePath = getAbsolutePath(params.shift()),
        destinationPath = getAbsolutePath(params.shift());

    await CopyPath(sourcePath, destinationPath, true);

    return false;
}

/**
 * Remove a file or directory at the specified path
 * @param params - The arguments array, expecting only one argument as the path to the file to remove
 */
async function Delete(params: Array<string>): Promise<boolean> {
    // Exit the process and show help if there isn't exactly one argument
    if (params.length !== 1)
        return true;

    const pathToRemove = getAbsolutePath(params.shift());

    await RemovePath(pathToRemove, true);

    return false;
}

/**
 * Move a file or directory from the specified source path to a destination
 * @param params - The arguments array, expecting exactly two arguments: the source and destination paths
 */
async function Move(params: Array<string>): Promise<boolean> {
    if (params.length !== 2)
        return true;

    const sourcePath = getAbsolutePath(params.shift()),
        destinationPath = getAbsolutePath(params.shift());

    await MovePath(sourcePath, destinationPath, true);

    return false;
}
//#endregion CLI Actions

function getAbsolutePath(pathToCheck: string): string {
    const normalizedPath = path.normalize(pathToCheck);
    let absolutePath = normalizedPath;

    if (!path.isAbsolute(normalizedPath))
        absolutePath = path.join(process.cwd(), normalizedPath);

    return absolutePath;
}

async function main() {
    // Check any CLI parameters after the first 2 (node, and the javascript path)
    const args = process.argv.filter(((val, idx) => { return idx > 1; })).map(val => val.toLowerCase());
    console.log(args);

    // Display help when no arguments are used, or help is specifically requested
    let showHelp = ((args.length == 0) || (args.indexOf(`--help`) >= 0));

    // Try to match an existing known command
    if (!showHelp) {
        const action = args.shift();

        switch (action) {
            case `copy`:
                showHelp = await Copy(args);
                break;

            case `delete`:
                showHelp = await Delete(args);
                break;

            case `move`:
                showHelp = await Move(args);
                break;

            default:
                showHelp = true;
                break;
        }
    }

    if (showHelp)
        DisplayHelp();
}

main()
    .catch(err => {
        console.error(err);
    });
