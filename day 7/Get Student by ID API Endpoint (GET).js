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
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     description: Retrieve a specific student document based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to retrieve.
 *     responses:
 *       200:
 *         description: The student document.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid ID format.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Internal server error.
 */
app.get('/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: 'Bad Request', message: 'Invalid ID format' });
        }

        // Find the student by ID
        const student = await Student.findById(studentId);

        // Check if the student exists
        if (!student) {
            return res.status(404).json({ error: 'Not Found', message: 'Student not found' });
        }

        // Respond with the student document
        res.status(200).json(student);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to retrieve student' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});