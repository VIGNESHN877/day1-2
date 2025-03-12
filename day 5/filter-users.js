// filter-users.js
const users = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 30 },
    { name: "Charlie", age: 20 },
    { name: "David", age: 35 },
    { name: "Eve", age: 22 }
];

// Function to filter users older than a specified age
function filterUsersOlderThan(users, age) {
    return users.filter(user => user.age > age);
}

// Example usage
const ageThreshold = 25;
const filteredUsers = filterUsersOlderThan(users, ageThreshold);

console.log(`Users older than ${ageThreshold}:`);
console.log(filteredUsers);