import { fireEvent, render, screen } from "@testing-library/react-native";
import { ActivitySection } from "@/features/activity/components/ActivitySection";
import type { UsePaginatedActivityReturn } from "@/hooks/usePaginatedActivity";
import {
	createActivityItem,
	defaultPaginatedActivity,
	defaultPaginatedData,
} from "../data/test-fixtures";

const mockUseGetPaginatedActivityQuery = jest.fn();

jest.mock("@/api/apiSlice", () => ({
	useGetPaginatedActivityQuery: (args?: { limit?: number; cursor?: string }) =>
		mockUseGetPaginatedActivityQuery(args),
}));

function renderActivitySection(
	paginatedActivity: Partial<UsePaginatedActivityReturn>,
) {
	const data = {
		data: { ...paginatedActivity.activityData, ...paginatedActivity },
		isLoading: paginatedActivity.isActivityLoading,
		isFetching: paginatedActivity.isActivityFetching,
		refetch: paginatedActivity.refetch,
		cursor: paginatedActivity.cursor,
		setCursor: paginatedActivity.setCursor,
	};
	mockUseGetPaginatedActivityQuery.mockReturnValue(data);

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

	it("renders section with accessibility label and summary role", () => {
		renderActivitySection(defaultPaginatedActivity);

		const section = screen.getByLabelText("Recent activity section");
		expect(section).toBeOnTheScreen();
		expect(section).toHaveProp("accessibilityRole", "summary");
	});

	it("renders title with Recent activity label and text role", () => {
		renderActivitySection(defaultPaginatedActivity);

		const title = screen.getByLabelText("Recent activity");
		expect(title).toBeOnTheScreen();
		expect(title).toHaveProp("accessibilityRole", "text");
		expect(screen.getByText("Recent Activity")).toBeOnTheScreen();
	});

	it("renders Show more button with label and button role", () => {
		renderActivitySection(defaultPaginatedActivity);

		const button = screen.getByLabelText("Show more activity");
		expect(button).toBeOnTheScreen();
		expect(button).toHaveProp("accessibilityRole", "button");
	});

	it("renders activity list with accessibility label and list role", () => {
		renderActivitySection(defaultPaginatedActivity);

		const list = screen.getByLabelText("Recent activity list");
		expect(list).toBeOnTheScreen();
		expect(list).toHaveProp("accessibilityRole", "list");
	});

	it("when activity is empty, section and button are visible", () => {
		renderActivitySection({
			...defaultPaginatedActivity,
			activityData: { ...defaultPaginatedData, items: [] },
		});

		expect(screen.getByLabelText("Recent activity section")).toBeOnTheScreen();
		expect(screen.getByLabelText("Show more activity")).toBeOnTheScreen();
	});

	it("when activity has items, list shows first item via description and amount labels", () => {
		const items = [
			createActivityItem({
				id: "a1",
				description: "Payout to bank",
				amount: -500,
			}),
		];
		renderActivitySection({
			...defaultPaginatedActivity,
			activityData: {
				...defaultPaginatedData,
				items,
				next_cursor: null,
				has_more: false,
			},
		});

		expect(screen.getByLabelText("Payout to bank")).toBeOnTheScreen();
		expect(screen.getByLabelText("Amount, -£5.00")).toBeOnTheScreen();
	});

	it("when Show more is pressed, modal opens and shows Done button", () => {
		renderActivitySection(defaultPaginatedActivity);

		const button = screen.getByLabelText("Show more activity");
		fireEvent.press(button);

		expect(screen.getByLabelText("Done")).toBeOnTheScreen();
	});
});
