const HELP_TEXT =
`
@davehermann/fs-utilities Command Line Usage

fsutility <action> <options>

Available <action>s

delete      -   Delete a file or directory, if it exists

                <options>
                **REQUIRED**
                -   path-to-object - path to the file system object to delete
`;

function displayHelp() {
    console.log(HELP_TEXT);
}

export {
    displayHelp as DisplayHelp,
};
