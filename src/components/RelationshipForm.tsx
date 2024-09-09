import React, { useEffect, useState } from 'react';

// interface PersonProps {
//   id: number;
//   first_name: string;
//   last_name: string;
//   x: number;
//   y: number;
//   isYou?: boolean;
//   onDelete: (id: number) => void;
// }

export default function RelationshipForm() {

    // ! state
    const [persons, setPersons] = useState<any>([]);
    const [person1, setPerson1] = useState<string>('');
    const [person2, setPerson2] = useState<string>('');
    const [relationshipTypes, setRelationshipTypes] = useState<any>([]);
    const [relationshipTypeId, setRelationshipTypeId] = useState<string>('');

  
    useEffect(() => {
        // ! Fetch people from the database
        const fetchPersons = async () => {
          const response = await fetch('/api/persons/read');
          const data = await response.json();
          setPersons(data);
        };

        // ! Fetch relationship types from the database
        const fetchRelationshipTypes = async () => {
            const response = await fetch('/api/relationship-types/read');
            const data = await response.json();
            setRelationshipTypes(data);
          };
    
        fetchPersons();
        fetchRelationshipTypes();
      }, []);

    // ! Create relationship
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const newRelationship = {
          person1Id: person1,
          person2Id: person2,
          relationshipTypeId: relationshipTypeId,
        };

        try {
          const response = await fetch('/api/relationships/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newRelationship),
          });
    
          if (response.ok) {
            alert('Relationship added successfully!');
            // Reset form
            setPerson1('');
            setPerson2('');
            setRelationshipTypeId('');
          } else {
            alert('Failed to add relationship');
          }
        } catch (error) {
          console.error('Error adding relationship:', error);
          alert('An error occurred while adding the relationship');
        }
    };

  return (
    <form onSubmit={handleSubmit}>
    <h2>Add Relationship</h2>
    <div>
      <label htmlFor="person1">Person 1:</label>
      <select
        id="person1"
        value={person1}
        onChange={(e) => setPerson1(e.target.value)}
        required
      >
        <option value="">Select a person</option>
        {persons.map((person: any) => (
          <option key={person.first_name} value={person.id}>
            {person.first_name} {person.last_name}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="person2">Person 2:</label>
      <select
        id="person2"
        value={person2}
        onChange={(e) => setPerson2(e.target.value)}
        required
      >
        <option value="">Select a person</option>
        {persons.map((person: any) => (
          <option key={person.id} value={person.id}>
            {person.first_name} {person.last_name}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label htmlFor="relationshipType">Relationship Type:</label>
      <select
        id="relationshipType"
        value={relationshipTypeId}
        onChange={(e) => setRelationshipTypeId(e.target.value)}
        required
      >
        <option value="">Select a relationship type</option>
        {relationshipTypes.map((type: any) => (
          <option key={type.id} value={type.id}>
            {type.relationship}
          </option>
        ))}
      </select>
    </div>
    <button type="submit">Add Relationship</button>
  </form>
  );
}