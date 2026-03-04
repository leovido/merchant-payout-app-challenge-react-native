import { render, screen } from "@testing-library/react-native";
import type { FetchState } from "@/app/types/types";
import { FetchStatus } from "@/app/types/types";
import { BalanceSection } from "@/features/balances/components/BalanceSection";
import type { BalanceState } from "@/features/balances/data/balanceSlice";
import { convertData } from "@/features/balances/helpers/convertData";
import type { BalanceResponse } from "@/types/api";

const mockUseBalance = jest.fn();

jest.mock("@/hooks/useBalance", () => ({
	useBalance: (_strategy: unknown) => mockUseBalance(),
}));

jest.mock("@/api/strategies/RTKFetchingStrategy", () => ({
	RTKFetchingStrategy: jest.fn(),
}));

function toState(overrides: {
	data?: BalanceResponse;
	isLoading?: boolean;
	isError?: boolean;
}): FetchState<BalanceState> {
	if (overrides.isLoading) return { status: FetchStatus.LOADING };
	if (overrides.isError)
		return { status: FetchStatus.ERROR, error: new Error() };
	if (overrides.data != null)
		return { status: FetchStatus.SUCCESS, data: convertData(overrides.data) };
	return {
		status: FetchStatus.SUCCESS,
		data: convertData({
			available_balance: 0,
			pending_balance: 0,
			currency: "GBP",
		}),
	};
}

function renderBalanceSection(
	overrides?: Partial<{
		data: BalanceResponse | undefined;
		isLoading: boolean;
		isError: boolean;
	}>,
) {
	mockUseBalance.mockReturnValue({ state: toState(overrides ?? {}) });

	return render(
		<BalanceSection>
			<BalanceSection.Title />
			<BalanceSection.BalanceTypeContainer>
				<BalanceSection.BalanceType type="Available" />
				<BalanceSection.BalanceType type="Pending" />
			</BalanceSection.BalanceTypeContainer>
		</BalanceSection>,
	);
}

describe("BalanceSection", () => {
	beforeEach(() => {
		mockUseBalance.mockClear();
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it("renders section with Account balance accessibility label and summary role", () => {
		renderBalanceSection();

		const section = screen.getByLabelText("Account balance");
		expect(section).toBeOnTheScreen();
		expect(section).toHaveProp("accessibilityRole", "summary");
	});

	it("renders title with text Account Balance", () => {
		renderBalanceSection();

		expect(screen.getByText("Account Balance")).toBeOnTheScreen();
	});

	it("when loading, shows skeleton and does not render balance content", () => {
		renderBalanceSection({ isLoading: true });

		expect(screen.getByLabelText("Account balance")).toBeOnTheScreen();
		expect(screen.queryByText("Account Balance")).not.toBeOnTheScreen();
	});

	it("when loading, BalanceType rows with loading labels are not rendered", () => {
		renderBalanceSection({ isLoading: true });

		expect(
			screen.queryByLabelText("Available balance, loading"),
		).not.toBeOnTheScreen();
		expect(
			screen.queryByLabelText("Pending balance, loading"),
		).not.toBeOnTheScreen();
	});

	it("when error, BalanceTypeContainer shows error message", () => {
		renderBalanceSection({ isError: true });

		expect(screen.getByText("Error loading balance type")).toBeOnTheScreen();
	});

	it("when error, error message has alert role and accessible label", () => {
		renderBalanceSection({ isError: true });

		const alert = screen.getByLabelText("Error loading balance type");
		expect(alert).toBeOnTheScreen();
		expect(alert).toHaveProp("accessibilityRole", "alert");
	});

	it("when success with balance data, shows formatted Available and Pending amounts", () => {
		renderBalanceSection({
			data: {
				available_balance: 10000,
				pending_balance: 500,
				currency: "GBP",
			},
		});

		expect(screen.getByText("Available")).toBeOnTheScreen();
		expect(screen.getByText("Pending")).toBeOnTheScreen();
		// formatCurrency(10000, 'GBP') => "£100.00", formatCurrency(500, 'GBP') => "£5.00"
		expect(screen.getByText("£100.00")).toBeOnTheScreen();
		expect(screen.getByText("£5.00")).toBeOnTheScreen();
	});

	it("when success, balance rows have combined accessibility labels", () => {
		renderBalanceSection({
			data: {
				available_balance: 10000,
				pending_balance: 500,
				currency: "GBP",
			},
		});

		expect(
			screen.getByLabelText("Available balance, £100.00"),
		).toBeOnTheScreen();
		expect(screen.getByLabelText("Pending balance, £5.00")).toBeOnTheScreen();
	});

	it("when success with EUR, shows formatted amount from formatter", () => {
		jest
			.spyOn(require("@/utils/formatter"), "formatCurrency")
			.mockReturnValue("€25.00");
		renderBalanceSection({
			data: {
				available_balance: 2500,
				pending_balance: 0,
				currency: "EUR",
			},
		});

		expect(
			screen.getByLabelText("Available balance, €25.00"),
		).toBeOnTheScreen();
	});
});
