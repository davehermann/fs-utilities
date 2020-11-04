/** Options for reading subdirectories */
interface IReadOptions {
    /**
     * List of properties to return in the data object from NodeJS fs module's `Stats` class
     *
     * @remarks
     * See the [NodeJS FS Stats class documentation](https://nodejs.org/dist/latest/docs/api/fs.html#fs_class_fs_stats) for your NodeJS version to get a list of available properties
     */
    returnProperties: Array<string>;
}
/** Directory data */
interface IDirectoryObject {
    /** Name of the object within the current path */
    fsName: string;
    /** Absolute path to the object */
    objectPath?: string;
    /** Is the object a directory? */
    isDirectory?: boolean;
    /** The FS Stats class for the object, or the sub-set of properties in the IReadOptions parameters */
    stats?: Object;
    /** For a directory, the list of file system objects within that directory */
    items?: Array<IDirectoryObject>;
}
/**
 * Read the items in a directory, and traverse subdirectories
 * @param pathToRead - Root path to check
 * @param options - Read options
 * @returns List of found file system objects, with stat properties, subdirectories supply the same data
 */
declare function readSubDirectories(pathToRead: string, options?: IReadOptions): Promise<Array<IDirectoryObject>>;
export { IDirectoryObject, IReadOptions, readSubDirectories as ReadSubDirectories, };
