import { promises as fs } from "fs";

import { ReadSubDirectories, IDirectoryObject } from "./readSubDirectory";

/**
 * Delete a file or directory
 * @param fileSystemPath - absolute path to the file system object to be deleted
 * @param verbose - log delete actions to the console
 */
async function removePath(fileSystemPath: string, verbose = false): Promise<void> {
    if (verbose)
        console.log(`Remove ${fileSystemPath}`);

    try {
        // Get path contents
        const fsObjects = await ReadSubDirectories(fileSystemPath, { returnProperties: [], includeRoot: true });

        console.log(JSON.stringify(fsObjects, null, 4));

        await removeFileSystemObjects(fsObjects, verbose);
    } catch (err) {
        if (err.code == `ENOENT`) {
            if (verbose)
                console.log(`    - NOT FOUND (${fileSystemPath})`);
        } else
            throw err;
    }
}

async function removeFileSystemObjects(fsObjects: Array<IDirectoryObject>, verbose: boolean): Promise<void> {
    while (fsObjects.length > 0) {
        const nextObject = fsObjects.shift();

        if (nextObject.isDirectory) {
            await removeFileSystemObjects(nextObject.items, verbose);

            if (verbose)
                console.log(`Deleting Directory: ${nextObject.objectPath}`);

            await fs.rmdir(nextObject.objectPath);
        } else {
            if (verbose)
                console.log(`Deleting File: ${nextObject.objectPath}`);

            await fs.unlink(nextObject.objectPath);
        }
    }
}

export {
    removePath as RemovePath,
};
