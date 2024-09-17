import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// ! front end data i need
interface RelationshipNames {
  id: string;
  person1_first_name: string;
  person1_last_name: string;
  person2_first_name: string;
  person2_last_name: string;
  relationship_type: string;
}

//! BACKEND
export const relationshipNamesApi = createApi({
  reducerPath: 'relationshipNamesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getRelationshipNames: builder.query<RelationshipNames[], void>({
      query: () => 'relationshipNames/read',
    }),
  }),
});

export const { useGetRelationshipNamesQuery, } = relationshipNamesApi;