// file-stats.js
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2); // Get command-line arguments (excluding 'node' and the script name)

if (args.length !== 1) {
    console.log("Usage: node file-stats.js <file-path>");
    process.exit(1); // Exit with an error code
}

const filePath = args[0];

// Check if the file exists
if (!fs.existsSync(filePath)) {
    console.log("File does not exist.");
    process.exit(1); // Exit with an error code
}

// Get file stats
fs.stat(filePath, (err, stats) => {
    if (err) {
        console.log("Error reading file stats:", err);
        process.exit(1); // Exit with an error code
    }

    // File size in bytes
    const fileSize = stats.size;

    // Creation date (birthtime)
    const creationDate = stats.birthtime;

    // Last modified date
    const lastModifiedDate = stats.mtime;

    console.log(`File: ${path.basename(filePath)}`);
    console.log(`Size: ${fileSize} bytes`);
    console.log(`Created: ${creationDate}`);
    console.log(`Last Modified: ${lastModifiedDate}`);
});