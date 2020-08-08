interface IReadOptions {
    returnProperties: Array<string>;
}
interface IDirectoryObject {
    fsName: string;
    objectPath?: string;
    isDirectory?: boolean;
    stats?: Object;
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
