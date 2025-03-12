// server.js
const express = require('express');

// Create an Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Hardcoded JSON array of users
let users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
];

// GET /users - Returns the list of users
app.get('/users', (req, res) => {
    res.json(users);
});

// POST /users - Adds a new user to the list
app.post('/users', (req, res) => {
    const newUser = req.body;

    // Validate the request body
    if (!newUser.name) {
        return res.status(400).json({ message: 'Name is required' });
    }

    // Generate a new ID for the user
    const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    newUser.id = newId;

    // Add the new user to the array
    users.push(newUser);

    // Respond with a success message
    res.status(201).json({ message: 'User added', user: newUser });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});