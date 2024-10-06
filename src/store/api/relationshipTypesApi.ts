import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface RelationshipType {
  id: string;
  relationship: string;
}

interface RelationshipTypeId {
  id: string;
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
      providesTags: ['RelationshipTypes'],
    }),
    addRelationshipType: builder.mutation<RelationshipType, Partial<RelationshipType>>({
      query: (body) => ({
        url: 'relationship-types/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['RelationshipTypes'], // Invalidates cache when a person is deleted
    }),
    deleteRelationshipType: builder.mutation<void, RelationshipTypeId>({
      query: ({ id }) => ({
        url: `relationship-types/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['RelationshipTypes'],
    }),
  }),
});

export const { useGetRelationshipTypesQuery, useAddRelationshipTypeMutation, useDeleteRelationshipTypeMutation } = relationshipTypesApi;