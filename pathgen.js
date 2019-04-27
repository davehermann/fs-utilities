// Node Modules
const fs = require(`fs`),
    path = require(`path`);

const appFs = require(`./fs`);

function ensurePath(fullPathWithFile) {
    let pathParts = path.dirname(fullPathWithFile).split(path.sep);

    return createMissingDirectories(pathParts);
}

function createMissingDirectories(pathParts, confirmedRoot) {
    if (pathParts.length > 0) {
        if (confirmedRoot === undefined)
            confirmedRoot = path.sep;

        let checkPath = path.join(confirmedRoot, pathParts.shift());

        return new Promise((resolve, reject) => {
            // Check for the directory
            fs.stat(checkPath, (err) => {
                if (!!err) {
                    if (err.code == `ENOENT`)
                        resolve(false);
                    else
                        reject(err);
                } else
                    resolve(true);
            });
        })
            .then(directoryExists => {
                let pCreateDirectory = Promise.resolve();

                if (!directoryExists)
                    pCreateDirectory = new Promise((resolve, reject) => {
                        fs.mkdir(checkPath, (err) => {
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

// Promisified versions of FS methods
module.exports.fs = appFs;
