/**
 * Ensure the full directory path exists before writing a file
 * @param fullPathWithFile - The complete absolute path to the to-be-created file
 */
declare function ensurePath(fullPathWithFile: string): Promise<void>;
export { ensurePath as EnsurePathForFile, };
