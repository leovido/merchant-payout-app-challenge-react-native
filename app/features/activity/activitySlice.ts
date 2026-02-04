import { ActivityItem } from "@/types/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
	items: [
		{
			id: "1",
			type: "deposit",
			amount: 100,
			currency: "GBP",
			date: "2021-01-01",
			description: "Deposit",
			status: "completed",
		},
	],
};

export const activitySlice = createSlice({
	name: "activity",
	initialState,
	reducers: {
		setActivity: (
			state: typeof initialState,
			action: PayloadAction<ActivityItem[]>,
		) => {
			state.items = action.payload;
		},
	},
});

export const { setActivity } = activitySlice.actions;

export default activitySlice.reducer;
