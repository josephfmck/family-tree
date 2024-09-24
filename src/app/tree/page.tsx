import React from 'react';
import FamilyTree from '@/components/Tree'; // Adjust the path as needed

export default function TreePage() {
  // Define the family data here
  const familyData = {
    name: "John",
    children: [
      {
        name: "Jack",
        children: [{ name: "Alice" }, { name: "Bob" }]
      },
      {
        name: "Anna",
        children: [{ name: "Sara" }]
      }
    ]
  };

  return (
    <div>
      <h1>Family Tree</h1>
      {/* Pass the familyData to the FamilyTree component */}
      <FamilyTree familyData={familyData} />
    </div>
  );
};


