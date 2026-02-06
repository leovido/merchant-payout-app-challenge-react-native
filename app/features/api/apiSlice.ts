// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_BASE_URL } from "@/constants";
import type {
	BalanceResponse,
	CreatePayoutRequest,
	PayoutResponse,
	PaginatedActivityResponse,
} from "@/types/api";

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
			serializeQueryArgs: (args) => {
				return `activity-${args.queryArgs.limit}-${args.endpointName}`;
			},
			merge(currentCacheData, responseData) {
				if (!currentCacheData) {
					return responseData;
				}
				return {
					...currentCacheData,
					items: [...currentCacheData.items, ...responseData.items],
					next_cursor: responseData.next_cursor,
					has_more: responseData.has_more,
				};
			},
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
		createPayout: builder.mutation<PayoutResponse, CreatePayoutRequest>({
			query: (body) => ({
				url: "/api/payouts",
				method: "POST",
				body,
			}),
		}),
	}),
});

export const {
	useGetBalanceQuery,
	useGetPaginatedActivityQuery,
	useCreatePayoutMutation,
} = apiSlice;
