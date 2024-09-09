'use client'

import React, { useEffect, useState } from 'react';
import { useGetRelationshipsQuery } from '../store/relationshipsApi';

export default function Relationships() {
    const { data: relationships, error, isLoading } = useGetRelationshipsQuery();
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <div>
            <h2>Relationships</h2>
            {relationships?.length === 0 ? (
                <p>No relationships found.</p>
            ) : (
                <ul>
                    {relationships?.map((relationship: any) => (
                        <li key={relationship.id}>
                        {relationship.person1_first_name} {relationship.person1_last_name} is the
                        {' '}{relationship.relationship_type} of {' '}
                        {relationship.person2_first_name} {relationship.person2_last_name}
                    </li>
                    ))}
                </ul>
            )}
        </div>
    );
}