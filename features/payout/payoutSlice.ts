import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CreatePayoutRequest } from "@/types/api";
import { formatCurrencyForInput } from "@/utils/formatter";

const initialState: Partial<CreatePayoutRequest> & {
	formattedAmount?: string;
} = {
	amount: undefined,
	currency: "GBP",
	iban: "",
	device_id: undefined,
	formattedAmount: undefined,
};

export const payoutSlice = createSlice({
	name: "payout",
	initialState,
	reducers: {
		setPayout: (
			state: Partial<CreatePayoutRequest> & { formattedAmount?: string },
			action: PayloadAction<Partial<CreatePayoutRequest>>,
		) => {
			const nextState = { ...state, ...action.payload };
			console.log("Setting payout", nextState);
			return {
				...nextState,
				formattedAmount:
					nextState.amount != null && nextState.amount !== undefined
						? formatCurrencyForInput(nextState.amount)
						: "",
			};
		},
	},
});

export const { setPayout } = payoutSlice.actions;

export default payoutSlice.reducer;
