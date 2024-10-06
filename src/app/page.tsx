'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAppData } from '../hooks/useAppData';


//! components
import People from '../components/People';
import RelationshipForm from '../components/RelationshipForm';
import RelationshipsList from '../components/RelationshipsList';
//! rtk
import { useGetRelationshipsQuery } from '@/store/api/relationshipsApi';
import { setRelationships } from '@/store/slices/relationshipsSlice';
import PersonForm from '@/components/PersonForm';
import RelationshipTypes from '@/components/RelationshipTypesList';
import RelationshipTypesList from '@/components/RelationshipTypesList';
import RelationshipTypesForm from '@/components/RelationshipTypesForm';
import RelationshipDeleteForm from '@/components/RelationshipDeleteForm';
import PersonDeleteForm from '@/components/PersonDeleteForm';
import RelationshipTypeDeleteForm from '@/components/RelationshipTypeDeleteForm';
// TODO: fetch all 3 on page load. 
// TODO: set relationships rtk to the fetched relationships 


export default function Home() {
  //* fetches all 3 and sets to rtk once?
  const { isLoading, error } = useAppData();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.toString()}</div>;  



  return (
    <div>

    {/* // TODO: RTK for relationships, when adding a new relationship with <RelationshipForm>. repull and set the relationships rtk which is then rendered out in <relationships> */}
    <div style={{ display: "flex" }}>
      <RelationshipForm />
      <RelationshipDeleteForm />
      <RelationshipsList/>
    </div>
    <div style={{ display: "flex" }}>
    <RelationshipTypesForm />
    <RelationshipTypeDeleteForm/>
    <RelationshipTypesList />
    </div>
    <PersonForm />
    <PersonDeleteForm />
    <People />
  </div>
  );
}
