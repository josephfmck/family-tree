import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
// import { addRelationship } from '../store/slices/relationshipsSlice';
import { useAddRelationshipMutation, useDeleteRelationshipMutation } from '@/store/api/relationshipsApi';
import { useGetRelationshipNamesQuery } from '@/store/api/relationshipNamesApi';

export default function RelationshipDeleteForm() {
    const dispatch = useDispatch();

    // api method 
    // const [addRelationship, { isLoading }] = useAddRelationshipMutation();
    const [deleteRelationship, { isLoading: isDeleting }] = useDeleteRelationshipMutation();
    const { data: relationshipNames, error, isLoading: isFetching } = useGetRelationshipNamesQuery();

    useEffect(() => {
        console.log('RelationshipNames fetched:', relationshipNames); // Debugging output
    }, [relationshipNames]);

    if (isFetching) {
        return <p>Loading relationship names...</p>;
    }

    if (error) {
        return <p>Error fetching relationship names.</p>;
    }

    if (!relationshipNames || relationshipNames.length === 0) {
        return <p>No relationship names found.</p>;
    }

    // ! state
    const [relationshipName, setRelationshipName] = useState<any>('');

    const { refetch } = useGetRelationshipNamesQuery();

    // ! Create relationship with IDs
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log(relationshipName);
      if (!relationshipName) {
        console.error('RelationshipName is required');
        return;
      }
      try {
        await deleteRelationship({
            id: relationshipName,  
        }).unwrap();

        // Trigger manual refetch
        refetch();

        // Clear form on success
        setRelationshipName('');
      } catch (err) {
        // Error is handled by RTK Query
        console.error('Failed to delete relationship:', err);
      }
    };

  return (
    <form onSubmit={handleSubmit}>
    <h2>Delete Relationship</h2>
    <div>
      <label htmlFor="relationship">Relationship:</label>
      <select
        id="relationship"
        value={relationshipName}
        onChange={(e) => setRelationshipName(e.target.value)}
        required
      >
        <option value="">Select a relationship</option>
        {relationshipNames.map((r: any) => (
            <option key={r.id} value={r.id}>
                {r.person1_first_name} {r.person1_last_name} is the
                {' '}{r.relationship_type} of {' '}
                {r.person2_first_name} {r.person2_last_name}
            </option>
        ))}
      </select>
    </div>
    <button type="submit">Delete Relationship</button>
  </form>
  );
}