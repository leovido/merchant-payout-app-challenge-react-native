import { configureStore } from "@reduxjs/toolkit";
import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Provider } from "react-redux";
import { IBAN_ERROR_MESSAGES, IbanParseError } from "@/features/payout/iban";
import { PayoutScreen } from "@/features/payout/PayoutScreen";
import payoutReducer from "@/features/payout/payoutSlice";

const mockKeyboardDismiss = jest.fn();
const mockRemove = jest.fn();
const keyboardListeners = new Map<string, () => void>();

const mockKeyboard = {
	dismiss: mockKeyboardDismiss,
	addListener: jest.fn((event: string, callback: () => void) => {
		keyboardListeners.set(event, callback);
		return { remove: mockRemove };
	}),
};

jest.mock("@/hooks/useKeyboard", () => ({
	useKeyboard: () => ({
		Keyboard: mockKeyboard,
		keyboardStatus: "Keyboard Hidden",
	}),
}));

const VALID_IBAN = "GB82WEST12345698765432";
const IBAN_PLACEHOLDER = "e.g. GB29 NWBK 6016 1331 9268 19";

function createTestStore(iban = "") {
	return configureStore({
		reducer: {
			payout: payoutReducer,
		},
		preloadedState: {
			payout: {
				amount: undefined,
				currency: "GBP" as const,
				iban,
				formattedAmount: "",
				payoutResponse: undefined,
				errorMessage: undefined,
				device_id: undefined,
			},
		},
	});
}

function renderIBANTextField(iban = "") {
	const store = createTestStore(iban);
	const result = render(
		<Provider store={store}>
			<PayoutScreen>
				<PayoutScreen.IBANTextField />
			</PayoutScreen>
		</Provider>,
	);
	return { ...result, store };
}

function getIbanInput() {
	return screen.getByPlaceholderText(IBAN_PLACEHOLDER);
}

describe("PayoutScreen.IBANTextField", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		keyboardListeners.clear();
	});

	it("renders label, hint, and input", () => {
		renderIBANTextField();

		expect(screen.getByText("IBAN")).toBeOnTheScreen();
		expect(
			screen.getByText("Enter the destination bank account IBAN."),
		).toBeOnTheScreen();
		expect(getIbanInput()).toBeOnTheScreen();
	});

	it("shows the IBAN value from store", () => {
		renderIBANTextField(VALID_IBAN);

		expect(getIbanInput()).toHaveProp("value", VALID_IBAN);
	});

	it("uppercases and strips invalid characters on change", () => {
		const { store } = renderIBANTextField();

		fireEvent.changeText(getIbanInput(), "gb82 west!@#1234");

		expect(store.getState().payout.iban).toBe("GB82 WEST1234");
	});

	it("truncates input to 34 characters", () => {
		const { store } = renderIBANTextField();

		fireEvent.changeText(getIbanInput(), "A".repeat(40));

		expect(store.getState().payout.iban).toBe("A".repeat(34));
	});

	it("does not show an error on blur when the field is empty", () => {
		renderIBANTextField();

		fireEvent(getIbanInput(), "blur");

		expect(
			screen.queryByText(IBAN_ERROR_MESSAGES[IbanParseError.Empty]),
		).toBeNull();
	});

	it("does not show an error on blur for a valid IBAN", () => {
		renderIBANTextField();

		fireEvent.changeText(getIbanInput(), VALID_IBAN);
		fireEvent(getIbanInput(), "blur");

		expect(
			screen.queryByText(IBAN_ERROR_MESSAGES[IbanParseError.InvalidChecksum]),
		).toBeNull();
		expect(
			screen.queryByText(IBAN_ERROR_MESSAGES[IbanParseError.InvalidStructure]),
		).toBeNull();
	});

	it.each([
		{
			name: "invalid structure",
			input: "NOTANIBAN",
			error: IbanParseError.InvalidStructure,
		},
		{
			name: "unknown country",
			input: "ZZ8212345698765432123456",
			error: IbanParseError.UnknownCountry,
		},
		{
			name: "invalid length",
			input: "GB82WEST1234569876543",
			error: IbanParseError.InvalidLength,
		},
		{
			name: "invalid checksum",
			input: "GB82WEST12345698765433",
			error: IbanParseError.InvalidChecksum,
		},
	] as const)("shows $name error on blur", ({ input, error }) => {
		renderIBANTextField();

		fireEvent.changeText(getIbanInput(), input);
		fireEvent(getIbanInput(), "blur");

		expect(screen.getByText(IBAN_ERROR_MESSAGES[error])).toBeOnTheScreen();
	});

	it("clears the error when the user edits after a failed validation", () => {
		renderIBANTextField();

		fireEvent.changeText(getIbanInput(), "NOTANIBAN");
		fireEvent(getIbanInput(), "blur");
		expect(
			screen.getByText(IBAN_ERROR_MESSAGES[IbanParseError.InvalidStructure]),
		).toBeOnTheScreen();

		fireEvent.changeText(getIbanInput(), "NOTANIBA");

		expect(
			screen.queryByText(IBAN_ERROR_MESSAGES[IbanParseError.InvalidStructure]),
		).toBeNull();
	});

	it("validates and dismisses the keyboard on submit editing", () => {
		renderIBANTextField();

		fireEvent.changeText(getIbanInput(), "NOTANIBAN");
		fireEvent(getIbanInput(), "submitEditing");

		expect(mockKeyboardDismiss).toHaveBeenCalledTimes(1);
		expect(
			screen.getByText(IBAN_ERROR_MESSAGES[IbanParseError.InvalidStructure]),
		).toBeOnTheScreen();
	});

	it("validates on keyboard hide only when the field was focused", () => {
		renderIBANTextField();

		fireEvent.changeText(getIbanInput(), "NOTANIBAN");
		act(() => {
			keyboardListeners.get("keyboardDidHide")?.();
		});
		expect(
			screen.queryByText(IBAN_ERROR_MESSAGES[IbanParseError.InvalidStructure]),
		).toBeNull();

		fireEvent(getIbanInput(), "focus");
		act(() => {
			keyboardListeners.get("keyboardDidHide")?.();
		});
		expect(
			screen.getByText(IBAN_ERROR_MESSAGES[IbanParseError.InvalidStructure]),
		).toBeOnTheScreen();
	});

	it("removes the keyboard listener on unmount", () => {
		const { unmount } = renderIBANTextField();

		unmount();

		expect(mockRemove).toHaveBeenCalled();
	});
});
