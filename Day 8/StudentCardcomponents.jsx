import React from 'react';
import StudentCard from './StudentCard';

function StudentList({ students }) {
  return (
    <div>
      {students.map((student, index) => (
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