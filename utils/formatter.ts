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
