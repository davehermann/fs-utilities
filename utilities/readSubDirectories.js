// Node Modules
const path = require(`path`);
const { readdir, stat } = require("fs").promises;

/**
 * Read the items in a directory, and traverse subdirectories
 * @param {String} pathToRead - Root path to check
 * @param {Object} options - Read options
 * @param {Array<String>} options.returnProperties - List of stat properties to return with data
 * @returns {Array<Object>} List of found file system objects, with stat properties, subdirectories supply the same data
 */
async function readSubDirectories(pathToRead, options) {
    // Get the list of file system objects in the current directory
    const directoryItems = await readdir(pathToRead);

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
 * @param {Array<String>} itemList - list of file system object names in the current directory
 * @param {String} inPath - current directory
 * @param {Object} options - Read options, passed directly from readSubDirectories
 * @param {Array<Object>} objectData - list of object details for the current directory
 * @returns {Promise<Array<Object>>} Resolves with the objectData
 */
function checkContents(itemList, inPath, options, objectData = []) {
    if (itemList.length > 0) {
        let nextItem = { fsName: itemList.shift() };
        nextItem.objectPath = path.join(inPath, nextItem.fsName);

        return stat(nextItem.objectPath)
            .catch(() => {
                // Ignore any error, as lack of privileges can be ignored, and we're not following symlinks
                return null;
            })
            .then(fileStats => {
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

module.exports.ReadSubDirectories = readSubDirectories;
