import type { Currency } from "@/types/api";

export const currencyFormatter = (currency: Currency): string => {
	switch (currency) {
		case "EUR":
			return "€";
		case "GBP":
			return "£";
		default:
			return currency;
	}
};

export const formatCurrency = (
	amountInMinorUnits: number,
	currency: Currency,
): string => {
	const amount = amountInMinorUnits
		? amountInMinorUnits / 100
		: amountInMinorUnits;

	if (currency === "GBP") {
		return new Intl.NumberFormat("en-GB", {
			style: "currency",
			currency: "GBP",
		}).format(amount);
	}
	if (currency === "EUR") {
		return new Intl.NumberFormat("en-EUR", {
			style: "currency",
			currency: "EUR",
		}).format(amount);
	}
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: currency,
	}).format(amount);
};

export const formatCurrencyForInput = (amount: number): string => {
	return (amount / 100).toFixed(2);
};

export const parseAmount = (amount: string): number => {
	if (amount === "") {
		return 0;
	}
	const parsedAmount = Number.parseFloat(amount);
	if (Number.isNaN(parsedAmount)) {
		return 0;
	}
	return parsedAmount;
};

/**
 * Parses user input to cents.
 * - Empty or invalid → undefined (placeholder).
 * - Input with decimal (e.g. "23.23", "0.01") = major units → cents.
 * - Whole number (e.g. "1", "100") = cents (so "1" → 1 cent → display "0.01").
 */
export const parseAmountInputToCents = (text: string): number | undefined => {
	const trimmed = text.trim();
	if (trimmed === "") {
		return undefined;
	}
	if (trimmed.includes(".")) {
		const parsed = Number.parseFloat(trimmed);
		if (Number.isNaN(parsed) || parsed < 0) {
			return undefined;
		}
		return Math.round(parsed * 100);
	}
	const parsed = Number.parseInt(trimmed, 10);
	if (Number.isNaN(parsed) || parsed < 0) {
		return undefined;
	}
	return parsed;
};
