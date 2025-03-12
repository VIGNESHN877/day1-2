import React, { useState } from 'react';
import StudentCard from './StudentCard';

function StudentList({ students }) {
  const [searchTerm, setSearchTerm] = useState('');

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
      {filteredStudents.map((student, index) => (
        <StudentCard
          key={index}
          name={student.name}
          major={student.major}
          year={student.year}
        />
      ))}
    </div>
  );
}

export default StudentList;