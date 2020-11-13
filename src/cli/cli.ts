#!/usr/bin/env node

import * as path from "path";

import { DisplayHelp } from "./help";
import { RemovePath } from "../fsutilities";

//#region CLI Actions
/**
 * Remove a file or directory at the specified path
 * @param params - The arguments array, expecting only one argument as the path to the file to remove
 */
async function Delete(params: Array<string>): Promise<boolean> {
    // Exit the process and show help if there isn't exactly one argument
    if (params.length !== 1)
        return true;

    let pathToRemove = path.normalize(params.shift());

    if (!path.isAbsolute(pathToRemove))
        pathToRemove = path.join(process.cwd(), pathToRemove);

    await RemovePath(pathToRemove, true);

    return false;
}
//#endregion CLI Actions

async function main() {
    // Check any CLI parameters after the first 2 (node, and the javascript path)
    const args = process.argv.filter(((val, idx) => { return idx > 1; })).map(val => val.toLowerCase());

    // Display help when no arguments are used, or help is specifically requested
    let showHelp = ((args.length == 0) || (args.indexOf(`--help`) >= 0));

    // Try to match an existing known command
    if (!showHelp) {
        const action = args.shift();

        switch (action) {
            case `delete`:
                showHelp = await Delete(args);
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
