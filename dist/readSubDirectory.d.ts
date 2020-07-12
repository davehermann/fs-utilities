interface ReadOptions {
    returnProperties: Array<string>;
}
interface DirectoryObject {
    fsName: string;
    objectPath?: string;
    isDirectory?: boolean;
    stats?: Object;
    items?: Array<DirectoryObject>;
}
/**
 * Read the items in a directory, and traverse subdirectories
 * @param pathToRead - Root path to check
 * @param options - Read options
 * @returns List of found file system objects, with stat properties, subdirectories supply the same data
 */
declare function readSubDirectories(pathToRead: string, options: ReadOptions): Promise<Array<DirectoryObject>>;
export { readSubDirectories as ReadSubDirectories, };
