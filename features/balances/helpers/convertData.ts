import type { BalanceResponse } from "@/types/api";
import type { BalanceState } from "../data/balanceSlice";

export const convertData = (data: BalanceResponse): BalanceState => {
	return {
		availableBalance: data.available_balance,
		pendingBalance: data.pending_balance,
		currency: data.currency,
	};
};
