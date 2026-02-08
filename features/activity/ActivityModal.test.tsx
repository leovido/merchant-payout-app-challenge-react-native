import { fireEvent, render, screen } from "@testing-library/react-native";
import { ActivityModal } from "@/features/activity/ActivityModal";
import type { ActivityItem, PaginatedActivityResponse } from "@/types/api";

const mockUseGetPaginatedActivityQuery = jest.fn();

jest.mock("@/api/apiSlice", () => ({
	useGetPaginatedActivityQuery: (args?: { cursor?: string }) =>
		mockUseGetPaginatedActivityQuery(args),
}));

function createActivityItem(overrides?: Partial<ActivityItem>): ActivityItem {
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

const defaultPaginatedData: PaginatedActivityResponse = {
	items: [],
	next_cursor: null,
	has_more: false,
};

function renderActivityModal(
	props: { isModalOpen: boolean; setIsModalOpen: (open: boolean) => void },
	queryOverrides?: Partial<{
		data: PaginatedActivityResponse | undefined;
		isLoading: boolean;
		isFetching: boolean;
	}>,
) {
	const queryState = {
		data: defaultPaginatedData,
		isLoading: false,
		isFetching: false,
		refetch: jest.fn(),
		...queryOverrides,
	};
	mockUseGetPaginatedActivityQuery.mockReturnValue(queryState);

	return render(
		<ActivityModal
			isModalOpen={props.isModalOpen}
			setIsModalOpen={props.setIsModalOpen}
		/>,
	);
}

describe("ActivityModal", () => {
	beforeEach(() => {
		mockUseGetPaginatedActivityQuery.mockReset();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("shows loading state when data is loading", () => {
		renderActivityModal(
			{ isModalOpen: true, setIsModalOpen: jest.fn() },
			{ data: undefined, isLoading: true },
		);

		expect(screen.queryByText("Recent Activity")).not.toBeOnTheScreen();
		expect(screen.queryByLabelText("Done button")).not.toBeOnTheScreen();
	});

	it("when open with data, shows Recent Activity title and Done button", () => {
		renderActivityModal(
			{ isModalOpen: true, setIsModalOpen: jest.fn() },
			{ data: defaultPaginatedData },
		);

		expect(screen.getByText("Recent Activity")).toBeOnTheScreen();
		expect(screen.getByLabelText("Done button")).toBeOnTheScreen();
		expect(screen.getByText("Done")).toBeOnTheScreen();
	});

	it("when open with activity items, list shows item description and amount", () => {
		const items = [
			createActivityItem({
				id: "m1",
				description: "Refund",
				amount: 1000,
				currency: "GBP",
			}),
		];
		renderActivityModal(
			{ isModalOpen: true, setIsModalOpen: jest.fn() },
			{ data: { items, next_cursor: null, has_more: false } },
		);

		expect(screen.getByText("Refund")).toBeOnTheScreen();
		expect(screen.getByText("£10.00")).toBeOnTheScreen();
	});

	it("when Done is pressed, calls setIsModalOpen with false", () => {
		const setIsModalOpen = jest.fn();
		renderActivityModal(
			{ isModalOpen: true, setIsModalOpen },
			{ data: defaultPaginatedData },
		);

		fireEvent.press(screen.getByLabelText("Done button"));

		expect(setIsModalOpen).toHaveBeenCalledWith(false);
	});

	it("when fetching more, shows Loading more text", () => {
		renderActivityModal(
			{ isModalOpen: true, setIsModalOpen: jest.fn() },
			{ data: defaultPaginatedData, isFetching: true },
		);

		expect(screen.getByText("Loading more...")).toBeOnTheScreen();
	});
});
