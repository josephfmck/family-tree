import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export default function Relationships() {
    // ? should already be set from the first fetch and set of state in page.tsx
    // const relationships = useSelector((state: RootState) => state.relationships);
    const relationshipNames = useSelector((state: RootState) => state.relationshipNames);

    if (relationshipNames.length === 0) {
        return <p>No relationshipNames found.</p>;
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