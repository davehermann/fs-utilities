// Utilities Modules
const { EnsurePathForFile } = require(`./utilities/ensurePath`);

// Library Modules
const appFs = require(`./fs`);

// Export utilities
module.exports.EnsurePathForFile = EnsurePathForFile;

// Promisified versions of FS methods
module.exports.fs = appFs;
