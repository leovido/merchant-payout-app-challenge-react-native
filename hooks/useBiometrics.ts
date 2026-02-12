import { Alert, Linking } from "react-native";
import { isBiometricAuthenticated } from "screen-security";
import extractErrorMessage, {
	isBiometricsNotEnrolledError,
} from "@/utils/errorHandler";

export const useBiometrics = () => {
	const validateBiometricAuthentication = async (amount: number) => {
		const requiresBiometricAuthentication = amount >= 100000;

		if (requiresBiometricAuthentication) {
			try {
				const isAuthenticated = await isBiometricAuthenticated();
				return isAuthenticated;
			} catch (error) {
				throw new Error(extractErrorMessage(error));
			}
		} else {
			return true;
		}
	};

	const handleBiometricsNotEnrolledError = async (error: unknown) => {
		if (isBiometricsNotEnrolledError(error)) {
			Alert.alert(
				"Biometrics not set up",
				"To make payments over £1,000 you need Face ID or Touch ID. Set it up in Settings, then try again.",
				[
					{ text: "Cancel", style: "cancel" },
					{
						text: "Open Settings",
						onPress: () => {
							Linking.openSettings().catch((error) => {
								console.error("Error opening settings", error);
							});
						},
					},
				],
			);
		} else {
			return;
		}
	};

	return { validateBiometricAuthentication, handleBiometricsNotEnrolledError };
};
