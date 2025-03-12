// promise-chain.js
const fs = require('fs').promises; // Use the promise-based version of fs

// Function to read a file
function readFile(filePath) {
    return fs.readFile(filePath, 'utf8')
        .then(data => {
            console.log(`File "${filePath}" read successfully.`);
            return data;
        })
        .catch(err => {
            console.error(`Error reading file "${filePath}":`, err);
            throw err; // Propagate the error
        });
}

// Function to process the content (e.g., convert to uppercase)
function processContent(content) {
    return new Promise((resolve, reject) => {
        try {
            const processedContent = content.toUpperCase();
            console.log('Content processed successfully.');
            resolve(processedContent);
        } catch (err) {
            console.error('Error processing content:', err);
            reject(err);
        }
    });
}

// Function to write to a file
function writeFile(filePath, content) {
    return fs.writeFile(filePath, content, 'utf8')
        .then(() => {
            console.log(`File "${filePath}" written successfully.`);
        })
        .catch(err => {
            console.error(`Error writing to file "${filePath}":`, err);
            throw err; // Propagate the error
        });
}

// Main function to chain the operations
function main() {
    const inputFilePath = 'input.txt';
    const outputFilePath = 'output.txt';

    readFile(inputFilePath)
        .then(processContent)
        .then(processedContent => writeFile(outputFilePath, processedContent))
        .then(() => {
            console.log('All operations completed successfully.');
        })
        .catch(err => {
            console.error('An error occurred:', err);
        });
}

// Run the main function
main();