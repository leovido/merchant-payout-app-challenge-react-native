import { render } from "@testing-library/react-native";
import { Alert, Linking } from "react-native";
import screenSecurity from "screen-security";
import { useBiometrics } from "./useBiometrics";

// -----------------------------------------------------------------------------
// Mocks
// -----------------------------------------------------------------------------

const screenSecurityMock = screenSecurity as unknown as {
	isBiometricAuthenticated: () => Promise<boolean>;
	setIsBiometricAuthenticatedImpl: (fn: () => Promise<boolean>) => void;
};

jest.spyOn(Alert, "alert").mockImplementation(() => {});
jest.spyOn(Linking, "openSettings").mockResolvedValue(undefined);

jest.mock("@/utils/errorHandler", () => ({
	__esModule: true,
	default: jest.fn((err: unknown) =>
		err instanceof Error ? err.message : "Unknown error",
	),
	isBiometricsNotEnrolledError: jest.fn(),
}));

const errorHandler = jest.requireMock("@/utils/errorHandler") as {
	default: jest.Mock;
	isBiometricsNotEnrolledError: jest.Mock;
};

// -----------------------------------------------------------------------------
// Tests
// -----------------------------------------------------------------------------

describe("useBiometrics", () => {
	const BIOMETRIC_THRESHOLD = 100_000;

	let validateBiometricAuthentication: (amount: number) => Promise<boolean>;
	let handleBiometricsNotEnrolledError: (
		error: unknown,
	) => void | Promise<void>;

	function renderHook() {
		function Wrapper() {
			const api = useBiometrics();
			validateBiometricAuthentication = api.validateBiometricAuthentication;
			handleBiometricsNotEnrolledError = api.handleBiometricsNotEnrolledError;
			return null;
		}
		render(<Wrapper />);
	}

	function setBiometricResult(result: boolean) {
		screenSecurityMock.setIsBiometricAuthenticatedImpl(() =>
			Promise.resolve(result),
		);
	}

	function setBiometricSpy() {
		const spy = jest.fn().mockResolvedValue(true);
		screenSecurityMock.setIsBiometricAuthenticatedImpl(spy);
		return spy;
	}

	beforeEach(() => {
		jest.clearAllMocks();
		setBiometricResult(true);
		renderHook();
	});

	describe("validateBiometricAuthentication", () => {
		describe("when amount is at or below threshold (≤ £1,000)", () => {
			it.each<number>([
				0, 50_000, 99_999, 100_000,
			])("returns true without prompting biometrics (amount: %s)", async (amount) => {
				const spy = setBiometricSpy();
				renderHook();

				const result = await validateBiometricAuthentication(amount);

				expect(result).toBe(true);
				expect(spy).not.toHaveBeenCalled();
			});
		});

		describe("when amount is over threshold (> £1,000)", () => {
			it("prompts biometrics and returns true when user authenticates", async () => {
				const spy = setBiometricSpy();

				const result = await validateBiometricAuthentication(
					BIOMETRIC_THRESHOLD + 1,
				);

				expect(spy).toHaveBeenCalledTimes(1);
				expect(result).toBe(true);
			});

			it("prompts biometrics and returns false when auth fails", async () => {
				setBiometricResult(false);

				const result = await validateBiometricAuthentication(
					BIOMETRIC_THRESHOLD + 1,
				);

				expect(result).toBe(false);
			});

			it("prompts biometrics for amounts above threshold", async () => {
				const spy = setBiometricSpy();

				const result = await validateBiometricAuthentication(
					BIOMETRIC_THRESHOLD + 1,
				);

				expect(spy).toHaveBeenCalledTimes(1);
				expect(result).toBe(true);
			});
		});

		describe("error handling", () => {
			it("rethrows with extracted message when native biometrics throws", async () => {
				const nativeError = new Error("BIOMETRICS_LOCKOUT");
				screenSecurityMock.setIsBiometricAuthenticatedImpl(() =>
					Promise.reject(nativeError),
				);
				renderHook();
				errorHandler.default.mockReturnValue("Too many failed attempts.");

				await expect(
					validateBiometricAuthentication(BIOMETRIC_THRESHOLD + 1),
				).rejects.toThrow("Too many failed attempts.");

				expect(errorHandler.default).toHaveBeenCalledWith(nativeError);
			});
		});
	});

	describe("handleBiometricsNotEnrolledError", () => {
		it("shows alert with Open Settings when error is biometrics-not-enrolled", () => {
			errorHandler.isBiometricsNotEnrolledError.mockReturnValue(true);

			handleBiometricsNotEnrolledError({
				code: "BIOMETRICS_NOT_ENROLLED",
			});

			expect(Alert.alert).toHaveBeenCalledWith(
				"Biometrics not set up",
				"To make payments over £1,000 you need Face ID or Touch ID. Set it up in Settings, then try again.",
				[
					{ text: "Cancel", style: "cancel" },
					expect.objectContaining({ text: "Open Settings" }),
				],
			);
		});

		it("opens Settings when user taps Open Settings", () => {
			errorHandler.isBiometricsNotEnrolledError.mockReturnValue(true);
			let openSettingsPress: () => void = () => {};
			(Alert.alert as jest.Mock).mockImplementation(
				(_title, _message, buttons) => {
					const btn = buttons?.find(
						(b: { text: string }) => b.text === "Open Settings",
					);
					if (btn?.onPress) openSettingsPress = btn.onPress;
				},
			);

			handleBiometricsNotEnrolledError({
				code: "BIOMETRICS_NOT_ENROLLED",
			});
			openSettingsPress();

			expect(Linking.openSettings).toHaveBeenCalled();
		});

		it("does nothing when error is not biometrics-not-enrolled", () => {
			errorHandler.isBiometricsNotEnrolledError.mockReturnValue(false);

			handleBiometricsNotEnrolledError(new Error("Other error"));

			expect(Alert.alert).not.toHaveBeenCalled();
		});
	});
});
