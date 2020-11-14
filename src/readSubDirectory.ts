// Node Modules
import { promises as fs, Stats } from "fs";
import path from "path";

/** Options for reading subdirectories */
interface IReadOptions {
    /**
     * List of properties to return in the data object from NodeJS fs module's `Stats` class
     *
     * @remarks
     * See the [NodeJS FS Stats class documentation](https://nodejs.org/dist/latest/docs/api/fs.html#fs_class_fs_stats) for your NodeJS version to get a list of available properties
     */
    returnProperties?: Array<string>;
    /** When path is a directory, include the specified directory in the returned objects */
    includeRoot?: boolean;
}

/** Directory data */
interface IDirectoryObject {
    /** Name of the object within the current path */
    fsName: string;
    /** Absolute path to the object */
    objectPath?: string;
    /** Is the object a directory? */
    isDirectory?: boolean;
    /** The FS Stats class for the object, or the sub-set of properties in the IReadOptions parameters */
    stats?: Object;
    /** For a directory, the list of file system objects within that directory */
    items?: Array<IDirectoryObject>
}

/**
 * Read the items in a directory, and traverse subdirectories
 * @param pathToRead - Root path to check
 * @param options - Read options
 * @returns List of found file system objects, with stat properties, subdirectories supply the same data
 */
async function readSubDirectories(pathToRead: string, options?: IReadOptions): Promise<Array<IDirectoryObject>> {
    const directoryItems: Array<string> = [];
    let directoryPath: string;

    // Check the root object to see if it's a directory, or just a file
    const rootStats = await fs.stat(pathToRead);

    // In case of a file
    if (!rootStats.isDirectory() || options?.includeRoot) {
        // The only item to read in the directory is the path
        directoryItems.push(path.basename(pathToRead));
        // Use the containing directory as the directory to read
        directoryPath = path.dirname(pathToRead);
    } else {
        // In case of a directory

        // Get the list of file system objects in the current directory
        const itemsInDirectory = await fs.readdir(pathToRead);
        itemsInDirectory.forEach(i => directoryItems.push(i));

        // Use the passed-in path for the root path
        directoryPath = pathToRead;
    }

    // ALWAYS set options.includeRoot to false as it's only needed on the first call of readSubDirectories
    if (!!options)
        options.includeRoot = false;

    // Get data about all file system objects in the directory
    const directoryObjects = await checkContents(directoryItems, directoryPath, options);

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
function checkContents(itemList: Array<string>, inPath: string, options: IReadOptions, objectData: Array<IDirectoryObject> = []): Promise<Array<IDirectoryObject>> {
    if (itemList.length > 0) {
        let nextItem: IDirectoryObject = { fsName: itemList.shift() };
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
    IDirectoryObject,
    IReadOptions,
    readSubDirectories as ReadSubDirectories,
}
