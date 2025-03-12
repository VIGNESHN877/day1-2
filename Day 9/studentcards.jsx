import React, { useState, useEffect } from 'react';

function StudentCard({ student }) {
  return (
    <div style={cardStyle}>
      <img src="https://via.placeholder.com/150" alt="Student" />
      <h3>{student.name}</h3>
      <p>ID: {student.id}</p>
    </div>
  );
}

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '16px',
  margin: '10px',
  width: '200px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
};

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/students')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Students</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {students.map((student) => (
          <StudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}

export default StudentList;