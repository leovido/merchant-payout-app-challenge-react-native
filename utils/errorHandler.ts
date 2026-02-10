import type { MerchantApiError } from "@/api/types";

const DEFAULT_MESSAGE =
	"Service temporarily unavailable. Please try again later.";

/** Map of native biometric error codes to user-facing messages (used on both iOS and Android). */
const BIOMETRICS_MESSAGES: Record<string, string> = {
	BIOMETRICS_USER_CANCEL: "Biometric authentication was cancelled.",
	BIOMETRICS_UNAVAILABLE: "Biometrics are not available on this device.",
	BIOMETRICS_NOT_ENROLLED: "No biometrics are enrolled.",
	BIOMETRICS_AUTH_FAILED: "Biometric authentication failed.",
	BIOMETRICS_LOCKOUT:
		"Too many failed attempts. Biometrics are temporarily locked.",
	BIOMETRICS_SYSTEM_CANCEL: "Authentication was cancelled by the system.",
	BIOMETRICS_USER_FALLBACK: "User chose alternative authentication.",
};

function isApiError(error: unknown): error is MerchantApiError {
	const e = error as MerchantApiError;

	return e.data.error !== undefined;
}

/** True if the error has a biometric code (from native module). */
function getBiometricsCode(error: unknown): string | null {
	const code = (error as { code?: string })?.code;
	return typeof code === "string" && code in BIOMETRICS_MESSAGES ? code : null;
}

export function isBiometricsNotEnrolledError(error: unknown): boolean {
	const code = getBiometricsCode(error);
	if (code) return code === "BIOMETRICS_NOT_ENROLLED";
	return (
		error instanceof Error && error.message.includes("BIOMETRICS_NOT_ENROLLED")
	);
}

export default function extractErrorMessage(error: unknown): string {
	// Prefer native biometric code so we show a clean message (Android sends a long wrapper message).
	const biometricCode = getBiometricsCode(error);
	if (biometricCode) return BIOMETRICS_MESSAGES[biometricCode];

	if (error instanceof Error) {
		// Legacy: message itself was the code (e.g. "BIOMETRICS_USER_CANCEL").
		if (error.message in BIOMETRICS_MESSAGES) {
			return BIOMETRICS_MESSAGES[error.message];
		}
		return error.message;
	}
	if (isApiError(error)) {
		return (error as MerchantApiError).data.error;
	}
	// Native rejections sometimes send { code, message } as a plain object.
	const native = error as { message?: string };
	if (typeof native?.message === "string") return native.message;
	return DEFAULT_MESSAGE;
}
