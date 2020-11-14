const HELP_TEXT =
`
@davehermann/fs-utilities Command Line Usage

fsutility <action> <options>

**All paths below can be relative or absolute**

Available <action>s

copy    -   Copy a file or directory, if it exists
            - This will DELETE an existing file/directory at the destination

            <options>
            **REQUIRED**
            - path-to-source - path to the file system object to be moved
            - path-to-destination - final path of the file system object

            *Usage*
            fsutility copy path-to-source path-to-destination

delete  -   Delete a file or directory, if it exists

            <options>
            **REQUIRED**
            - path-to-object - path to the file system object to delete

            *Usage*
            fsutility delete path-to-object

move    -   Move a file or directory, if it exists
            - This will DELETE an existing file/directory at the destination

            <options>
            **REQUIRED**
            - path-to-source - path to the file system object to be moved
            - path-to-destination - final path of the file system object

            *Usage*
            fsutility move path-to-source path-to-destination
`;

function displayHelp() {
    console.log(HELP_TEXT);
}

export {
    displayHelp as DisplayHelp,
};
