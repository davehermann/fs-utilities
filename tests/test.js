// Node Modules
const path = require(`path`);

// NPM Modules
const expect = require(`chai`).expect;
const assert = require(`assert`);

// Application Modules
const { EnsurePathForFile, ReadSubDirectories } = require(`../pathgen`);

describe(`Utilities`, function() {
    describe(`ensurePath`, function() {
        it(`should create directories`, function() {
            return assert.doesNotReject(() =>
                // Promise.reject(`failed`)
                EnsurePathForFile(path.join(process.cwd(), `tests`, `generated`, `example`, `1`, `dummyfile.txt`))
            );
        });

        it(`should read those directories, and confirm they exist`, function() {
            return assert.doesNotReject(() => {
                return ReadSubDirectories(path.join(process.cwd(), `tests`))
                    .then(data => { console.log(data); })
                    .catch(err => { console.log(err); })
            });
        });
    });
});
