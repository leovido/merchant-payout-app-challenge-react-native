import { configureStore } from "@reduxjs/toolkit";
import activityReducer from "./features/activity/activitySlice";
import { apiSlice } from "./features/api/apiSlice";
import balanceReducer from "./features/balances/balanceSlice";

export default configureStore({
	reducer: {
		balance: balanceReducer,
		activity: activityReducer,
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
});
