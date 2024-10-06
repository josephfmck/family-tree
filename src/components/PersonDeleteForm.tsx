import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
// import { addRelationship } from '../store/slices/relationshipsSlice';
// import { useAddRelationshipMutation, useDeleteRelationshipMutation } from '@/store/api/relationshipsApi';
// import { useGetRelationshipNamesQuery } from '@/store/api/relationshipNamesApi';

import { useGetPersonsQuery, useDeletePersonMutation } from '@/store/api/personsApi';

export default function PersonDeleteForm() {
    const dispatch = useDispatch();

    // api method 
    // const [addRelationship, { isLoading }] = useAddRelationshipMutation();
    const [deletePerson, { isLoading: isDeleting }] = useDeletePersonMutation();
    const { data: persons, error, isLoading: isFetching } = useGetPersonsQuery();

    useEffect(() => {
        console.log('Persons fetched:', persons); // Debugging output
    }, [persons]);

    if (isFetching) {
        return <p>Loading persons...</p>;
    }

    if (error) {
        return <p>Error fetching persons.</p>;
    }

    if (!persons || persons.length === 0) {
        return <p>No persons found.</p>;
    }

    // ! state
    const [personId, setPersonId] = useState<any>('');

    const { refetch } = useGetPersonsQuery();

    // ! delete Person with ID
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log(personId);
      if (!personId) {
        console.error('Person ID is required');
        return;
      }
      try {
        await deletePerson({
            id: personId,  
        }).unwrap();

        // Trigger manual refetch
        refetch();

        // Clear form on success
        setPersonId('');
      } catch (err) {
        // Error is handled by RTK Query
        console.error('Failed to delete person:', err);
      }
    };

  return (
    <form onSubmit={handleSubmit}>
    <h2>Delete Person</h2>
    <div>
      <label htmlFor="Person">Person:</label>
      <select
        id="Person"
        value={personId}
        onChange={(e) => setPersonId(e.target.value)}
        required
      >
        <option value="">Select a person</option>
        {persons.map((p: any) => (
            <option key={p.id} value={p.id}>
                {p.first_name} {p.last_name}
            </option>
        ))}
      </select>
    </div>
    <button type="submit">Delete Person</button>
  </form>
  );
}