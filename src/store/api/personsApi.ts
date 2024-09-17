import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Person {
    id: string;
    first_name: string;
    last_name: string;
}

export const personsApi = createApi({
  reducerPath: 'personsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getPersons: builder.query<Person[], void>({
      query: () => 'persons/read',
    }),
  }),
});

export const { useGetPersonsQuery } = personsApi;