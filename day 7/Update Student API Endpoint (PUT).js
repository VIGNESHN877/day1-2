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
 *   put:
 *     summary: Update a student by ID
 *     description: Update a specific student document based on the provided ID and request body. Ensures the rollNo is unique.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to update.
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
 *     responses:
 *       200:
 *         description: Student updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       400:
 *         description: Bad request (e.g., invalid ID format or missing fields).
 *       404:
 *         description: Student not found.
 *       409:
 *         description: Conflict (e.g., duplicate rollNo).
 *       500:
 *         description: Internal server error.
 */
app.put('/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;
        const { name, age, major, rollNo } = req.body;

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: 'Bad Request', message: 'Invalid ID format' });
        }

        // Validate the request body
        if (!name && !age && !major && !rollNo) {
            return res.status(400).json({ error: 'Bad Request', message: 'At least one field (name, age, major, rollNo) is required' });
        }

        // Find the student by ID
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Not Found', message: 'Student not found' });
        }

        // Check if the new rollNo conflicts with another student
        if (rollNo && rollNo !== student.rollNo) {
            const existingStudent = await Student.findOne({ rollNo });
            if (existingStudent) {
                return res.status(409).json({ error: 'Conflict', message: 'A student with the same rollNo already exists' });
            }
        }

        // Update the student document
        if (name) student.name = name;
        if (age) student.age = age;
        if (major) student.major = major;
        if (rollNo) student.rollNo = rollNo;

        await student.save();

        // Respond with the updated student document
        res.status(200).json({ message: 'Student updated successfully', student });
    } catch (err) {
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Bad Request', message: err.message });
        }
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to update student' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});