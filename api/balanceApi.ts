import { API_ROUTES } from "@/constants";
import type { BalanceResponse } from "@/types/api";
import { apiSlice } from "./apiSlice";

export const balanceApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getBalance: builder.query<BalanceResponse, void>({
			query: () => API_ROUTES.balance,
			providesTags: ["Balance"],
		}),
	}),
});

export const { useGetBalanceQuery } = balanceApi;
