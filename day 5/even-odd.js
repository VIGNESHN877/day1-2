// even-odd.js
const args = process.argv.slice(2); // Get command-line arguments (excluding 'node' and the script name)

if (args.length !== 1) {
    console.log("Usage: node even-odd.js <number>");
    process.exit(1); // Exit with an error code
}

const num = parseFloat(args[0]);

if (isNaN(num)) {
    console.log("Please provide a valid number.");
    process.exit(1); // Exit with an error code
}

if (num % 2 === 0) {
    console.log("Even");
} else {
    console.log("Odd");
}