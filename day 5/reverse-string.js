// reverse-string.js
const args = process.argv.slice(2); // Get command-line arguments (excluding 'node' and the script name)

if (args.length !== 1) {
    console.log("Usage: node reverse-string.js <string>");
    process.exit(1); // Exit with an error code
}

const inputString = args[0];

if (typeof inputString !== 'string') {
    console.log("Please provide a valid string.");
    process.exit(1); // Exit with an error code
}

const reversedString = inputString.split('').reverse().join('');
console.log(`Reversed string: ${reversedString}`);