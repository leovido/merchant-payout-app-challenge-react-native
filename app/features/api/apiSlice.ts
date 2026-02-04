// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_BASE_URL } from "@/constants";
import type { BalanceResponse, PaginatedActivityResponse } from "@/types/api";

export const apiSlice = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
	endpoints: (builder) => ({
		getBalance: builder.query<BalanceResponse, void>({
			query: () => "/api/merchant",
		}),
		getPaginatedActivity: builder.query<
			PaginatedActivityResponse,
			{ limit?: number; cursor?: string }
		>({
			query: ({ limit = 15, cursor = "" }) =>
				`/api/merchant/activity?limit=${limit}&cursor=${cursor}`,
			transformResponse: (response: PaginatedActivityResponse) => {
				return {
					...response,
					items: response.items.map((item) => ({
						...item,
						date: new Date(item.date).toLocaleDateString(),
					})),
				};
			},
		}),
	}),
});

export const { useGetBalanceQuery, useGetPaginatedActivityQuery } = apiSlice;
