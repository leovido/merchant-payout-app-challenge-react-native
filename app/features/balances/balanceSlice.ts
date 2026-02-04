import { BalanceResponse } from "@/types/api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: BalanceResponse = {
	available_balance: 0,
	pending_balance: 0,
	currency: "GBP",
};

export const balanceSlice = createSlice({
	name: "balance",
	initialState,
	reducers: {
		setBalance: (
			state: BalanceResponse,
			action: PayloadAction<BalanceResponse>,
		) => {
			state.available_balance = action.payload.available_balance;
			state.pending_balance = action.payload.pending_balance;
			state.currency = action.payload.currency;
		},
	},
});

export const { setBalance } = balanceSlice.actions;

export default balanceSlice.reducer;
