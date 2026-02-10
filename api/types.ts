import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/** FetchBaseQueryError where the API response body has shape { error: string, status: number }. */
export type MerchantApiError = FetchBaseQueryError & {
	data: {
		error: string;
		status: number;
	};
};
