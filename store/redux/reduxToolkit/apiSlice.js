import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const config = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/js',
      api_key: 'dbd603e47c4543d1ab88983e637d100d',
      api_id:'API-f54eb871-4796-4bf5-9d28-1ccdee50baf7'
    },
  };
const API_URL = 'https://jogettestdx8.ghobash.com:8443'

export const getApiData = createApi({
  reducerPath: 'getApiData',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://my-products-db.vercel.app/' }),
  endpoints: (builder) => ({
    getCustomers: builder.query({
      // query: () => '/jw/api/list/list_customersAPI',
      query: () => 'data',
    }),
  }),
});

export const { useGetCustomersQuery } = getApiData;
