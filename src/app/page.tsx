'use client';

import { useState, useEffect } from 'react';
import People from '../components/People';
import RelationshipForm from '../components/RelationshipForm';
import Relationships from '../components/Relationships';

interface Person {
    id: number;
    first_name: string;
    last_name: string;
}

interface RelationshipType {
    id: number;
    relationship: string;
}

async function fetchPersons() {
  const response = await fetch('/api/persons/read');
  if (!response.ok) throw new Error('Failed to fetch persons');
  return response.json();
}

async function fetchRelationshipTypes() {
    const response = await fetch('/api/relationship-types/read');
    if (!response.ok) throw new Error('Failed to fetch persons');
    return response.json();
}

export default function Home() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [relationshipTypes, setRelationshipTypes] = useState<RelationshipType[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [selectedPerson1, setSelectedPerson1] = useState<number | ''>('');
  const [selectedPerson2, setSelectedPerson2] = useState<number | ''>('');
  const [selectedRelationship, setSelectedRelationship] = useState<number | ''>('');


  useEffect(() => {
    fetchPersons().then(setPersons).catch(e => console.error('Error fetching persons:', e));
    fetchRelationshipTypes()
      .then(setRelationshipTypes)
      .catch(e => {
        console.error('Error fetching relationship types:', e);
      });
  }, []);


  return (
    <div>

{/* // TODO: RTK for relationships, when adding a new relationship with <RelationshipForm>. repull and set the relationships rtk which is then rendered out in <relationships> */}
    <Relationships/>
    <RelationshipForm />
    <People />
  </div>
  );
}
