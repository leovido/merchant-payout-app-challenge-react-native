import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreatePayoutRequest, PayoutResponse } from "@/types/api";
import { formatCurrencyForInput } from "@/utils/formatter";

const initialState: Partial<CreatePayoutRequest> & {
	formattedAmount?: string;
} & { payoutResponse?: PayoutResponse } = {
	amount: undefined,
	currency: "GBP",
	iban: "",
	device_id: undefined,
	formattedAmount: undefined,
	payoutResponse: undefined,
};

export const payoutSlice = createSlice({
	name: "payout",
	initialState,
	reducers: {
		setPayout: (
			state: Partial<CreatePayoutRequest> & { formattedAmount?: string } & {
				payoutResponse?: PayoutResponse;
			},
			action: PayloadAction<Partial<CreatePayoutRequest>>,
		) => {
			const nextState = { ...state, ...action.payload };

			return {
				...nextState,
				formattedAmount:
					nextState.amount != null && nextState.amount !== undefined
						? formatCurrencyForInput(nextState.amount)
						: "",
				payoutResponse: state.payoutResponse,
			};
		},
	},
});

export const { setPayout } = payoutSlice.actions;

export default payoutSlice.reducer;
