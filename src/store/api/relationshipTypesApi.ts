import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface RelationshipType {
  id: string;
  relationship: string;
}

export const relationshipTypesApi = createApi({
  reducerPath: 'relationshipTypesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/',
    prepareHeaders: (headers) => {
      headers.set('Cache-Control', 'no-store');
      return headers;
    },   
  }),
  tagTypes: ['RelationshipTypes'],
  endpoints: (builder) => ({
    getRelationshipTypes: builder.query<RelationshipType[], void>({
      query: () => 'relationship-types/read',
    }),
    addRelationshipType: builder.mutation({
      query: (body) => ({
        url: 'relationshipTypes/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RelationshipTypes'], // Invalidates cache when a person is deleted
    }),
  }),
});

export const { useGetRelationshipTypesQuery, useAddRelationshipTypeMutation } = relationshipTypesApi;