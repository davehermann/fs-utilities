# @davehermann/fs-utilities

*Personal file system utilities that someone else might find useful*

**July 2020**
+ Updated to Typescript, with typescript definitions included

## CLI

+ **New in 1.0.0**
+ Perfect for `package.json` pre/post-build scripts' file management with Typescript
+ Works on files or directories
+ Gracefully skips missing paths

*Installs as **fsutility** locally or globally*

### Copy
`fsutility copy path-to-source path-to-destination`

### Delete
`fsutility delete path-to-object`

### Move
`fsutility move path-to-source path-to-destination`

## API

### #CopyPath(sourcePath, destinationPath, verbose)

+ Copy file/directory specified by `sourcePath` to `destinationPath`

| Property | Type | Required | Notes |
| -------- | :--: | :------: | ----- |
| sourcePath | string | **yes** | absolute path to the file system object to be copied |
| destinationPath | string | **yes** | absolute path to the file system location where the copy will reside |
| verbose | boolean | no<br />*Default:* **false** | Output copy steps to console |

### #EnsurePathForFile(fullPathWithFile)

+ Creates any missing directories in the file system that appear within the path to the file

| Property | Type | Required | Notes |
| -------- | :--: | :------: | ----- |
| fullPathWithFile | string | **yes** | The absolute path to the to-be-created file |

### #MovePath(sourcePath, destinationPath, verbose)

+ Move file/directory specified by `sourcePath` to `destinationPath`

| Property | Type | Required | Notes |
| -------- | :--: | :------: | ----- |
| sourcePath | string | **yes** | absolute path to the file system object currently |
| destinationPath | string | **yes** | absolute path to the file system location for future use |
| verbose | boolean | no<br />*Default:* **false** | Output move steps to console |

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

### #RemovePath(fileSystemPath, verbose)

+ Delete file/directory specified by `fileSystemPath`

| Property | Type | Required | Notes |
| -------- | :--: | :------: | ----- |
| fileSystemPath | string | **yes** | absolute path to the file system object |
| verbose | boolean | no<br />*Default:* **false** | Output remove steps to console |
