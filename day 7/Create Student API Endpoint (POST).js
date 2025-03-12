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
 *   post:
 *     summary: Add a new student
 *     description: Add a new student to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               major:
 *                 type: string
 *               rollNo:
 *                 type: string
 *             required:
 *               - name
 *               - age
 *               - major
 *               - rollNo
 *     responses:
 *       201:
 *         description: Student added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 studentId:
 *                   type: string
 *       400:
 *         description: Bad request (e.g., missing or invalid fields).
 *       409:
 *         description: Conflict (e.g., duplicate rollNo).
 *       500:
 *         description: Internal server error.
 */
app.post('/students', async (req, res) => {
    try {
        const { name, age, major, rollNo } = req.body;

        // Validate the request body
        if (!name || !age || !major || !rollNo) {
            return res.status(400).json({ error: 'Bad Request', message: 'All fields (name, age, major, rollNo) are required' });
        }

        // Check if a student with the same rollNo already exists
        const existingStudent = await Student.findOne({ rollNo });
        if (existingStudent) {
            return res.status(409).json({ error: 'Conflict', message: 'A student with the same rollNo already exists' });
        }

        // Create a new student
        const newStudent = new Student({ name, age, major, rollNo });
        await newStudent.save();

        // Respond with a success message and the student's ID
        res.status(201).json({ message: 'Student added successfully', studentId: newStudent._id });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Bad Request', message: err.message });
        }
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to add student' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});