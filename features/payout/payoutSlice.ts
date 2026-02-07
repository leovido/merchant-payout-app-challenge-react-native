import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
	CreatePayoutRequest,
	PayoutResponse,
	PayoutStatus,
} from "@/types/api";
import { formatCurrencyForInput } from "@/utils/formatter";

const initialState: Partial<CreatePayoutRequest> & {
	formattedAmount?: string;
	payoutResponse?: PayoutResponse;
	errorMessage?: string;
} = {
	amount: undefined,
	currency: "GBP",
	iban: "",
	device_id: undefined,
	payoutResponse: undefined,
	errorMessage: undefined,
};

export const payoutSlice = createSlice({
	name: "payout",
	initialState,
	reducers: {
		resetPayoutState: () => {
			return initialState;
		},
		setFailurePayoutState: (
			state: typeof initialState,
			action: PayloadAction<{
				errorMessage: string;
			}>,
		) => {
			const nextState = {
				...state,
				errorMessage: action.payload.errorMessage,
				payoutResponse: {
					id: "",
					amount: state.amount || 0,
					currency: state.currency || "GBP",
					iban: state.iban || "",
					created_at: new Date().toISOString(),
					status: "failed" as PayoutStatus,
				},
			};

			return nextState;
		},
		setPayout: (
			state: typeof initialState,
			action: PayloadAction<typeof initialState>,
		) => {
			const nextState = { ...state, ...action.payload };

			return {
				...nextState,
				formattedAmount:
					nextState.amount != null && nextState.amount !== undefined
						? formatCurrencyForInput(nextState.amount)
						: "",
				payoutResponse: action.payload.payoutResponse,
				errorMessage: action.payload.errorMessage,
			};
		},
	},
});

export const { setPayout, resetPayoutState, setFailurePayoutState } =
	payoutSlice.actions;

export default payoutSlice.reducer;
