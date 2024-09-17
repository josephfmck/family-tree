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
interface RelationshipIds {
  person1Id: string;
  person2Id: string;
  relationshipTypeId: string;
}

//! BACKEND
export const relationshipsApi = createApi({
  reducerPath: 'relationshipsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    // ! grabs relationship rows that are IDs
    getRelationships: builder.query<RelationshipIds[], void>({
      query: () => 'relationships/read',
    }),
    // takes in ID's from the form, and creates the relationship
    addRelationship: builder.mutation<RelationshipIds, Partial<RelationshipIds>>({
      query: (body) => ({
        url: 'relationships/create',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useGetRelationshipsQuery, useAddRelationshipMutation } = relationshipsApi;