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
 *   delete:
 *     summary: Delete a student by ID
 *     description: Delete a specific student document based on the provided ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to delete.
 *     responses:
 *       200:
 *         description: Student deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 student:
 *                   $ref: '#/components/schemas/Student'
 *       400:
 *         description: Invalid ID format.
 *       404:
 *         description: Student not found.
 *       500:
 *         description: Internal server error.
 */
app.delete('/students/:id', async (req, res) => {
    try {
        const studentId = req.params.id;

        // Validate the ID format
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: 'Bad Request', message: 'Invalid ID format' });
        }

        // Find and delete the student by ID
        const student = await Student.findByIdAndDelete(studentId);

        // Check if the student exists
        if (!student) {
            return res.status(404).json({ error: 'Not Found', message: 'Student not found' });
        }

        // Respond with a success message and the deleted student
        res.status(200).json({ message: 'Student deleted successfully', student });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', message: 'Failed to delete student' });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});