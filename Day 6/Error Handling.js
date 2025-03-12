// server.js
const express = require('express');
const fs = require('fs').promises; // Use the promise-based version of fs
const path = require('path');

// Create an Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Path to the users.json file
const usersFilePath = path.join(__dirname, 'users.json');

// Helper function to read users from the file
async function readUsers() {
    const data = await fs.readFile(usersFilePath, 'utf8');
    return JSON.parse(data);
}

// Helper function to write users to the file
async function writeUsers(users) {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
}

// GET /users - Returns the list of users
app.get('/users', async (req, res) => {
    try {
        const users = await readUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to read users' });
    }
});

// POST /users - Adds a new user to the list
app.post('/users', async (req, res) => {
    try {
        const newUser = req.body;

        // Validate the request body
        if (!newUser.name) {
            return res.status(400).json({ error: 'Bad Request', message: 'Name is required' });
        }

        if (typeof newUser.name !== 'string') {
            return res.status(400).json({ error: 'Bad Request', message: 'Name must be a string' });
        }

        // Read the current users
        const users = await readUsers();

        // Generate a new ID for the user
        const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
        newUser.id = newId;

        // Add the new user to the array
        users.push(newUser);

        // Write the updated users back to the file
        await writeUsers(users);

        // Respond with a success message
        res.status(201).json({ message: 'User added', user: newUser });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to add user' });
    }
});

// PUT /users/:id - Updates an existing user
app.put('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const updatedUser = req.body;

        // Validate the request body
        if (!updatedUser.name) {
            return res.status(400).json({ error: 'Bad Request', message: 'Name is required' });
        }

        if (typeof updatedUser.name !== 'string') {
            return res.status(400).json({ error: 'Bad Request', message: 'Name must be a string' });
        }

        // Read the current users
        const users = await readUsers();

        // Find the user to update
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Not Found', message: 'User not found' });
        }

        // Update the user
        users[userIndex] = { ...users[userIndex], ...updatedUser };

        // Write the updated users back to the file
        await writeUsers(users);

        // Respond with a success message
        res.json({ message: 'User updated', user: users[userIndex] });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update user' });
    }
});

// DELETE /users/:id - Deletes an existing user
app.delete('/users/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);

        // Read the current users
        const users = await readUsers();

        // Find the user to delete
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Not Found', message: 'User not found' });
        }

        // Remove the user from the array
        const deletedUser = users.splice(userIndex, 1)[0];

        // Write the updated users back to the file
        await writeUsers(users);

        // Respond with a success message
        res.json({ message: 'User deleted', user: deletedUser });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to delete user' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});