import payoutReducer, { setPayout } from "./payoutSlice";

describe("payoutSlice", () => {
	it("returns initial state when given undefined state and empty payload", () => {
		const state = payoutReducer(undefined, setPayout({}));
		expect(state.amount).toBeUndefined();
		expect(state.currency).toBe("GBP");
		expect(state.iban).toBe("");
		expect(state.formattedAmount).toBe("");
	});

	it("sets amount in cents and derives formattedAmount", () => {
		const state = payoutReducer(undefined, setPayout({ amount: 100 }));
		expect(state.amount).toBe(100);
		expect(state.formattedAmount).toBe("1.00");
	});

	it("formats 1 cent as 0.01", () => {
		const state = payoutReducer(undefined, setPayout({ amount: 1 }));
		expect(state.amount).toBe(1);
		expect(state.formattedAmount).toBe("0.01");
	});

	it("formats 2323 cents as 23.23", () => {
		const state = payoutReducer(undefined, setPayout({ amount: 2323 }));
		expect(state.amount).toBe(2323);
		expect(state.formattedAmount).toBe("23.23");
	});

	it("sets formattedAmount to empty string when amount is undefined", () => {
		const state = payoutReducer(undefined, setPayout({ amount: undefined }));
		expect(state.amount).toBeUndefined();
		expect(state.formattedAmount).toBe("");
	});

	it("updates currency and preserves formattedAmount when amount is set", () => {
		const withAmount = payoutReducer(undefined, setPayout({ amount: 500 }));
		const state = payoutReducer(withAmount, setPayout({ currency: "EUR" }));
		expect(state.amount).toBe(500);
		expect(state.currency).toBe("EUR");
		expect(state.formattedAmount).toBe("5.00");
	});

	it("merges partial payload and derives formattedAmount from merged amount", () => {
		const state = payoutReducer(
			undefined,
			setPayout({ amount: 1234, currency: "GBP", iban: "FR123" }),
		);
		expect(state.amount).toBe(1234);
		expect(state.currency).toBe("GBP");
		expect(state.iban).toBe("FR123");
		expect(state.formattedAmount).toBe("12.34");
	});

	it("updates iban without changing amount or formattedAmount", () => {
		const withAmount = payoutReducer(undefined, setPayout({ amount: 100 }));
		const state = payoutReducer(withAmount, setPayout({ iban: "DE89370400440532013000" }));
		expect(state.amount).toBe(100);
		expect(state.formattedAmount).toBe("1.00");
		expect(state.iban).toBe("DE89370400440532013000");
	});

	it("clears formattedAmount when amount is set to undefined after having a value", () => {
		const withAmount = payoutReducer(undefined, setPayout({ amount: 50 }));
		expect(withAmount.formattedAmount).toBe("0.50");
		const state = payoutReducer(withAmount, setPayout({ amount: undefined }));
		expect(state.amount).toBeUndefined();
		expect(state.formattedAmount).toBe("");
	});
});
