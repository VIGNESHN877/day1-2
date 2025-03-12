// server.js
const express = require('express');
const mongoose = require('mongoose');

// Create an Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Define the Student schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    major: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true }, // Ensure rollNo is unique
});

// Create the Student model
const Student = mongoose.model('Student', studentSchema);

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students with pagination
 *     description: Retrieve a paginated list of students.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: The page number (default is 1).
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: The number of students per page (default is 10).
 *     responses:
 *       200:
 *         description: A paginated list of students.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalStudents:
 *                   type: integer
 *                   description: The total number of students.
 *                 totalPages:
 *                   type: integer
 *                   description: The total number of pages.
 *                 currentPage:
 *                   type: integer
 *                   description: The current page number.
 *                 pageSize:
 *                   type: integer
 *                   description: The number of students per page.
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *       500:
 *         description: Internal server error.
 */
app.get('/students', async (req, res) => {
    try {
        // Parse query parameters
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const pageSize = parseInt(req.query.pageSize) || 10; // Default to 10 students per page

        // Validate query parameters
        if (page < 1 || pageSize < 1 || pageSize > 100) {
            return res.status(400).json({ error: 'Bad Request', message: 'Invalid page or pageSize values' });
        }

        // Calculate the number of documents to skip
        const skip = (page - 1) * pageSize;

        // Retrieve the total number of students
        const totalStudents = await Student.countDocuments();

        // Retrieve the paginated list of students
        const students = await Student.find()
            .skip(skip)
            .limit(pageSize);

        // Calculate the total number of pages
        const totalPages = Math.ceil(totalStudents / pageSize);

        // Respond with the paginated data
        res.status(200).json({
            totalStudents,
            totalPages,
            currentPage: page,
            pageSize,
            students,
        });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to retrieve students' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});