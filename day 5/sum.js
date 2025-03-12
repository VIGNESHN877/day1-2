// sum.js
const args = process.argv.slice(2); // Get command-line arguments (excluding 'node' and the script name)

if (args.length !== 2) {
    console.log("Usage: node sum.js <number1> <number2>");
    process.exit(1); // Exit with an error code
}

const num1 = parseFloat(args[0]);
const num2 = parseFloat(args[1]);

if (isNaN(num1) || isNaN(num2)) {
    console.log("Please provide valid numbers.");
    process.exit(1); // Exit with an error code
}

const sum = num1 + num2;
console.log(`The sum of ${num1} and ${num2} is: ${sum}`);