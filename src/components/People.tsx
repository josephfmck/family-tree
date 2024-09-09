

'use client';

import { useState, useEffect } from 'react';
import Person from './Person';

interface PersonType {
  id: number;
  first_name: string;
  last_name: string;
}

async function fetchPersons() {
  const response = await fetch('/api/persons/read');
  if (!response.ok) throw new Error('Failed to fetch persons');
  return response.json();
}

export default function People() {
  const [persons, setPersons] = useState<PersonType[]>([]);

  //! hooks
  useEffect(() => {
    fetchPersons().then(setPersons).catch(e => console.error('Error fetching persons:', e));
  }, []);

  //! event handlers
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/persons/delete/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete person');
      setPersons(persons.filter(person => person.id !== id));
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };


  //! positioning logic
  const centerX = 400; // Adjust based on your layout
  const centerY = 300; // Adjust based on your layout
  const radius = 200; // Radius of the circle on which bubbles are placed

  //! render
  return (
<div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      overflow: 'hidden'
    }}>
      <div style={{ 
        position: 'absolute', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        width: '800px', 
        height: '600px'
      }}>
        {persons.map((person, index) => {
          let x, y;
          if (index === 0) {
            x = centerX;
            y = centerY;
          } else {
            const angle = ((index - 1) / (persons.length - 1)) * Math.PI;
            x = centerX + radius * Math.cos(angle);
            y = centerY - radius * Math.sin(angle);
          }
          return <Person key={person.id} {...person} x={x} y={y} isYou={index === 0} onDelete={handleDelete} />;
        })}
      </div>
    </div>
  );
}