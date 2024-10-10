'use client';

import React from 'react';
import FamilyTree from '@/components/tree/FamilyTree'; // Adjust the path as needed
import { useAppData } from '@/hooks/useAppData';

export default function TreePage() {
    //* fetches all 3 and sets to rtk once
    const { isLoading, error } = useAppData();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;    


  return (
    <div>
      <h1>Family Tree</h1>
      {/* Pass the familyData to the FamilyTree component */}
      <FamilyTree />
    </div>
  );
};


