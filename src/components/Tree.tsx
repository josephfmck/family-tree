'use client';

import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useGetRelationshipNamesQuery } from '@/store/api/relationshipNamesApi';
import { useGetRelationshipTypesQuery } from '@/store/api/relationshipTypesApi';
import { useGetPersonsQuery } from '@/store/api/personsApi';
import { useGetRelationshipsQuery } from '@/store/api/relationshipsApi';

// ! DATABASE TYPES
// Defining the structure of a person based on your SQL schema
interface Person {
  id: string;
  first_name: string;
  last_name: string;
}

// Defining the structure of a relationship based on your SQL schema
interface Relationship {
  person_id_1: string;
  person_id_2: string;
  relationship_type_id: string;
}

// Defining the structure of relationship types based on your SQL schema
interface RelationshipType {
  id: string;
  relationship: string;
}

const familyData = {
  name: 'Grandparent',
  children: [
    {
      name: 'Parent',
      children: [
        { name: 'Child' },
        { name: 'Sibling' },
      ],
    },
  ],
}

// Helper function to reverse relationships for the bidirectional map
const reverseRelationship = (relationship: string): string => {
  const reverseMap: Record<string, string> = {
    Parent: 'Child',
    Child: 'Parent',
    Sibling: 'Sibling',
    Grandparent: 'Grandchild',
    Grandchild: 'Grandparent',
    'Aunt/Uncle': 'Niece/Nephew',
    'Niece/Nephew': 'Aunt/Uncle',
    Cousin: 'Cousin',
    'Great-Grandparent': 'Great-Grandchild',
    'Great-Grandchild': 'Great-Grandparent'
  };

  return reverseMap[relationship] || relationship; // If no reverse is found, return the same relationship
};

// Helper function to build a relationship map
const buildRelationshipMap = (
  relationships: Relationship[],
  relationshipTypes: RelationshipType[]
) => {
  const relationshipMap: Record<string, Record<string, string>> = {};

  relationships.forEach((relationship) => {
    const relationshipType = relationshipTypes.find(
      (type) => type.id === relationship.relationship_type_id
    );

    if (!relationshipType) {
      console.log('Missing relationshipType for relationship:', relationship); // Debugging log
      return;
    }

    if (!relationshipMap[relationship.person_id_1]) {
      relationshipMap[relationship.person_id_1] = {};
    }

    if (!relationshipMap[relationship.person_id_2]) {
      relationshipMap[relationship.person_id_2] = {};
    }

    // Reverse mapping for a more complete bidirectional relationship graph
    relationshipMap[relationship.person_id_1][relationship.person_id_2] = relationshipType.relationship;
    relationshipMap[relationship.person_id_2][relationship.person_id_1] = reverseRelationship(relationshipType.relationship);

    // Log the relationship being added for debugging purposes
    console.log(`Mapping: ${relationship.person_id_1} -> ${relationship.person_id_2} as ${relationshipType.relationship}`);
    console.log(`Reverse Mapping: ${relationship.person_id_2} -> ${relationship.person_id_1} as ${reverseRelationship(relationshipType.relationship)}`);

  });

  // Log the final relationshipMap after processing all relationships
  console.log('Final Relationship Map:', relationshipMap);

  return relationshipMap;
};

// Helper function to convert persons and relationships into hierarchical structure
const convertToHierarchy = (
  persons: Person[],
  relationshipMap: Record<string, Record<string, string>>
) => {
  const personMap = new Map();
  persons.forEach((person) => {
    personMap.set(person.id, { ...person, children: [] });
  });

  let root: any;

  persons.forEach((person) => {
    const relations = relationshipMap[person.id];
    if (relations) {
      Object.keys(relations).forEach((relatedPersonId) => {
        const relationship = relations[relatedPersonId];
        const relatedPerson = personMap.get(relatedPersonId);

        if (relationship === "Parent") {
          // The current person is the child of relatedPerson
          if (!relatedPerson.children) relatedPerson.children = [];
          relatedPerson.children.push(personMap.get(person.id));
        } else if (relationship === "Child") {
          // The current person is the parent of relatedPerson
          if (!personMap.get(person.id).children)
            personMap.get(person.id).children = [];
          personMap.get(person.id).children.push(relatedPerson);
        }
      });
    } else {
      // Handle case where no known relationships, assume as root
      if (!root) root = personMap.get(person.id);
    }
  });

  console.log('5. Family Hierarchy:', root); // Debug log for the root of the family hierarchy

  return root || { first_name: 'Unknown', last_name: '', children: [] };
};

