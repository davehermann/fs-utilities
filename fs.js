// Node Modules
const fs = require(`fs`);

/**
 * Use a Promise to implement fs.writeFile
 * @param {String | Buffer | URL | Number} filePath - pass to writeFile
 * @param {String | Buffer | Uint8Array} data - pass to writeFile
 * @param {Map} options - pass to writeFile
 */
function writeFile(filePath, data, options) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, options, (err) => {
            if (!!err)
                reject(err);
            else
                resolve();
        });
    });
}

/**
 * Use a Promise to implement fs.readFile
 * @param {String | Buffer | URL | Number} filePath  - pass to readFile
 * @param {Map} options - pass to readFile
 */
function readFile(filePath, options) {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, options, (err, data) => {
            if (!!err)
                reject(err);
            else
                resolve(data);
        });
    });
}

/**
 * Use a Promise to implement fs.readdir
 * @param {String | Buffer | URL } directoryPath - pass to fs.readdir
 * @param {*} options  - pass to fs.readdir
 */
function readdir(directoryPath, options) {
    return new Promise((resolve, reject) => {
        fs.readdir(directoryPath, options, (err, data) => {
            if (!!err)
                reject(err);
            else
                resolve(data);
        });
    });
}

/**
 * Use a Promise to implement stat
 * @param {String | Buffer | URL } filePath - pass to fs.stat
 */
function stat(filePath) {
    return new Promise((resolve, reject) => {
        fs.stat(filePath, (err, data) => {
            if (!!err)
                reject(err);
            else
                resolve(data);
        });
    });
}

/**
 * Use a Promise to implement lstat
 * @param {String | Buffer | URL } filePath - pass to fs.lstat
 */
function lstat(filePath) {
    return new Promise((resolve, reject) => {
        fs.lstat(filePath, (err, data) => {
            if (!!err)
                reject(err);
            else
                resolve(data);
        });
    });
}

module.exports.writeFile = writeFile;
module.exports.readFile = readFile;
module.exports.readdir = readdir;
module.exports.stat = stat;
module.exports.lstat = lstat;
module.exports.nodeFs = fs;
