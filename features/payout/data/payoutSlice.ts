import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
	CreatePayoutRequest,
	Currency,
	PayoutResponse,
	PayoutStatus,
} from "@/types/api";
import { formatCurrencyForInput } from "@/utils/formatter";

const initialState: Partial<CreatePayoutRequest> & {
	formattedAmount?: string;
	payoutResponse?: PayoutResponse;
	errorMessage?: string;
	device_id?: string;
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
					action.payload.amount != null && action.payload.amount !== undefined
						? formatCurrencyForInput(action.payload.amount)
						: "",
			};
		},
		setAmount: (
			state: typeof initialState,
			action: PayloadAction<{
				amount: number | undefined;
			}>,
		) => {
			const amount = action.payload.amount;
			return {
				...state,
				amount,
				formattedAmount:
					amount != null && amount !== undefined
						? formatCurrencyForInput(amount)
						: "",
			};
		},
		setCurrency: (
			state: typeof initialState,
			action: PayloadAction<{
				currency: Currency;
			}>,
		) => {
			return { ...state, currency: action.payload.currency };
		},
		setIban: (
			state: typeof initialState,
			action: PayloadAction<{
				iban: string;
			}>,
		) => {
			return { ...state, iban: action.payload.iban };
		},
		setPayoutResponse: (
			state: typeof initialState,
			action: PayloadAction<{
				payoutResponse: PayoutResponse;
			}>,
		) => {
			return { ...state, payoutResponse: action.payload.payoutResponse };
		},
		setDeviceId: (
			state: typeof initialState,
			action: PayloadAction<{
				device_id?: string;
			}>,
		) => {
			return { ...state, device_id: action.payload.device_id };
		},
	},
});

export const {
	setPayout,
	resetPayoutState,
	setFailurePayoutState,
	setPayoutResponse,
	setDeviceId,
	setAmount,
	setCurrency,
	setIban,
} = payoutSlice.actions;

export default payoutSlice.reducer;
