import { promises as fs } from "fs";
import * as path from "path";

import { ReadSubDirectories, IDirectoryObject } from "./readSubDirectory";
import { EnsurePathForFile } from "./ensurePath";

/**
 * Copy a file or directory
 * @param sourcePath - absolute path to the file system object to be copied
 * @param destinationPath - absolute path to the location of the copy
 * @param verbose - log delete actions to the console
 */
async function copyPath(sourcePath: string, destinationPath: string, verbose = false): Promise<void> {
    if (verbose)
        console.log(`Copy ${sourcePath} to ${destinationPath}`);

    // Get entire contents of the path
    try {
        const fsObjects = await ReadSubDirectories(sourcePath, { returnProperties: [], includeRoot: true });

        await copyFileSystemObjects(fsObjects, sourcePath, destinationPath, verbose);
    } catch (err) {
        if ((err.code == `ENOENT`) && (err.path == sourcePath)) {
            if (verbose)
                console.log(`    - NOT FOUND (${sourcePath})`);
        } else
            throw err;
    }
}

async function copyFileSystemObjects(source: Array<IDirectoryObject>, sourcePath: string, destinationPath: string, verbose: boolean) {
    while (source.length > 0) {
        const nextObject = source.shift(),
            copyDestination = nextObject.objectPath.replace(sourcePath, destinationPath);

        if (nextObject.isDirectory) {
            // Create the directory
            if (verbose)
                console.log(`Creating directory: ${copyDestination}`);

            await EnsurePathForFile(path.join(copyDestination, `dummyFile`));

            await copyFileSystemObjects(nextObject.items, sourcePath, destinationPath, verbose);
        } else {
            if (verbose)
                console.log(`    Copying: ${nextObject.fsName} to ${copyDestination}`);

            await fs.copyFile(nextObject.objectPath, copyDestination);
        }
    }
}

export {
    copyPath as CopyPath,
};
