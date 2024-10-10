import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useGetRelationshipTypesQuery } from '@/store/api/relationshipTypesApi';


export default function RelationshipTypes() {
    // ? should already be set from the first fetch and set of state in page.tsx
    // const relationshipTypes = useSelector((state: RootState) => state.relationshipTypes);

    const relationshipTypes = useSelector((state: RootState) => state.relationshipTypes);

    // const { data: relationshipTypes, error, isLoading } = useGetRelationshipTypesQuery();
    
    // useEffect(() => {
    //     console.log('RelationshipTypes fetched:', relationshipTypes); // Debugging output
    // }, [relationshipTypes]);

    // if (isLoading) {
    //     return <p>Loading relationshipTypes...</p>;
    // }

    // if (error) {
    //     return <p>Error fetching relationshipTypes.</p>;
    // }

    // if (!relationshipTypes || relationshipTypes.length === 0) {
    //     return <p>No relationshipTypes found.</p>;
    // }

    return (
        <ul>
            {relationshipTypes.map((relationshipType: any) => (
                <li key={relationshipType.id}>
                    {relationshipType.relationship} 
                </li>
            ))}
        </ul>
    );
}