"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadSubDirectories = void 0;
// Node Modules
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
/**
 * Read the items in a directory, and traverse subdirectories
 * @param pathToRead - Root path to check
 * @param options - Read options
 * @returns List of found file system objects, with stat properties, subdirectories supply the same data
 */
function readSubDirectories(pathToRead, options) {
    return __awaiter(this, void 0, void 0, function* () {
        // Get the list of file system objects in the current directory
        const directoryItems = yield fs_1.promises.readdir(pathToRead);
        // Get data about all file system objects in the directory
        const directoryObjects = yield checkContents(directoryItems, pathToRead, options);
        // Loop through each file system object
        for (let idxObjects = 0, total = directoryObjects.length; idxObjects < total; idxObjects++) {
            const currentObject = directoryObjects[idxObjects];
            // For subdirectories, read them
            if (currentObject.isDirectory)
                currentObject.items = yield readSubDirectories(currentObject.objectPath, options);
        }
        return directoryObjects;
    });
}
exports.ReadSubDirectories = readSubDirectories;
/**
 * Get stat data, and add additional needed data, to file system objects
 * @param itemList - list of file system object names in the current directory
 * @param inPath - current directory
 * @param options - Read options, passed directly from readSubDirectories
 * @returns Resolves with the objectData
 */
function checkContents(itemList, inPath, options, objectData = []) {
    if (itemList.length > 0) {
        let nextItem = { fsName: itemList.shift() };
        nextItem.objectPath = path_1.default.join(inPath, nextItem.fsName);
        return fs_1.promises.stat(nextItem.objectPath)
            .catch(() => {
            // Ignore any error, as lack of privileges can be ignored, and we're not following symlinks
            return null;
        })
            .then((fileStats) => {
            nextItem.isDirectory = !!fileStats && fileStats.isDirectory();
            if (!!options && !!options.returnProperties) {
                nextItem.stats = {};
                for (let prop in fileStats)
                    if (options.returnProperties.indexOf(prop) >= 0)
                        nextItem.stats[prop] = fileStats[prop];
            }
            else
                nextItem.stats = fileStats;
            objectData.push(nextItem);
        })
            .then(() => checkContents(itemList, inPath, options, objectData));
    }
    else
        return Promise.resolve(objectData);
}
