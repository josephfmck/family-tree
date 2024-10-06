import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
// import { addRelationship } from '../store/slices/relationshipsSlice';
// import { useAddRelationshipMutation, useDeleteRelationshipMutation } from '@/store/api/relationshipsApi';
// import { useGetRelationshipNamesQuery } from '@/store/api/relationshipNamesApi';

// import { useGetPersonsQuery, useDeletePersonMutation } from '@/store/api/personsApi';
import { useGetRelationshipTypesQuery, useDeleteRelationshipTypeMutation } from '@/store/api/relationshipTypesApi';

export default function RelationshipTypeDeleteForm() {
    const dispatch = useDispatch();

    // api method 
    // const [addRelationship, { isLoading }] = useAddRelationshipMutation();
    const [deleteRelationshipType, { isLoading: isDeleting }] = useDeleteRelationshipTypeMutation();
    const { data: relationshipTypes, error, isLoading: isFetching } = useGetRelationshipTypesQuery();

    useEffect(() => {
        console.log('RelationshipTypes fetched:', relationshipTypes); // Debugging output
    }, [relationshipTypes]);

    if (isFetching) {
        return <p>Loading relationshipTypes...</p>;
    }

    if (error) {
        return <p>Error fetching relationshipTypes.</p>;
    }

    if (!relationshipTypes || relationshipTypes.length === 0) {
        return <p>No relationshipTypes found.</p>;
    }

    // ! state
    const [relationshipTypeId, setRelationshipTypeId] = useState<any>('');

    const { refetch } = useGetRelationshipTypesQuery();

    // ! delete Person with ID
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log(relationshipTypeId);
      if (!relationshipTypeId) {
        console.error('RelationshipType ID is required');
        return;
      }
      try {
        await deleteRelationshipType({
            id: relationshipTypeId,  
        }).unwrap();

        // Trigger manual refetch
        refetch();

        // Clear form on success
        setRelationshipTypeId('');
      } catch (err) {
        // Error is handled by RTK Query
        console.error('Failed to delete relationshipType:', err);
      }
    };

  return (
    <form onSubmit={handleSubmit}>
    <h2>Delete RelationshipType</h2>
    <div>
      <label htmlFor="RelationshipType">RelationshipType:</label>
      <select
        id="RelationshipType"
        value={relationshipTypeId}
        onChange={(e) => setRelationshipTypeId(e.target.value)}
        required
      >
        <option value="">Select a relationshipType</option>
        {relationshipTypes.map((rt: any) => (
            <option key={rt.id} value={rt.id}>
                {rt.relationship}
            </option>
        ))}
      </select>
    </div>
    <button type="submit">Delete RelationshipType</button>
  </form>
  );
}