import type { MerchantApiError } from "@/api/types";
import {
	getBiometricsMessage,
	getBiometricsMessageFromErrorMessage,
	isBiometricsNotEnrolledError,
} from "./biometricsErrors";

export { isBiometricsNotEnrolledError };

const DEFAULT_MESSAGE =
	"Service temporarily unavailable. Please try again later.";

function isApiError(error: unknown): error is MerchantApiError {
	const e = error as MerchantApiError;

	return e.data.error !== undefined;
}

export default function extractErrorMessage(error: unknown): string {
	// Prefer native biometric code so we show a clean message (Android sends a long wrapper message).
	const biometricMessage = getBiometricsMessage(error);
	if (biometricMessage) return biometricMessage;

	if (error instanceof Error) {
		const messageFromError = getBiometricsMessageFromErrorMessage(error);
		if (messageFromError) return messageFromError;
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
