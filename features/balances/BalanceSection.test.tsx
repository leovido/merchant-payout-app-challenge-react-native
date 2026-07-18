import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { BalanceSection } from "@/features/balances/BalanceSection";
import balanceReducer from "@/features/balances/balanceSlice";
import type { BalanceResponse } from "@/types/api";

const mockUseGetBalanceQuery = jest.fn();

jest.mock("@/api/apiSlice", () => {
	const actual = jest.requireActual("@/api/apiSlice");
	return {
		...actual,
		useGetBalanceQuery: () => mockUseGetBalanceQuery(),
	};
});

function renderBalanceSection(
	overrides?: Partial<{
		data: BalanceResponse | undefined;
		isLoading: boolean;
		isError: boolean;
		hydratedBalance?: BalanceResponse;
	}>,
) {
	const { hydratedBalance, ...queryOverrides } = overrides ?? {};
	const defaultState = {
		data: undefined,
		isLoading: false,
		isError: false,
		...queryOverrides,
	};
	mockUseGetBalanceQuery.mockReturnValue(defaultState);

	const store = configureStore({
		reducer: { balance: balanceReducer },
		preloadedState: hydratedBalance ? { balance: hydratedBalance } : undefined,
	});

	return render(
		<Provider store={store}>
			<BalanceSection>
				<BalanceSection.Title />
				<BalanceSection.BalanceTypeContainer>
					<BalanceSection.BalanceType type="Available" />
					<BalanceSection.BalanceType type="Pending" />
				</BalanceSection.BalanceTypeContainer>
			</BalanceSection>
		</Provider>,
	);
}

describe("BalanceSection", () => {
	beforeEach(() => {
		mockUseGetBalanceQuery.mockReset();
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

	it("when loading without hydrated balance, shows dash for both balance amounts", () => {
		renderBalanceSection({ isLoading: true });

		const availableAmounts = screen.getAllByText("-");
		expect(availableAmounts.length).toBeGreaterThanOrEqual(2);
	});

	it("when loading without hydrated balance, exposes loading state in accessibility labels", () => {
		renderBalanceSection({ isLoading: true });

		expect(
			screen.getByLabelText("Available balance, loading"),
		).toBeOnTheScreen();
		expect(screen.getByLabelText("Pending balance, loading")).toBeOnTheScreen();
	});

	it("when loading with hydrated balance, shows last-known amounts immediately", () => {
		renderBalanceSection({
			isLoading: true,
			hydratedBalance: {
				available_balance: 10000,
				pending_balance: 500,
				currency: "GBP",
			},
		});

		expect(screen.getByText("£100.00")).toBeOnTheScreen();
		expect(screen.getByText("£5.00")).toBeOnTheScreen();
		expect(
			screen.getByLabelText("Available balance, £100.00"),
		).toBeOnTheScreen();
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
