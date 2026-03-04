import { API_ROUTES } from "@/constants";
import type { PaginatedActivityResponse } from "@/types/api";
import { apiSlice } from "./apiSlice";

export const activityApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getPaginatedActivity: builder.query<
			PaginatedActivityResponse,
			{ limit?: number; cursor?: string }
		>({
			serializeQueryArgs: (args) => {
				return `activity-${args.queryArgs.limit}-${args.endpointName}`;
			},
			merge(currentCacheData, responseData, { arg }) {
				if (!currentCacheData) {
					return responseData;
				}
				// Refetch of first page (e.g. after invalidation): replace cache to avoid duplicates.
				if (!arg?.cursor) {
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
				`${API_ROUTES.activity}?limit=${limit}&cursor=${cursor}`,
			transformResponse: (response: PaginatedActivityResponse) => {
				return {
					...response,
					items: response.items.map((item) => {
						const d = new Date(item.date);
						const day = String(d.getDate()).padStart(2, "0");
						const month = String(d.getMonth() + 1).padStart(2, "0");
						const year = d.getFullYear();
						return {
							...item,
							date: `${day}/${month}/${year}`,
						};
					}),
				};
			},
			providesTags: ["Activity"],
		}),
	}),
});

export const { useGetPaginatedActivityQuery } = activityApi;
