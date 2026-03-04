import type { UsePaginatedActivityReturn } from "@/hooks/usePaginatedActivity";
import type { ActivityItem, PaginatedActivityResponse } from "@/types/api";

export function createActivityItem(
	overrides?: Partial<ActivityItem>,
): ActivityItem {
	return {
		id: "act-1",
		type: "payout",
		amount: -500,
		currency: "GBP",
		date: "07/02/2025",
		description: "Payout to bank",
		status: "completed",
		...overrides,
	};
}

export const defaultPaginatedData: PaginatedActivityResponse = {
	items: [
		createActivityItem({
			id: "m1",
			type: "refund",
			description: "Refund",
			amount: 1000,
			currency: "GBP",
			date: "07/02/2025",
			status: "completed",
		}),
	],
	next_cursor: "m2",
	has_more: true,
};

export const defaultPaginatedActivity: UsePaginatedActivityReturn = {
	activityData: defaultPaginatedData,
	isActivityLoading: false,
	isActivityFetching: false,
	refetch: jest.fn(),
	cursor: "",
	setCursor: jest.fn(),
};
