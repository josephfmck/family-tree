'use client';

import React from 'react';
import FamilyTree from '@/components/TreeCompare'; // Adjust the path as needed
import { useAppData } from '@/hooks/useAppData';

export default function TreeComparePage() {
    //* fetches all 3 and sets to rtk once
    const { isLoading, error } = useAppData();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;   
    
  return (
    <div>
      {/* Pass the familyData to the FamilyTree component */}
      <FamilyTree />
    </div>
  );
};


