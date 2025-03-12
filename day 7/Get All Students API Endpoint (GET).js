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
 *     summary: Get all students
 *     description: Retrieve a list of all students from the database.
 *     responses:
 *       200:
 *         description: A list of students.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       500:
 *         description: Internal server error.
 */
app.get('/students', async (req, res) => {
    try {
        // Retrieve all students from the database
        const students = await Student.find();

        // Respond with the list of students
        res.status(200).json(students);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to retrieve students' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});