import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useGetRelationshipNamesQuery } from '@/store/api/relationshipNamesApi';


export default function Relationships() {
    // ? should already be set from the first fetch and set of state in page.tsx
    // const relationshipNames = useSelector((state: RootState) => state.relationshipNames);

    const { data: relationshipNames, error, isLoading } = useGetRelationshipNamesQuery();
    
    useEffect(() => {
        console.log('RelationshipNames fetched:', relationshipNames); // Debugging output
    }, [relationshipNames]);

    if (isLoading) {
        return <p>Loading relationships...</p>;
    }

    if (error) {
        return <p>Error fetching relationships.</p>;
    }

    if (!relationshipNames || relationshipNames.length === 0) {
        return <p>No relationships found.</p>;
    }

    return (
        <ul>
            {relationshipNames.map((relationship: any) => (
                <li key={relationship.id}>
                    {relationship.person1_first_name} {relationship.person1_last_name} is the
                    {' '}{relationship.relationship_type} of {' '}
                    {relationship.person2_first_name} {relationship.person2_last_name}
                </li>
            ))}
        </ul>
    );
}