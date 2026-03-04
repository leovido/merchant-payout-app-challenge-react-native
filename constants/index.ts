/**
 * API Configuration
 */
export const API_BASE_URL = "http://localhost:3000";

/** IBAN REGEX: 2 letters (country) + 2 digits (check) + 4–30 alphanumeric (no spaces) */
export const IBAN_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/;

export const API_ROUTES = {
	balance: "/api/merchant",
	activity: "/api/merchant/activity",
	payouts: "/api/payouts",
} as const;
