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

	return DEFAULT_MESSAGE;
}
