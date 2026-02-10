import type { MerchantApiError } from "@/api/types";

const DEFAULT_MESSAGE =
	"Service temporarily unavailable. Please try again later.";

function isApiError(error: unknown): error is MerchantApiError {
	const e = error as MerchantApiError;

	return e.data.error !== undefined;
}

export default function extractErrorMessage(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	} else if (isApiError(error)) {
		return (error as MerchantApiError).data.error;
	} else {
		return DEFAULT_MESSAGE;
	}
}
