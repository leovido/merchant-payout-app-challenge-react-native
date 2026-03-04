import type { Currency } from "./api";

export interface CurrencySymbol {
	GBP: "£";
	EUR: "€";
}
export type PendingBalance = number;
export type AvailableBalance = number;
export type FormattedAmountWithCurrency =
	`${CurrencySymbol[Currency]}${string}`;
export type BalanceType = "Available" | "Pending";
