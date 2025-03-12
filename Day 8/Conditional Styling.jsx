import React from 'react';

function StudentCard({ name, major, year }) {
  const getBackgroundColor = (year) => {
    switch (year) {
      case 'Freshman':
        return 'lightgreen';
      case 'Sophomore':
        return 'lightyellow';
      case 'Junior':
        return 'lightblue';
      case 'Senior':
        return 'lightpink';
      default:
        return 'white';
    }
  };

  const cardStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
    margin: '10px',
    width: '200px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: getBackgroundColor(year),
  };

  return (
    <div style={cardStyle}>
      <h3>{name}</h3>
      <p>Major: {major}</p>
      <p>Year: {year}</p>
    </div>
  );
}

export default StudentCard;