import { fireEvent, render, screen } from "@testing-library/react-native";
import { Divider } from "@/components/ui/Divider";
import { ActivityModal } from "@/features/activity/ActivityModal";
import {
	createActivityItem,
	defaultPaginatedActivity,
} from "@/features/activity/test-fixtures";
import type { UsePaginatedActivityReturn } from "@/hooks/useActivityModal";

function renderActivityModal({
	paginatedActivity,
	isModalOpen,
	setIsModalOpen,
}: {
	paginatedActivity: UsePaginatedActivityReturn;
	isModalOpen: boolean;
	setIsModalOpen: (isModalOpen: boolean) => void;
}) {
	return render(
		<ActivityModal
			paginatedActivity={paginatedActivity}
			isModalOpen={isModalOpen}
			setIsModalOpen={setIsModalOpen}
		>
			<ActivityModal.Content>
				<ActivityModal.LoadingSkeleton
					isLoading={paginatedActivity.isActivityLoading}
				/>
				<ActivityModal.Header />
				<Divider />
				<ActivityModal.List />
				<ActivityModal.LoadingMore />
			</ActivityModal.Content>
		</ActivityModal>,
	);
}

describe("ActivityModal", () => {
	it("shows loading state when data is loading", () => {
		renderActivityModal({
			paginatedActivity: {
				...defaultPaginatedActivity,
				isActivityLoading: true,
			},
			isModalOpen: true,
			setIsModalOpen: jest.fn(),
		});

		expect(screen.getByTestId("skeleton-placeholder")).toBeOnTheScreen();
	});

	it("when open with data, shows modal and header with accessibility labels", () => {
		renderActivityModal({
			paginatedActivity: defaultPaginatedActivity,
			isModalOpen: true,
			setIsModalOpen: jest.fn(),
		});

		expect(screen.getByLabelText("Recent activity modal")).toBeOnTheScreen();
		expect(screen.getByLabelText("Recent activity")).toBeOnTheScreen();
		expect(screen.getByLabelText("Done")).toBeOnTheScreen();
	});

	it("when open with activity items, list shows item via description and amount labels", () => {
		const items = [
			createActivityItem({
				id: "m1",
				type: "refund",
				description: "Refund",
				amount: 1000,
			}),
		];

		renderActivityModal({
			paginatedActivity: {
				...defaultPaginatedActivity,
				activityData: { items, next_cursor: null, has_more: false },
			},
			isModalOpen: true,
			setIsModalOpen: jest.fn(),
		});

		expect(screen.getByLabelText("Refund")).toBeOnTheScreen();
		expect(screen.getByLabelText("Amount, £10.00")).toBeOnTheScreen();
	});

	it("when Done is pressed, calls setIsModalOpen with false", () => {
		const setIsModalOpen = jest.fn();
		renderActivityModal({
			paginatedActivity: defaultPaginatedActivity,
			isModalOpen: true,
			setIsModalOpen,
		});

		fireEvent.press(screen.getByLabelText("Done"));

		expect(setIsModalOpen).toHaveBeenCalledWith(false);
	});

	it("when fetching more, shows Loading more text", () => {
		renderActivityModal({
			paginatedActivity: {
				...defaultPaginatedActivity,
				isActivityFetching: true,
				isActivityLoading: false,
				activityData: undefined,
			},
			isModalOpen: true,
			setIsModalOpen: jest.fn(),
		});

		expect(screen.getByText("Loading more...")).toBeOnTheScreen();
	});
});
