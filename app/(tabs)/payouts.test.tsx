import { configureStore } from "@reduxjs/toolkit";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Provider } from "react-redux";
import screenSecurityMock from "screen-security";
import { apiSlice } from "@/api/apiSlice";
import PayoutsScreen from "@/app/(tabs)/payouts";
import activityReducer from "@/features/activity/activitySlice";
import balanceReducer from "@/features/balances/balanceSlice";
import payoutReducer from "@/features/payout/payoutSlice";
import type { CreatePayoutRequest } from "@/types/api";

const mockGetDeviceId = jest.fn();
let capturedPayoutBody: CreatePayoutRequest | undefined;

const mockCreatePayout = jest.fn((body: CreatePayoutRequest) => {
	capturedPayoutBody = body;
	return Promise.resolve({
		data: {
			id: "1",
			status: "completed",
			amount: body.amount,
			currency: body.currency,
			iban: body.iban,
			created_at: new Date().toISOString(),
		},
	});
});

jest.mock("@/api/apiSlice", () => {
	const actual =
		jest.requireActual<typeof import("@/api/apiSlice")>("@/api/apiSlice");
	return {
		...actual,
		useCreatePayoutMutation: () => [mockCreatePayout, { isLoading: false }],
	};
});

const basePayoutState = {
	amount: 100,
	currency: "GBP" as const,
	iban: "FR1212345123451234567A12310131231231",
	formattedAmount: "1.00",
	payoutResponse: undefined,
	errorMessage: undefined,
};

function createTestStore(device_id: string | undefined) {
	return configureStore({
		reducer: {
			balance: balanceReducer,
			activity: activityReducer,
			payout: payoutReducer,
			[apiSlice.reducerPath]: apiSlice.reducer,
		},
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(apiSlice.middleware),
		preloadedState: {
			payout: { ...basePayoutState, device_id },
		},
	});
}

function renderPayoutsWithStore(store: ReturnType<typeof createTestStore>) {
	return render(
		<Provider store={store}>
			<PayoutsScreen />
		</Provider>,
	);
}

describe("PayoutsScreen device_id in request body", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		capturedPayoutBody = undefined;
		(
			screenSecurityMock as unknown as {
				setGetDeviceIdImpl: (fn: () => string) => void;
			}
		).setGetDeviceIdImpl(mockGetDeviceId);
	});

	it("includes device_id in payout request when native module returns a value", async () => {
		mockGetDeviceId.mockReturnValue("device-abc-123");
		const testStore = createTestStore("device-abc-123");
		renderPayoutsWithStore(testStore);

		// Open confirm modal (form Confirm button)
		const formConfirmButton = screen.getByText("Confirm");
		act(() => {
			fireEvent.press(formConfirmButton);
		});

		// Confirm payout in modal (modal Confirm is the last button with this name)
		// This triggers async mutation, so we need to await act with async callback
		const confirmButtons = screen.getAllByRole("button", {
			name: "Confirm button",
		});
		await act(async () => {
			fireEvent.press(confirmButtons[confirmButtons.length - 1]);
		});

		expect(mockCreatePayout).toHaveBeenCalledTimes(1);
		expect(capturedPayoutBody).toBeDefined();
		expect(capturedPayoutBody?.device_id).toBe("device-abc-123");
	});

	it("omits device_id when native module returns empty string", async () => {
		mockGetDeviceId.mockReturnValue("");
		const testStore = createTestStore(undefined);
		renderPayoutsWithStore(testStore);

		act(() => {
			fireEvent.press(screen.getByText("Confirm"));
		});
		const confirmButtonsEmpty = screen.getAllByRole("button", {
			name: "Confirm button",
		});
		await act(async () => {
			fireEvent.press(confirmButtonsEmpty[confirmButtonsEmpty.length - 1]);
		});

		expect(mockCreatePayout).toHaveBeenCalledTimes(1);
		expect(capturedPayoutBody).toBeDefined();
		expect(capturedPayoutBody?.device_id).toBeUndefined();
	});

	it("omits device_id when native module returns undefined (e.g. unavailable)", async () => {
		mockGetDeviceId.mockReturnValue(undefined as unknown as string);
		const testStore = createTestStore(undefined);
		renderPayoutsWithStore(testStore);

		act(() => {
			fireEvent.press(screen.getByText("Confirm"));
		});
		const confirmButtonsUndef = screen.getAllByRole("button", {
			name: "Confirm button",
		});
		await act(async () => {
			fireEvent.press(confirmButtonsUndef[confirmButtonsUndef.length - 1]);
		});

		expect(mockCreatePayout).toHaveBeenCalledTimes(1);
		expect(capturedPayoutBody).toBeDefined();
		expect(capturedPayoutBody?.device_id).toBeUndefined();
	});
});
