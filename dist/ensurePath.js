"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnsurePathForFile = void 0;
// Node Modules
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
/**
 * Ensure the full directory path exists before writing a file
 * @param fullPathWithFile - The complete absolute path to the to-be-created file
 */
function ensurePath(fullPathWithFile) {
    // Get an array of the path parts for the file's directory
    const pathParts = path_1.default.dirname(fullPathWithFile).split(path_1.default.sep);
    return createMissingDirectories(pathParts);
}
exports.EnsurePathForFile = ensurePath;
/**
 * Recursively check for the existance of a directory, and create it if missing
 * @param pathParts - Components of the path remaining to be checked/created
 * @param confirmedRoot - The root of the current pathParts
 */
function createMissingDirectories(pathParts, confirmedRoot) {
    if (pathParts.length > 0) {
        if (confirmedRoot === undefined)
            confirmedRoot = path_1.default.sep;
        const checkPath = path_1.default.join(confirmedRoot, pathParts.shift());
        return fs_1.promises.stat(checkPath)
            .then(() => { return true; })
            .catch(err => {
            if (err.code == `ENOENT`)
                return Promise.resolve(false);
            return Promise.reject(err);
        })
            .then(directoryExists => {
            let pCreateDirectory = Promise.resolve();
            if (!directoryExists)
                pCreateDirectory = fs_1.promises.mkdir(checkPath);
            return pCreateDirectory;
        })
            .then(() => createMissingDirectories(pathParts, checkPath));
    }
    else
        return Promise.resolve();
}
