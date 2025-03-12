// server.js
const http = require('http');

// Create a server
const server = http.createServer((req, res) => {
    // Set the response header
    res.setHeader('Content-Type', 'text/html');

    // Handle different routes
    if (req.url === '/') {
        res.statusCode = 200;
        res.end('<h1>Welcome to the Home Page</h1>');
    } else if (req.url === '/about') {
        res.statusCode = 200;
        res.end('<h1>About Us</h1><p>We are a team of developers.</p>');
    } else if (req.url === '/contact') {
        res.statusCode = 200;
        res.end('<h1>Contact Us</h1><p>Email us at contact@example.com</p>');
    } else {
        res.statusCode = 404;
        res.end('<h1>Page Not Found</h1><p>The page you are looking for does not exist.</p>');
    }
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});