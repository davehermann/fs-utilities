# @davehermann/fs-utilities

*Personal file system utilities that someone else might find useful*

**July 2020**
+ Updated to Typescript, with typescript definitions included

## API

### #EnsurePathForFile(fullPathWithFile)

+ Creates any missing directories in the file system that appear within the path to the file

| Property | Type | Required | Notes |
| -------- | :--: | :------: | ----- |
| fullPathWithFile | string | **yes** | The absolute path to the to-be-created file |

### #ReadSubDirectories(pathToRead, options)

Reads all file system objects in a directory, and returns `fs.stat()` on each as well as nested subdirectories and their objects

| Property | Type | Required | Notes |
| -------- | :--: | :------: | ----- |
| pathToRead | string | **yes** | Directory to start reading |
| options | ReadOptions | no | Options for reading |

#### ReadOptions class
| Property | Type | Required | Notes |
| -------- | :--: | :------: | ----- |
| returnProperties | string[] | no | List of `fs.Stats` properties to return<ul><li>Returns all properties by default</li></ul>*See [NodeJS FS Stats class documentation](https://nodejs.org/dist/latest/docs/api/fs.html#fs_class_fs_stats) for your NodeJS version to see available properties* |
