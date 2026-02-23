import { API_ROUTES } from "@/constants";
import type { CreatePayoutRequest, PayoutResponse } from "@/types/api";
import { apiSlice } from "./apiSlice";

const extendedApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		createPayout: builder.mutation<PayoutResponse, CreatePayoutRequest>({
			query: (body) => ({
				url: API_ROUTES.payouts,
				method: "POST",
				body,
			}),
			invalidatesTags: ["Balance", "Activity"],
		}),
	}),
});

export const { useCreatePayoutMutation } = extendedApi;
