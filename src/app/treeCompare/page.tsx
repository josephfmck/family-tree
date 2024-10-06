'use client';

import React from 'react';
import FamilyTree from '@/components/TreeCompare'; // Adjust the path as needed
import { useAppData } from '@/hooks/useAppData';

export default function TreeComparePage() {
    //* fetches all 3 and sets to rtk once
    const { isLoading, error } = useAppData();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;   
    
    const familyData = {
      name: "Grandparent",
      children: [
        {
          name: "Parent 1",
          children: [
            {
              name: "Child 1",
              siblings: [
                { name: "Child 2" },
                { name: "Child 3" }
              ]
            },
            {
              name: "Child 4",
              siblings: [
                { name: "Child 5" },
                { name: "Child 6" }
              ]
            }
          ]
        },
        {
          name: "Parent 2",
          siblings: [
            { name: "Parent 3" },
            { name: "Parent 4" }
          ],
          children: [
            {
              name: "Child 7",
              siblings: [
                { name: "Child 8" },
                { name: "Child 9" }
              ]
            }
          ]
        },
        {
          name: "Parent 5",
          children: [
            {
              name: "Child 10",
              siblings: [
                { name: "Child 11" },
                { name: "Child 12" }
              ]
            }
          ]
        }
      ]
    };
    
  return (
    <div>
      {/* Pass the familyData to the FamilyTree component */}
      <FamilyTree familyData={familyData}/>
    </div>
  );
};


