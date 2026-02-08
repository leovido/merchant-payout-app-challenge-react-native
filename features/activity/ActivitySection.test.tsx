import { fireEvent, render, screen } from "@testing-library/react-native";
import { ActivitySection } from "@/features/activity/ActivitySection";
import type { ActivityItem, PaginatedActivityResponse } from "@/types/api";

const mockUseGetPaginatedActivityQuery = jest.fn();

jest.mock("@/api/apiSlice", () => ({
	useGetPaginatedActivityQuery: (args?: { limit?: number; cursor?: string }) =>
		mockUseGetPaginatedActivityQuery(args),
}));

const defaultActivityData: PaginatedActivityResponse = {
	items: [],
	next_cursor: null,
	has_more: false,
};

function createActivityItem(overrides?: Partial<ActivityItem>): ActivityItem {
	return {
		id: "act-1",
		type: "payout",
		amount: -1000,
		currency: "GBP",
		date: "07/02/2025",
		description: "Payout to bank",
		status: "completed",
		...overrides,
	};
}

function renderActivitySection(
	overrides?: Partial<{
		data: PaginatedActivityResponse | undefined;
		isLoading: boolean;
	}>,
) {
	const state = {
		data: defaultActivityData,
		isLoading: false,
		...overrides,
	};
	mockUseGetPaginatedActivityQuery.mockReturnValue(state);

	return render(
		<ActivitySection>
			<ActivitySection.Title />
			<ActivitySection.List />
			<ActivitySection.Button />
			<ActivitySection.Modal />
		</ActivitySection>,
	);
}

describe("ActivitySection", () => {
	beforeEach(() => {
		mockUseGetPaginatedActivityQuery.mockReset();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("renders title with Recent Activity text and accessibility", () => {
		renderActivitySection();

		const title = screen.getByText("Recent Activity");
		expect(title).toBeOnTheScreen();
		expect(screen.getByLabelText("Recent activity")).toBeOnTheScreen();
		expect(title).toHaveProp("accessibilityRole", "text");
	});

	it("renders Show more button with correct label and role", () => {
		renderActivitySection();

		const button = screen.getByLabelText("Show more activity");
		expect(button).toBeOnTheScreen();
		expect(button).toHaveProp("accessibilityRole", "button");
		expect(screen.getByText("Show more")).toBeOnTheScreen();
	});

	it("when activity is empty, section and button are visible", () => {
		renderActivitySection({ data: { ...defaultActivityData, items: [] } });

		expect(screen.getByText("Recent Activity")).toBeOnTheScreen();
		expect(screen.getByLabelText("Show more activity")).toBeOnTheScreen();
	});

	it("when activity has items, list shows first item description and amount", () => {
		const items = [
			createActivityItem({
				id: "a1",
				description: "Payout to bank",
				amount: -500,
				currency: "GBP",
			}),
		];
		renderActivitySection({
			data: { items, next_cursor: null, has_more: false },
		});

		expect(screen.getByText("Payout to bank")).toBeOnTheScreen();
		expect(screen.getByText("-£5.00")).toBeOnTheScreen();
	});

	it("when Show more is pressed, modal opens and shows Done button", () => {
		renderActivitySection();

		const button = screen.getByLabelText("Show more activity");
		fireEvent.press(button);

		expect(screen.getByLabelText("Done button")).toBeOnTheScreen();
	});
});
