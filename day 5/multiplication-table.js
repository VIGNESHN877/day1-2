// multiplication-table.js
const args = process.argv.slice(2); // Get command-line arguments (excluding 'node' and the script name)

if (args.length !== 1) {
    console.log("Usage: node multiplication-table.js <number>");
    process.exit(1); // Exit with an error code
}

const num = parseFloat(args[0]);

if (isNaN(num)) {
    console.log("Please provide a valid number.");
    process.exit(1); // Exit with an error code
}

console.log(`Multiplication table for ${num}:`);
for (let i = 1; i <= 10; i++) {
    console.log(`${num} x ${i} = ${num * i}`);
}