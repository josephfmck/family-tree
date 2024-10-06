import React, { useState } from 'react';
import { useAddRelationshipTypeMutation } from '@/store/api/relationshipTypesApi';



export default function RelationshipTypesForm() {

    //! state 
    // rtk query 
    const [addRelationshipType, { isLoading }] = useAddRelationshipTypeMutation();

      
    const [relationshipType, setRelationshipType] = useState<string>('');

    //  handle to update the input state 
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setRelationshipType(value); 
      };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission, like sending data to an API
        if (!relationshipType) {
            console.error('All fields are required');
            return;
        }

        try {
            await addRelationshipType({
                relationship: relationshipType,
            }).unwrap();
            // Clear form on success
            setRelationshipType('');
        } catch (err) {
            // Error is handled by RTK Query
            console.error('Failed to add relationshipType:', err);
        }

    };
  
  return (
    <>
    <h1>Add Relationship Type</h1>
    <form onSubmit={handleSubmit}>
        <label htmlFor="relationshipType">Relationship Type:</label><br />
        <input
          type="text"
          id="relationshipType"
          name="relationshipType"
          value={relationshipType}
          onChange={handleChange}
          required
        /><br /><br />

        <button type="submit">Submit</button>
    </form>
    </>
  );
}