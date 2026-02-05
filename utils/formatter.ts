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
	} else if (currency === "EUR") {
		return new Intl.NumberFormat("en-EUR", {
			style: "currency",
			currency: "EUR",
		}).format(amount);
	} else {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency,
		}).format(amount);
	}
};
