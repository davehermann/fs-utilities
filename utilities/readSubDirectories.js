// Node Modules
const path = require(`path`);

// Library Modules
const { readdir, stat } = require(`../fs`);

function readSubDirectories(pathToRead) {
    if (typeof pathToRead == `string`)
        pathToRead = [{ directory: pathToRead }];

    console.log(pathToRead);

    if (pathToRead.length > 0) {
        let nextPath = pathToRead.shift();

        // Read the current directory
        return readdir(nextPath.directory)
            // Check all objects to see if they are directories
            .then(foundItems => findSubDirectories(nextPath.directory, foundItems))
            // Perform readSubDirectories on any directory found
            .then(separateItems => {
                console.log(separateItems);
                // return readSubDirectories(separateItems.directories);
            });
    } else
        return Promise.resolve();
}

/**
 * Find, and separately track, sub-directories in a list of file system objects
 * @param {*} remainingItems
 * @returns {Promise<object>} The Promise returns an object of {files, directories}
 */
function findSubDirectories(basePath, remainingItems, foundDirectories, foundFiles) {
    if (!foundDirectories) {
        foundDirectories = [];
        foundFiles = [];
    }

    if (remainingItems.length > 0) {
        let checkPath = remainingItems.shift();
        return stat(path.join(basePath, checkPath))
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
            .then(() => findSubDirectories(basePath, remainingItems, foundDirectories, foundFiles));
    } else {
        return { directories: foundDirectories.map(directory => { return { directory }; }), files: foundFiles };
    }
}

module.exports.ReadSubDirectories = readSubDirectories;
