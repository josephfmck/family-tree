import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface RelationshipType {
  id: string;
  relationship: string;
}

export const relationshipTypesApi = createApi({
  reducerPath: 'relationshipTypesApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getRelationshipTypes: builder.query<RelationshipType[], void>({
      query: () => 'relationship-types/read',
    }),
  }),
});

export const { useGetRelationshipTypesQuery } = relationshipTypesApi;