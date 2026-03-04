import type {
	BalanceResponse,
	CreatePayoutRequest,
	PaginatedActivityResponse,
	PayoutResponse,
} from "@/types/api";

export interface DataFetchingStrategy {
	fetchBalance(): Promise<BalanceResponse>;
	fetchPaginatedActivity(params: {
		limit?: number;
		cursor?: string;
	}): Promise<PaginatedActivityResponse>;
	createPayout(request: CreatePayoutRequest): Promise<PayoutResponse>;
}
