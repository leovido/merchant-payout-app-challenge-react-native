import { configureStore } from "@reduxjs/toolkit";
import balanceReducer from "./features/balances/balanceSlice";
import activityReducer from "./features/activity/activitySlice";
import { apiSlice } from "./features/api/apiSlice";

export default configureStore({
	reducer: {
		balance: balanceReducer,
		activity: activityReducer,
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
});
