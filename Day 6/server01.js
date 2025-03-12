// server.js
const express = require('express');

// Create an Express app
const app = express();

// Hardcoded JSON array of users
const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
];

// Define a route for the /users endpoint
app.get('/users', (req, res) => {
    res.json(users);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});