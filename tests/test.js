// Node Modules
const path = require(`path`),
    fs = require(`fs`).promises;

// NPM Modules
const expect = require(`chai`).expect;
const assert = require(`assert`);

// Application Modules
const { EnsurePathForFile, ReadSubDirectories } = require(`../dist/fsutilities`);

const RANDOM_DIRECTORY = Math.floor(Math.random() * 100000);

describe(`Utilities`, function() {
    before(async function() {
        const testPath = path.join(process.cwd(), `tests`, `generated`);
        const testDirectories = await ReadSubDirectories(testPath);

        // Get the lowest-level directories, and recurse up to delete
        const removeDirectories = async (fsObjects) => {
            while (fsObjects.length > 0) {
                const nextObject = fsObjects.shift();

                if (nextObject.isDirectory) {
                    await removeDirectories(nextObject.items);

                    fs.rmdir(nextObject.objectPath);
                }
            }
        };

        removeDirectories(testDirectories);
    });

    describe(`ensurePath`, function() {
        it(`should create directories (./tests/generated/example & ./tests/generated/example/${RANDOM_DIRECTORY})`, function() {
            return assert.doesNotReject(() =>
                // Promise.reject(`failed`)
                EnsurePathForFile(path.join(process.cwd(), `tests`, `generated`, `example`, `${RANDOM_DIRECTORY}`, `dummyfile.txt`))
            );
        });

        it(`should read those directories, and confirm they exist`, function() {
            return ReadSubDirectories(path.join(process.cwd(), `tests`))
                .then(data => {
                    const fsName = data[0].items[0].items[0].fsName;
                    return assert.strictEqual(fsName, `` + RANDOM_DIRECTORY);
                });
        });
    });
});
