import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
// import { addRelationship } from '../store/slices/relationshipsSlice';
import { useAddRelationshipMutation } from '@/store/api/relationshipsApi';
import { useGetRelationshipNamesQuery } from '@/store/api/relationshipNamesApi';

export default function RelationshipForm() {
    const dispatch = useDispatch();
    const relationshipTypes = useSelector((state: RootState) => state.relationshipTypes);
    const persons = useSelector((state: RootState) => state.persons);
    // api method 
    const [addRelationship, { isLoading }] = useAddRelationshipMutation();


    // ! state
    const [person1, setPerson1] = useState<string>('');
    const [person2, setPerson2] = useState<string>('');
    const [relationshipTypeId, setRelationshipTypeId] = useState<string>('');

    const { refetch } = useGetRelationshipNamesQuery();

    // Helper function to add reciprocal relationships
    const addReciprocalRelationship = async (
      reciprocalTypeName: string,
      personA: string,
      personB: string
    ) => {
      const reciprocalRelationshipType = relationshipTypes.find(
        (type: any) => type.relationship === reciprocalTypeName
      );
      if (reciprocalRelationshipType) {
        await addRelationship({
          person_id_1: personA,
          person_id_2: personB,
          relationship_type_id: reciprocalRelationshipType.id,
        }).unwrap();
      } else {
        console.error(`${reciprocalTypeName} relationship type not found`);
      }
    };

    // ! Create relationship with IDs
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log(person1, person2, relationshipTypeId);
      if (!person1 || !person2 || !relationshipTypeId) {
        console.error('All fields are required');
        return;
      }
      try {
        await addRelationship({
          person_id_1: person1,
          person_id_2: person2,
          relationship_type_id: relationshipTypeId
        }).unwrap();

      // Find the selected relationship type
      const selectedRelationshipType = relationshipTypes.find(
        (type: any) => type.id === relationshipTypeId
      );

       // Use helper function for reciprocal relationships
       if (selectedRelationshipType) {
        const relationshipType = selectedRelationshipType.relationship;

        // TODO: more - spouse, 
        if (relationshipType === 'Child') {
          await addReciprocalRelationship('Parent', person2, person1);
        } else if (relationshipType === 'Parent') {
          await addReciprocalRelationship('Child', person2, person1);
        } else if (relationshipType === 'Sibling') {
          await addReciprocalRelationship('Sibling', person2, person1);
        } else if (relationshipType === 'Spouse') {
          await addReciprocalRelationship('Spouse', person2, person1);
        }
        // Add more reciprocal relationships as needed
      }

        // Trigger manual refetch
        refetch();

        // Clear form on success
        setPerson1('');
        setPerson2('');
        setRelationshipTypeId('');
      } catch (err) {
        // Error is handled by RTK Query
        console.error('Failed to add relationship:', err);
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
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Adding...' : 'Add Relationship'}
      </button>
  </form>
  );
}