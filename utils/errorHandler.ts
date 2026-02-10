import type { MerchantApiError } from "@/api/types";

const DEFAULT_MESSAGE =
	"Service temporarily unavailable. Please try again later.";

function isApiError(error: unknown): error is MerchantApiError {
	const e = error as MerchantApiError;

	return e.data.error !== undefined;
}

function parseBiometricsError(error: unknown): string {
	if (error instanceof Error) {
		if (error.message === "BIOMETRICS_NOT_ENROLLED") {
			return "Biometrics not enrolled";
		} else if (error.message === "BIOMETRICS_AUTH_FAILED") {
			return "Authentication failed";
		} else if (error.message === "BIOMETRICS_USER_CANCEL") {
			return "Biometric authentication was cancelled";
		} else if (error.message === "BIOMETRICS_UNKNOWN_ERROR") {
			return "Unknown error";
		}
		return error.message;
	} else {
		return DEFAULT_MESSAGE;
	}
}

export default function extractErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		if (error.message.includes("BIOMETRICS")) {
			return parseBiometricsError(error);
		} else {
			return error.message;
		}
	} else if (isApiError(error)) {
		return (error as MerchantApiError).data.error;
	} else {
		return DEFAULT_MESSAGE;
	}
}
