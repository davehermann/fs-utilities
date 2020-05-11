// Node Modules
const fs = require(`../fs`),
    path = require(`path`);

/**
 * Ensure the full directory path exists before writing a file
 * @param {String} fullPathWithFile - The complete absolute path to the to-be-created file
 * @returns {Promise}
 */
function ensurePath(fullPathWithFile) {
    // Get an array of the path parts for the file's directory
    let pathParts = path.dirname(fullPathWithFile).split(path.sep);

    return createMissingDirectories(pathParts);
}

/**
 * Recursively check for the existance of a directory, and create it if missing
 * @param {Array<String>} pathParts - Components of the path remaining to be checked/created
 * @param {String} confirmedRoot - The root of the current pathParts
 * @returns {Promise}
 */
function createMissingDirectories(pathParts, confirmedRoot) {
    if (pathParts.length > 0) {
        if (confirmedRoot === undefined)
            confirmedRoot = path.sep;

        let checkPath = path.join(confirmedRoot, pathParts.shift());

        return fs.stat(checkPath)
            .then(() => { return true; })
            .catch(err => {
                if (err.code == `ENOENT`)
                    return Promise.resolve(false);

                return Promise.reject(err);
            })
            .then(directoryExists => {
                let pCreateDirectory = Promise.resolve();

                if (!directoryExists)
                    pCreateDirectory = new Promise((resolve, reject) => {
                        fs.nodeFs.mkdir(checkPath, (err) => {
                            if (!!err)
                                reject(err);
                            else
                                resolve();
                        });
                    });

                return pCreateDirectory;
            })
            .then(() => createMissingDirectories(pathParts, checkPath));
    } else
        return Promise.resolve();
}

module.exports.EnsurePathForFile = ensurePath;
