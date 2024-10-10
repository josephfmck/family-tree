'use client';
import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import SVGCanvas from './SVGCanvas';
import Tooltip from './Tooltip'; 

const FamilyTree = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Fetch persons and relationships from Redux store
  const persons = useSelector((state: RootState) => state.persons);
  const relationships = useSelector((state: RootState) => state.relationships);
  const relationshipTypes = useSelector((state: RootState) => state.relationshipTypes);

  if (
    !persons ||
    !relationships ||
    !relationshipTypes ||
    persons.length === 0 ||
    relationships.length === 0 ||
    relationshipTypes.length === 0
  ) {
    console.log('Data not loaded yet.');
    return null;
  }

  return (
    <div id="tooltip-container" style={{ position: 'relative' }}>
      <SVGCanvas
        svgRef={svgRef}
        persons={persons}
        relationships={relationships}
        relationshipTypes={relationshipTypes}
      />
      <Tooltip />
    </div>
  );
};

export default FamilyTree;
