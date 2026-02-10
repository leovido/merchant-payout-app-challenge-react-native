import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { apiSlice } from "@/api/apiSlice";
import activityReducer from "@/features/activity/activitySlice";
import balanceReducer from "@/features/balances/balanceSlice";
import payoutReducer from "@/features/payout/payoutSlice";

export const store = configureStore({
	reducer: {
		balance: balanceReducer,
		activity: activityReducer,
		payout: payoutReducer,
		[apiSlice.reducerPath]: apiSlice.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
