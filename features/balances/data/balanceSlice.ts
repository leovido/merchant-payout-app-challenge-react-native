import {
	createAsyncThunk,
	createSlice,
	type PayloadAction,
} from "@reduxjs/toolkit";
import type { DataFetchingStrategy } from "@/api/strategies/DataFetchingStrategy";
import type { Currency } from "@/types/api";

export interface BalanceState {
	availableBalance: number;
	pendingBalance: number;
	currency: Currency;
}

const initialState: BalanceState = {
	availableBalance: 0,
	pendingBalance: 0,
	currency: "GBP",
};

export const fetchBalance = createAsyncThunk(
	"balance/fetch",
	async (strategy: DataFetchingStrategy) => {
		return strategy.fetchBalance();
	},
);

export const balanceSlice = createSlice({
	name: "balance",
	initialState,
	reducers: {
		setBalance: (state: BalanceState, action: PayloadAction<BalanceState>) => {
			state.availableBalance = action.payload.availableBalance;
			state.pendingBalance = action.payload.pendingBalance;
			state.currency = action.payload.currency;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(fetchBalance.rejected, (state, _action) => {
			state.status = "error";
		});
		builder.addCase(fetchBalance.fulfilled, (state, _action) => {
			state.status = "success";
		});
		builder.addCase(fetchBalance.pending, (state, _action) => {
			state.status = "loading";
		});
	},
});

export const { setBalance } = balanceSlice.actions;

export default balanceSlice.reducer;
