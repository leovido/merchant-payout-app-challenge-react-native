import { configureStore } from "@reduxjs/toolkit";
import activityReducer from "./features/activity/activitySlice";
import { apiSlice } from "./features/api/apiSlice";
import balanceReducer from "./features/balances/balanceSlice";

export const store = configureStore({
	reducer: {
		balance: balanceReducer,
		activity: activityReducer,
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
