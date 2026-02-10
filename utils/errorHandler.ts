import type { MerchantApiError } from "@/api/types";
import {
	BiometricsError,
	isBiometricsNotEnrolledError,
} from "./biometricsErrors";

export { isBiometricsNotEnrolledError };

const DEFAULT_MESSAGE =
	"Service temporarily unavailable. Please try again later.";

function isApiError(error: unknown): error is MerchantApiError {
	const e = error as MerchantApiError;
	return e?.data?.error !== undefined;
}

export default function extractErrorMessage(error: unknown): string {
	const biometrics = BiometricsError.from(error);
	if (biometrics) return biometrics.message;

	if (error instanceof Error) return error.message;

	if (isApiError(error)) return error.data.error;

	// Native rejections sometimes send { code, message } as a plain object.
	const native = error as { message?: string };
	if (typeof native?.message === "string") return native.message;

	return DEFAULT_MESSAGE;
}
