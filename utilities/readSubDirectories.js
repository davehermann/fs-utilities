// Library Modules
const { readdir, stat } = require(`../fs`);

function readSubDirectories(pathToRead) {
    // Read the current directory
    return readdir(pathToRead)
        // Check all objects to see if they are directories
        .then(foundItems => findSubDirectories(foundItems))
        // Perform readSubDirectories on any directory found
        .then(separateItems => {

        })
}

/**
 * Find, and separately track, sub-directories in a list of file system objects
 * @param {*} remainingItems
 * @returns {Promise<object>} The Promise returns an object of {files, directories}
 */
function findSubDirectories(remainingItems, foundDirectories, foundFiles) {
    if (!foundDirectories) {
        foundDirectories = [];
        foundFiles = [];
    }

    if (remainingItems.length > 0) {
        let checkPath = remainingItems.shift();
        return stat(checkPath)
            .catch(() => {
                // Ignore any error, as lack of privileges can be ignored, and we're not following symlinks
                return null;
            })
            .then(fileStats => {
                if (!!fileStats && fileStats.isDirectory())
                    foundDirectories.push(checkPath);
                else
                    foundFiles.push(checkPath);
            })
            .then(() => findSubDirectories(remainingItems, foundDirectories));
    } else
        return { directories: foundDirectories, files: foundFiles };
}

module.exports.ReadSubDirectories = readSubDirectories;
