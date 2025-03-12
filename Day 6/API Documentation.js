// server.js
const express = require('express');
const fs = require('fs').promises; // Use the promise-based version of fs
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Create an Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Path to the users.json file
const usersFilePath = path.join(__dirname, 'users.json');

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'API for managing users',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server',
            },
        ],
    },
    apis: ['./server.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Helper function to read users from the file
async function readUsers() {
    const data = await fs.readFile(usersFilePath, 'utf8');
    return JSON.parse(data);
}

// Helper function to write users to the file
async function writeUsers(users) {
    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), 'utf8');
}

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error.
 */
app.get('/users', async (req, res) => {
    try {
        const users = await readUsers();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to read users' });
    }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Add a new user
 *     description: Add a new user to the list.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       201:
 *         description: User added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., missing or invalid fields).
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     description: Update an existing user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g., missing or invalid fields).
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete an existing user by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
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

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *       example:
 *         id: 1
 *         name: John Doe
 *     UserInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user.
 *       required:
 *         - name
 *       example:
 *         name: John Doe
 */

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API documentation available at http://localhost:${PORT}/api-docs`);
});