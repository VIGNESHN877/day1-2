import React, { useState } from 'react';
import StudentCard from './StudentCard';

function StudentList() {
  const [students, setStudents] = useState([
    { name: 'John Doe', major: 'Computer Science', year: 'Freshman' },
    { name: 'Jane Smith', major: 'Mathematics', year: 'Sophomore' },
  ]);
  const [newStudent, setNewStudent] = useState({ name: '', major: '', year: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleAddStudent = () => {
    if (newStudent.name && newStudent.major && newStudent.year) {
      setStudents([...students, newStudent]);
      setNewStudent({ name: '', major: '', year: '' }); // Reset form
    }
  };

  const handleRemoveStudent = (index) => {
    const updatedStudents = students.filter((_, i) => i !== index);
    setStudents(updatedStudents);
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '16px', padding: '8px' }}
      />
      <div>
        <input
          type="text"
          placeholder="Name"
          value={newStudent.name}
          onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Major"
          value={newStudent.major}
          onChange={(e) => setNewStudent({ ...newStudent, major: e.target.value })}
        />
        <input
          type="text"
          placeholder="Year"
          value={newStudent.year}
          onChange={(e) => setNewStudent({ ...newStudent, year: e.target.value })}
        />
        <button onClick={handleAddStudent}>Add Student</button>
      </div>
      {filteredStudents.map((student, index) => (
        <div key={index} style={{ position: 'relative' }}>
          <StudentCard
            name={student.name}
            major={student.major}
            year={student.year}
          />
          <button
            onClick={() => handleRemoveStudent(index)}
            style={{ position: 'absolute', top: '10px', right: '10px' }}
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default StudentList;