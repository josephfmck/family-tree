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

// tagTypes are accessed from all api slices - relationships/relationshipNames are using this tagType 
// provide the tagType, when the form was created the tagType was invalidated and triggers this
// refetches the data because it was invalidated earlier when we added new relationship
export const relationshipNamesApi = createApi({
  reducerPath: 'relationshipNamesApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/',
    prepareHeaders: (headers) => {
      headers.set('Cache-Control', 'no-store');
      return headers;
    },
  }),
  tagTypes: ['RelationshipNames'],
  endpoints: (builder) => ({
    getRelationshipNames: builder.query<RelationshipNames[], void>({
      query: () => 'relationshipNames/read',
      providesTags: ['RelationshipNames'],
    }),
  }),
});

export const { useGetRelationshipNamesQuery, } = relationshipNamesApi;