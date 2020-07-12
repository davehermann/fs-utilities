// Node Modules
import { promises as fs, Stats } from "fs";
import path from "path";

interface ReadOptions {
    returnProperties: Array<string>;
}

interface DirectoryObject {
    fsName: string;
    objectPath?: string;
    isDirectory?: boolean;
    stats?: Object;
    items?: Array<DirectoryObject>
}

/**
 * Read the items in a directory, and traverse subdirectories
 * @param pathToRead - Root path to check
 * @param options - Read options
 * @returns List of found file system objects, with stat properties, subdirectories supply the same data
 */
async function readSubDirectories(pathToRead: string, options: ReadOptions): Promise<Array<DirectoryObject>> {
    // Get the list of file system objects in the current directory
    const directoryItems = await fs.readdir(pathToRead);

    // Get data about all file system objects in the directory
    const directoryObjects = await checkContents(directoryItems, pathToRead, options);

    // Loop through each file system object
    for (let idxObjects = 0, total = directoryObjects.length; idxObjects < total; idxObjects++) {
        const currentObject = directoryObjects[idxObjects];

        // For subdirectories, read them
        if (currentObject.isDirectory)
            currentObject.items = await readSubDirectories(currentObject.objectPath, options);
    }

    return directoryObjects;
}

/**
 * Get stat data, and add additional needed data, to file system objects
 * @param itemList - list of file system object names in the current directory
 * @param inPath - current directory
 * @param options - Read options, passed directly from readSubDirectories
 * @returns Resolves with the objectData
 */
function checkContents(itemList: Array<string>, inPath: string, options: ReadOptions, objectData: Array<DirectoryObject> = []): Promise<Array<DirectoryObject>> {
    if (itemList.length > 0) {
        let nextItem: DirectoryObject = { fsName: itemList.shift() };
        nextItem.objectPath = path.join(inPath, nextItem.fsName);

        return fs.stat(nextItem.objectPath)
            .catch(() => {
                // Ignore any error, as lack of privileges can be ignored, and we're not following symlinks
                return null;
            })
            .then((fileStats: Stats) => {
                nextItem.isDirectory = !!fileStats && fileStats.isDirectory();
                if (!!options && !!options.returnProperties) {
                    nextItem.stats = {};
                    for (let prop in fileStats)
                        if (options.returnProperties.indexOf(prop) >=0)
                            nextItem.stats[prop] = fileStats[prop];
                } else
                    nextItem.stats = fileStats;
                objectData.push(nextItem);
            })
            .then(() => checkContents(itemList, inPath, options, objectData));

    } else
        return Promise.resolve(objectData);
}

export {
    readSubDirectories as ReadSubDirectories,
}
