import { promises as fs } from "fs";

import { ReadSubDirectories, IDirectoryObject } from "./readSubDirectory";

/**
 * Move a file or directory
 * @param sourcePath
 * @param destinationPath
 * @param verbose - log delete actions to the console
 */
async function movePath(sourcePath: string, destinationPath: string, verbose = false): Promise<void> {
    if (verbose)
        console.log(`Move ${sourcePath} to ${destinationPath}`);

    // Get entire contents of the path
    try {
        const fsObjects = await ReadSubDirectories(sourcePath, { returnProperties: [], includeRoot: true });

        await moveFileSystemObjects(fsObjects, destinationPath, verbose);
    } catch (err) {
        if ((err.code == `ENOENT`) && (err.path == sourcePath)) {
            console.log(`    - NOT FOUND (${sourcePath})`);
        } else
            throw err;
    }
}

async function moveFileSystemObjects(source: Array<IDirectoryObject>, destinationPath: string, verbose: boolean) {
    // Move the object using rename
    await fs.rename(source[0].objectPath, destinationPath);
}

export {
    movePath as MovePath,
};
