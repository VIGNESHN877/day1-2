import React from 'react';

function StudentName({ name }) {
  const style = {
    color: 'blue',
    fontSize: '24px',
  };
  return <p style={style}>Student Name: {name}</p>;
}

export default StudentName;