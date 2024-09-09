import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Relationship {
  id: string;
  person1_first_name: string;
  person1_last_name: string;
  person2_first_name: string;
  person2_last_name: string;
  relationship_type: string;
}

export const relationshipsApi = createApi({
  reducerPath: 'relationshipsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
  endpoints: (builder) => ({
    getRelationships: builder.query<Relationship[], void>({
      query: () => 'relationships/read',
    }),
  }),
});

export const { useGetRelationshipsQuery } = relationshipsApi;