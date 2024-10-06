import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Person {
    id: string;
    first_name: string;
    last_name: string;
}

export const personsApi = createApi({
  reducerPath: 'personsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/',
    prepareHeaders: (headers) => {
      headers.set('Cache-Control', 'no-store');
      return headers;
    },  
  }),
  tagTypes: ['Persons'],
  endpoints: (builder) => ({
    getPersons: builder.query<Person[], void>({
      query: () => 'persons/read',
      providesTags: ['Persons'], // Provides this tag to the cache
    }),
    addPerson: builder.mutation({
      query: (body) => ({
        url: 'persons/create',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Persons'], // Invalidates cache when a person is deleted
    }),
  }),
});

export const { useGetPersonsQuery, useAddPersonMutation } = personsApi;