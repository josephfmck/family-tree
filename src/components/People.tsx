

'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';

import { setPersons } from '../store/slices/personsSlice';

import Person from './Person';

// async function fetchPersons() {
//   const response = await fetch('/api/persons/read');
//   if (!response.ok) throw new Error('Failed to fetch persons');
//   return response.json();
// }

export default function People() {
  const dispatch = useDispatch();
  const persons = useSelector((state: RootState) => state.persons);
  

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
          return <Person key={person.id} {...person} x={x} y={y} isYou={index === 0} />;
        })}
      </div>
    </div>
  );
}