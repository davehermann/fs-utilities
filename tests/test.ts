// Node Modules
import { promises as fs } from "fs";
import * as path from "path";

// NPM Modules
import { expect } from "chai";
import * as assert from "assert";
import { String as RandomString } from "@davehermann/random-generator";

// Application Modules
import { EnsurePathForFile, ReadSubDirectories, RemovePath, IDirectoryObject } from "../dist/fsutilities";

/*
 * Test protocol
 * 1) Generate a list of 100 random file names, within no more than 10 random directories
 * 2) (EnsurePathForFile) Ensure all 100 file's directories individually to test for creating new, and ignoring existing, directories
 *    a) Create all 100 files with contents simply the index of the file
 * 3) (ReadSubDirectories) Read the entire tree, and confirm all 100 files exist in the expected locations
 * 4) (MovePath) Move the files to a new random root location by the directory, and ensure they all exist and the old path tree does not
 * 5) (MovePath) Move the 100 files individually to a new random root location, and ensure they all exist and the old path tree does not
 * 6) (CopyPath) Copy the entire tree to a second random root location, and ensure all files exist in both locations
 * 7) (RemovePath) Remove the entire test files tree
 */

const TEST_PATH = path.join(process.cwd(), `tests`, `generated`),
    RANDOM_FILES: Array<string> = [];

describe(`Dave Hermann's FS Utilities`, function() {
    before(async function() {
        await RemovePath(TEST_PATH, true);

        testProtocol1();
    });

    describe(`ensurePath`, function() {
        it(`should create directories`, async function() {
            return assert.doesNotReject(testProtocol2(RANDOM_FILES.filter(() => true)));
        });

        it(`should read those directories, and confirm they exist`, function() {
            return testProtocol3();
        });
    });
});

/**
 * Create a flat list of the file paths found in a read file system directory structure
 * @param fileStructure - The directory structure to use
 */
function structureToFlatFileList(fileStructure: Array<IDirectoryObject>): Array<string> {
    const foundFiles: Array<string> = [];

    for (let idx = 0, total = fileStructure.length; idx < total; idx++) {
        const fsObject = fileStructure[idx];

        if (fsObject.isDirectory)
            structureToFlatFileList(fsObject.items).forEach(filePath => foundFiles.push(filePath));
        else
            foundFiles.push(fsObject.objectPath);
    }

    return foundFiles;
}

/** Generate a list of 100 random file names, within no more than 10 random directories */
function testProtocol1() {
    // Configure random file structure
    const directories = [...new Array(Math.ceil(Math.random() * 10))].map(() => RandomString());

    for (let a = 0, total = Math.ceil(Math.random() * 100); a < total; a++)
        RANDOM_FILES.push(path.join(TEST_PATH, directories[Math.floor(Math.random() * directories.length)], `${RandomString({ includeUppercaseCharacters: true, length: Math.ceil(Math.random() * 6) + 2 })}.txt`));

    RANDOM_FILES.sort();
}

/**
 * _(EnsurePathForFile)_ Ensure all 100 file's directories exist individually to test for creating new, and ignoring existing, directories
 *   + Create all 100 files with contents simply the index of the file
 * @param {string[]} fileList - A copy of the RANDOM_FILES list
 */
async function testProtocol2(fileList: Array<string>, counter = 0) {
    if (fileList.length > 0) {
        const filePath = fileList.shift();
        // Create the path
        await EnsurePathForFile(filePath);
        // Create the file
        await fs.writeFile(filePath, `Test file ${++counter}`);

        // Run remaining files
        await testProtocol2(fileList, counter);
    }
}

/**
 * _(ReadSubDirectories)_ Read the entire tree, and confirm all 100 files exist in the expected locations
 */
async function testProtocol3() {
    const fileStructure = await ReadSubDirectories(TEST_PATH, { returnProperties: [] });

    const foundFiles = structureToFlatFileList(fileStructure);
    foundFiles.sort();

    return assert.deepStrictEqual(foundFiles, RANDOM_FILES);
}