const FamilyTree = () => {

  //! FETCH
  // Fetch persons, relationships, and relationshipTypes from Redux store using RTK Query
  const { data: persons, error: personsError, isLoading: isPersonsLoading } = useGetPersonsQuery();
  const { data: relationships, error: relationshipsError, isLoading: isRelationshipsLoading } = useGetRelationshipsQuery();
  const { data: relationshipTypes, error: relationshipTypesError, isLoading: isRelationshipTypesLoading } = useGetRelationshipTypesQuery();
  const { data: relationshipNames, error: relationshipNamesError, isLoading: isRelationshipNamesLoading } = useGetRelationshipNamesQuery();

  // Log errors if any exist
  if (personsError || relationshipsError || relationshipTypesError || relationshipNamesError) {
    console.error("Error loading data:", personsError, relationshipsError, relationshipTypesError, relationshipNamesError);
    return <div>Error loading data</div>;
  }

  // Handle loading state
  if (isPersonsLoading || isRelationshipsLoading || isRelationshipTypesLoading || isRelationshipNamesLoading) {
    return <div>Loading...</div>;
  }

  // Check if data is available
  if (!persons || !relationships || !relationshipTypes || !relationshipNames) {
    return <div>Data is unavailable</div>;
  }

  console.log(persons, relationships, relationshipTypes);

  // Build the relationship map
  const relationshipMap = buildRelationshipMap(relationships, relationshipTypes);

  // Convert persons and relationships into hierarchical structure
  const familyHierarchy = convertToHierarchy(persons, relationshipMap);
  // Debug log for hierarchy after conversion
  console.log('9. Final Family Hierarchy:', familyHierarchy);

  // Set up the SVG for D3 rendering
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current || !familyHierarchy) return;

    // Set up the dimensions
    const width = 600;
    const height = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create a D3 tree layout
    const treeLayout = d3.tree<Person>().size([width - margin.left - margin.right, height - margin.top - margin.bottom]);

    // Create D3 hierarchy from the family data
    const root = d3.hierarchy<Person>(familyHierarchy);
    const treeData = treeLayout(root);

    console.log('11. Tree Data:', treeData); // Debug log for tree data after layout

    // !LINKS
    svg.selectAll('.link')
      .data(treeData.links())
      .enter().append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 2)
      .attr(
        'd', d3.linkVertical<d3.HierarchyPointLink<Person>, [number, number]>()
          .source((d) => {
            console.log('12. Link Source:', d.source); // Debug log for link source
            return [d.source.x, d.source.y];
          })
          .target((d) => {
            console.log('13. Link Target:', d.target); // Debug log for link target
            return [d.target.x, d.target.y];
          })
      );

    // !NODES
    svg.selectAll('.sibling-link')
      .data(treeData.descendants().filter(d => d.parent && d.parent.children && d.parent.children.length > 1))
      .enter()
      .append('path')
      .attr('class', 'sibling-link')
      .attr('fill', 'none')
      .attr('stroke', '#999')
      .attr('stroke-width', 2)
      .attr(
        'd',
        d => {
          const siblings = d.parent?.children;
          if (siblings && siblings.length > 1) {
            const siblingIndex = siblings.indexOf(d);
            const prevSibling = siblings[siblingIndex - 1];
            return `M${prevSibling.x},${prevSibling.y} H${d.x}`;
          }
          return '';
        }
      );

    // Create the nodes (circles and text)
    const node = svg
      .selectAll('.node')
      .data(treeData.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d) => {
        console.log('14. Node Position:', d); // Debug log for node positions
        return `translate(${d.x},${d.y})`;
      });

    node.append('circle').attr('r', 10).attr('fill', 'steelblue');

    node
      .append('text')
      .attr('dy', '.35em')
      .attr('x', (d) => (d.children ? -15 : 15))
      .style('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .text(d => {
        console.log('15. Node Text:', d.data.first_name, d.data.last_name); // Debug log for node text
        return `${d.data.first_name} ${d.data.last_name}`;
      });

    // Handle unrelated persons (if any)
    const unrelatedGroup = svg.append('g').attr('class', 'unrelated-group');
    unrelatedGroup
      .selectAll('.unrelated-node')
      .data(persons.filter(p => !relationshipMap[p.id]))
      .enter()
      .append('g')
      .attr('class', 'unrelated-node')
      .attr('transform', (_, i) => `translate(${width - 100}, ${50 + i * 50})`)
      .call(g => {
        g.append('circle').attr('r', 10).attr('fill', 'red');
        g.append('text')
          .attr('dy', '.35em')
          .attr('x', 15)
          .style('text-anchor', 'start')
          .text(d => `${d.first_name} ${d.last_name}`);
      });
  }, [familyHierarchy, persons]);

  return <svg ref={svgRef}></svg>;
};

export default FamilyTree;
