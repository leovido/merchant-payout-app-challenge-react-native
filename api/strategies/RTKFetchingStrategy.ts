import { store } from "@/store/store";
import type {
	BalanceResponse,
	CreatePayoutRequest,
	PaginatedActivityResponse,
	PayoutResponse,
} from "@/types/api";
import extractErrorMessage from "@/utils/errorHandler";
import { activityApi } from "../activityApi";
import { balanceApi } from "../balanceApi";
import { payoutApi } from "../payoutApi";
import type { DataFetchingStrategy } from "./DataFetchingStrategy";

function toUserError(error: unknown): Error {
	return error instanceof Error ? error : new Error(extractErrorMessage(error));
}

export class RTKFetchingStrategy implements DataFetchingStrategy {
	async fetchBalance(): Promise<BalanceResponse> {
		try {
			const response = store.dispatch(
				balanceApi.endpoints.getBalance.initiate(),
			);
			const { data } = await response;

			if (!data) throw new Error("BalanceResponse invalid");
			return data;
		} catch (e) {
			throw toUserError(e);
		}
	}

	async fetchPaginatedActivity(params: {
		limit?: number;
		cursor?: string;
	}): Promise<PaginatedActivityResponse> {
		try {
			const response = store.dispatch(
				activityApi.endpoints.getPaginatedActivity.initiate({
					limit: params.limit,
					cursor: params.cursor,
				}),
			);
			const { data } = await response;

			if (!data) throw new Error("PaginatedActivityResponse invalid");
			return data;
		} catch (e) {
			throw toUserError(e);
		}
	}

	async createPayout(request: CreatePayoutRequest): Promise<PayoutResponse> {
		try {
			const response = store.dispatch(
				payoutApi.endpoints.createPayout.initiate({
					...request,
				}),
			);
			const { data } = await response;

			if (!data) throw new Error("PayoutResponse invalid");
			return data;
		} catch (e) {
			throw toUserError(e);
		}
	}
}
