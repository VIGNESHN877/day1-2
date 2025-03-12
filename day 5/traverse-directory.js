// traverse-directory.js
const fs = require('fs');
const path = require('path');

// Function to recursively traverse a directory
function traverseDirectory(dir) {
    // Read the contents of the directory
    fs.readdir(dir, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${dir}:`, err);
            return;
        }

        // Iterate over each file/subdirectory
        files.forEach(file => {
            const filePath = path.join(dir, file);

            // Get file stats
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error(`Error getting stats for ${filePath}:`, err);
                    return;
                }

                if (stats.isDirectory()) {
                    // If it's a directory, recursively traverse it
                    console.log(`Directory: ${filePath}`);
                    traverseDirectory(filePath);
                } else if (stats.isFile()) {
                    // If it's a file, print its path
                    console.log(`File: ${filePath}`);
                }
            });
        });
    });
}

// Get the directory path from command-line arguments
const args = process.argv.slice(2);

if (args.length !== 1) {
    console.log("Usage: node traverse-directory.js <directory-path>");
    process.exit(1); // Exit with an error code
}

const directoryPath = args[0];

// Check if the provided path is a directory
fs.stat(directoryPath, (err, stats) => {
    if (err) {
        console.error(`Error accessing ${directoryPath}:`, err);
        process.exit(1); // Exit with an error code
    }

    if (!stats.isDirectory()) {
        console.error(`${directoryPath} is not a directory.`);
        process.exit(1); // Exit with an error code
    }

    // Start traversing the directory
    traverseDirectory(directoryPath);
});