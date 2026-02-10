/** Map of native biometric error codes to user-facing messages (used on both iOS and Android). */
export const BIOMETRICS_MESSAGES: Record<string, string> = {
	BIOMETRICS_USER_CANCEL: "Biometric authentication was cancelled.",
	BIOMETRICS_UNAVAILABLE: "Biometrics are not available on this device.",
	BIOMETRICS_NOT_ENROLLED: "No biometrics are enrolled.",
	BIOMETRICS_AUTH_FAILED: "Biometric authentication failed.",
	BIOMETRICS_LOCKOUT:
		"Too many failed attempts. Biometrics are temporarily locked.",
	BIOMETRICS_SYSTEM_CANCEL: "Authentication was cancelled by the system.",
	BIOMETRICS_USER_FALLBACK: "User chose alternative authentication.",
};

/** True if the error has a biometric code (from native module). Returns the code or null. */
export function getBiometricsCode(error: unknown): string | null {
	const code = (error as { code?: string })?.code;
	return typeof code === "string" && code in BIOMETRICS_MESSAGES ? code : null;
}

/** User-facing message for a known biometric error, or null if not a biometric error. */
export function getBiometricsMessage(error: unknown): string | null {
	const code = getBiometricsCode(error);
	return code ? BIOMETRICS_MESSAGES[code] : null;
}

/** When the code is in Error.message (e.g. iOS NSError). */
export function getBiometricsMessageFromErrorMessage(
	error: Error,
): string | null {
	return error.message in BIOMETRICS_MESSAGES
		? BIOMETRICS_MESSAGES[error.message]
		: null;
}

export function isBiometricsNotEnrolledError(error: unknown): boolean {
	const code = getBiometricsCode(error);
	if (code) return code === "BIOMETRICS_NOT_ENROLLED";
	return (
		error instanceof Error && error.message.includes("BIOMETRICS_NOT_ENROLLED")
	);
}
