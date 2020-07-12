// Node Modules
import { promises as fs } from "fs";
import path from "path";

/**
 * Ensure the full directory path exists before writing a file
 * @param fullPathWithFile - The complete absolute path to the to-be-created file
 */
function ensurePath(fullPathWithFile: string) {
    // Get an array of the path parts for the file's directory
    const pathParts = path.dirname(fullPathWithFile).split(path.sep);

    return createMissingDirectories(pathParts);
}

/**
 * Recursively check for the existance of a directory, and create it if missing
 * @param pathParts - Components of the path remaining to be checked/created
 * @param confirmedRoot - The root of the current pathParts
 */
function createMissingDirectories(pathParts: Array<string>, confirmedRoot?: string): Promise<void> {
    if (pathParts.length > 0) {
        if (confirmedRoot === undefined)
            confirmedRoot = path.sep;

        const checkPath = path.join(confirmedRoot, pathParts.shift());

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
                    pCreateDirectory = fs.mkdir(checkPath);

                return pCreateDirectory;
            })
            .then(() => createMissingDirectories(pathParts, checkPath));
    } else
        return Promise.resolve();
}

export {
    ensurePath as EnsurePathForFile,
};
