// server.js
const express = require('express');

// Create an Express app
const app = express();

// Define a route for the root URL ("/")
app.get('/', (req, res) => {
    res.json({ message: 'Hello World' });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});