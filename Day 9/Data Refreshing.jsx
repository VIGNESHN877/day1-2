import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(6);

  const fetchStudents = () => {
    fetch('/api/students')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data. Please try again later.');
        }
        return response.json();
      })
      .then(data)
    }}