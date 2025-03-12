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
 * /students/search:
 *   get:
 *     summary: Search students by roll number or student ID
 *     description: Retrieve a list of students whose roll number or student ID matches the search query (case-insensitive).
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: The roll number or student ID to search for.
 *     responses:
 *       200:
 *         description: A list of matching students.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       500:
 *         description: Internal server error.
 */
app.get('/students/search', async (req, res) => {
    try {
        const searchQuery = req.query.q;

        // Validate the search query
        if (!searchQuery) {
            return res.status(400).json({ error: 'Bad Request', message: 'Search query is required' });
        }

        // Perform a case-insensitive search for students matching the rollNo
        const students = await Student.find({
            rollNo: { $regex: searchQuery, $options: 'i' }, // Case-insensitive regex search
        });

        // Respond with the list of matching students
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to search students' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});