import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ! front end data i need
// interface Relationship {
//   id: string;
//   person1_first_name: string;
//   person1_last_name: string;
//   person2_first_name: string;
//   person2_last_name: string;
//   relationship_type: string;
// }

// ! back end ids for unique sql relationships
// ! 1. pulling from the db using the route.
interface RelationshipIds {
  person_id_1: string;
  person_id_2: string;
  relationship_type_id: string;
}
// actual id of created relationship
interface RelationshipId {
  id: string;
}

//! BACKEND
export const relationshipsApi = createApi({
  reducerPath: 'relationshipsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/',
    prepareHeaders: (headers) => {
      headers.set('Cache-Control', 'no-store');
      return headers;
    }, 
  }),
  tagTypes: ['RelationshipNames'],
  endpoints: (builder) => ({
    // ! grabs relationship rows that are IDs
    getRelationships: builder.query<RelationshipIds[], void>({
      query: () => 'relationships/read',
    }),
    // takes in ID's from the form, and creates the relationship
    //* tagType after request is success, we invalidate, because adding new relationship means that the list of relationship names is now outdated
    //* invalidating tag tell RTk query that any data associated with this tag is no longer up to date
    //* THEN it triggers a refetch of any queries that use the same tagType
    addRelationship: builder.mutation<RelationshipIds, Partial<RelationshipIds>>({
      query: (body) => ({
        url: 'relationships/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RelationshipNames'],
    }),
    deleteRelationship: builder.mutation<void, RelationshipId>({
      query: ({ id }) => ({
        url: `relationships/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RelationshipNames'],
    }),
  }),
});

export const { useGetRelationshipsQuery, useAddRelationshipMutation, useDeleteRelationshipMutation } = relationshipsApi;