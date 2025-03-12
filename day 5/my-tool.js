// my-tool.js
const fs = require('fs');
const path = require('path');

// Get command-line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
    console.log("Usage: node my-tool.js <command> <filename>");
    console.log("Commands: create, delete");
    process.exit(1); // Exit with an error code
}

const command = args[0];
const filename = args[1];

if (!filename) {
    console.log("Error: Filename is required.");
    process.exit(1); // Exit with an error code
}

switch (command) {
    case 'create':
        createFile(filename);
        break;
    case 'delete':
        deleteFile(filename);
        break;
    default:
        console.log(`Error: Unknown command "${command}".`);
        console.log("Available commands: create, delete");
        process.exit(1); // Exit with an error code
}

// Function to create a file
function createFile(filename) {
    const filePath = path.join(__dirname, filename);

    if (fs.existsSync(filePath)) {
        console.log(`Error: File "${filename}" already exists.`);
        process.exit(1); // Exit with an error code
    }

    fs.writeFileSync(filePath, '', 'utf8');
    console.log(`File "${filename}" created successfully.`);
}

// Function to delete a file
function deleteFile(filename) {
    const filePath = path.join(__dirname, filename);

    if (!fs.existsSync(filePath)) {
        console.log(`Error: File "${filename}" does not exist.`);
        process.exit(1); // Exit with an error code
    }

    fs.unlinkSync(filePath);
    console.log(`File "${filename}" deleted successfully.`);
}