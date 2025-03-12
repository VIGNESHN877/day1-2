import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function StudentCard({ student }) {
  return (
    <div className="card" style={{ width: '18rem', margin: '10px' }}>
      <img src="https://via.placeholder.com/150" className="card-img-top" alt="Student" />
      <div className="card-body">
        <h5 className="card-title">{student.name}</h5>
        <p className="card-text">ID: {student.id}</p>
        <p className="card-text">Email: {student.email}</p>
        <p className="card-text">Major: {student.major}</p>
        <p className="card-text">Year: {student.year}</p>
      </div>
    </div>
  );
}

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
    <div className="container">
      <h1>Students</h1>
      <div className="row">
        {students.map((student) => (
          <div className="col-md-4" key={student.id}>
            <StudentCard student={student} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default StudentList;