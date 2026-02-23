import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_BASE_URL } from "@/constants";

export const apiSlice = createApi({
	reducerPath: "api",
	tagTypes: ["Balance", "Activity", "Payout"],
	baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
	endpoints: () => ({}),
});
