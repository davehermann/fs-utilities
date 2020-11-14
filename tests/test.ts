// Node Modules
import { promises as fs } from "fs";
import * as path from "path";

// NPM Modules
import { expect } from "chai";
import * as assert from "assert";
import { String as RandomString } from "@davehermann/random-generator";

// Application Modules
import { CopyPath, EnsurePathForFile, MovePath, ReadSubDirectories, RemovePath, IDirectoryObject } from "../dist/fsutilities";

/*
**************************
      Test protocol
**************************
  1) Generate a list of 100 random file names, within no more than 10 random directories
  2) (EnsurePathForFile) Ensure all 100 file's directories individually to test for creating new, and ignoring existing, directories
      a) Create all 100 files with contents simply the index of the file
  3) (ReadSubDirectories) Read the entire tree, and confirm all 100 files exist in the expected locations
  4) (MovePath) Move the files to a new random root location by the directory, and ensure they all exist and the old path tree does not
  5) NOT IMPLEMENTED: (MovePath) Move the 100 files individually to a new random root location, and ensure they all exist and the old path tree does not
  6) (CopyPath) Copy the entire tree to a second random root location, and ensure all files exist in both locations
  7) (RemovePath) Remove the entire test files tree
 */

const TEST_PATH = path.join(process.cwd(), `tests`, `generated`),
    RANDOM_FILES: Array<string> = [];

let originalSubdirectory = RandomString({ length: 6 }),
    movedSubdirectory = RandomString({ length: 8, includeLowercaseCharacters: false, includeUppercaseCharacters: true }),
    movedIndividualFilesSubdirectory = RandomString({ length: 12 }),
    copiedSubdirectory = RandomString({ length: 4, includeUppercaseCharacters: true });

describe(`Dave Hermann's FS Utilities`, function() {
    before(async function() {
        await RemovePath(TEST_PATH);

        testProtocol1_Initialization();
    });

    describe(`EnsurePathForFile`, function() {
        it(`should create directories under "./tests/generated/${originalSubdirectory}"`, async function() {
            return assert.doesNotReject(testProtocol2_DirectoryAndFileCreation(RANDOM_FILES.filter(() => true)));
        });
    });

    describe(`ReadSubDirectories`, function() {
        it(`should read those directories, and confirm they exist`, function() {
            return testProtocol3_ConfirmFileExistence();
        });
    });

    describe(`MovePath`, function() {
        it(`should move the entire "./tests/generated/${originalSubdirectory}" to "./tests/generated/${movedSubdirectory}"`, function() {
            return testProtocol4_MoveDirectory();
        });
    });

    describe.skip(`MovePath (via file copy)`, function() {
        it(`should move the entire "./tests/generated/${movedSubdirectory}" to "./tests/generated/${movedIndividualFilesSubdirectory}"`, function() {
            const err = new Error();
            err.name = `NOTIMPLEMENTED`;
            err.message = `Method not implemented in API`;
            throw err;
        });
    });

    describe(`CopyPath`, function() {
        it(`should copy the entire "./tests/generated/${movedSubdirectory}" to "./tests/generated/${copiedSubdirectory}"`, function() {
            return testProtocol6_CopyDirectory();
        });
    });

    describe(`RemovePath`, function() {
        it(`should remove the entire generated tests directory tree`, function() {
            return testProtocol7_RemoveGeneratedFiles();
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

/** Use ReadSubDirectory to generate a flat file list for the generated test files */
async function getExistingGeneratedFiles() {
    const fileStructure = await ReadSubDirectories(TEST_PATH, { returnProperties: [] });

    const foundFiles = structureToFlatFileList(fileStructure);
    foundFiles.sort();

    return foundFiles;
}

/** Generate a list of 100 random file names, within no more than 10 random directories */
function testProtocol1_Initialization() {
    // Configure random file structure
    const directories = [...new Array(Math.ceil(Math.random() * 10))].map(() => RandomString());

    for (let a = 0, total = Math.ceil(Math.random() * 100); a < total; a++)
        RANDOM_FILES.push(path.join(directories[Math.floor(Math.random() * directories.length)], `${RandomString({ includeUppercaseCharacters: true, length: Math.ceil(Math.random() * 6) + 2 })}.txt`));

    RANDOM_FILES.sort();
}

/**
 * _(EnsurePathForFile)_ Ensure all 100 file's directories exist individually to test for creating new, and ignoring existing, directories
 *   + Create all 100 files with contents simply the index of the file
 * @param {string[]} fileList - A copy of the RANDOM_FILES list
 */
async function testProtocol2_DirectoryAndFileCreation(fileList: Array<string>, counter = 0) {
    if (fileList.length > 0) {
        const filePath = path.join(TEST_PATH, originalSubdirectory, fileList.shift());
        // Create the path
        await EnsurePathForFile(filePath);
        // Create the file
        await fs.writeFile(filePath, `Test file ${++counter}`);

        // Run remaining files
        await testProtocol2_DirectoryAndFileCreation(fileList, counter);
    }
}

/**
 * _(ReadSubDirectories)_ Read the entire tree, and confirm all 100 files exist in the expected locations
 */
async function testProtocol3_ConfirmFileExistence() {
    const foundFiles = await getExistingGeneratedFiles();

    return assert.deepStrictEqual(foundFiles, RANDOM_FILES.map(relativePath => path.join(TEST_PATH, originalSubdirectory, relativePath)));
}

/**
 * _(MovePath)_ Move the files to a new random root location by the directory, and ensure they all exist and the old path tree does not
 */
async function testProtocol4_MoveDirectory() {
    await MovePath(path.join(TEST_PATH, originalSubdirectory), path.join(TEST_PATH, movedSubdirectory));

    const foundFiles = await getExistingGeneratedFiles();

    assert.notDeepStrictEqual(foundFiles, RANDOM_FILES.map(relativePath => path.join(TEST_PATH, originalSubdirectory, relativePath)));
    return assert.deepStrictEqual(foundFiles, RANDOM_FILES.map(relativePath => path.join(TEST_PATH, movedSubdirectory, relativePath)));
}

/**
 * _(CopyPath)_ Copy the entire tree to a second random root location, and ensure all files exist in both locations
 */
async function testProtocol6_CopyDirectory() {
    await CopyPath(path.join(TEST_PATH, movedSubdirectory), path.join(TEST_PATH, copiedSubdirectory));

    const foundFiles = await getExistingGeneratedFiles(),
        expectedFiles = []
            .concat(RANDOM_FILES.map(relativePath => path.join(TEST_PATH, movedSubdirectory, relativePath)))
            .concat(RANDOM_FILES.map(relativePath => path.join(TEST_PATH, copiedSubdirectory, relativePath)));

    expectedFiles.sort();

    return assert.deepStrictEqual(foundFiles, expectedFiles);
}

/**
 * _(RemovePath)_ Remove the entire test files tree
 */
async function testProtocol7_RemoveGeneratedFiles() {
    await RemovePath(TEST_PATH);

    return assert.rejects(() => getExistingGeneratedFiles());
}
