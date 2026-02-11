import payoutReducer, {
	resetPayoutState,
	setAmount,
	setCurrency,
	setDeviceId,
	setFailurePayoutState,
	setIban,
	setPayout,
	setPayoutResponse,
} from "./payoutSlice";

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
		const withAmount = payoutReducer(undefined, setAmount({ amount: 500 }));
		const state = payoutReducer(withAmount, setCurrency({ currency: "EUR" }));
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
		const withAmount = payoutReducer(undefined, setAmount({ amount: 100 }));
		const state = payoutReducer(
			withAmount,
			setIban({ iban: "DE89370400440532013000" }),
		);
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

	describe("resetPayoutState", () => {
		it("returns initial state from undefined state", () => {
			const state = payoutReducer(undefined, resetPayoutState());
			expect(state.amount).toBeUndefined();
			expect(state.currency).toBe("GBP");
			expect(state.iban).toBe("");
			expect(state.payoutResponse).toBeUndefined();
			expect(state.errorMessage).toBeUndefined();
		});

		it("resets state to initial when called after setPayout", () => {
			const withData = payoutReducer(
				undefined,
				setPayout({
					amount: 1000,
					currency: "EUR",
					iban: "DE89370400440532013000",
				}),
			);
			const state = payoutReducer(withData, resetPayoutState());
			expect(state.amount).toBeUndefined();
			expect(state.currency).toBe("GBP");
			expect(state.iban).toBe("");
			expect(state.formattedAmount).toBeUndefined();
			expect(state.payoutResponse).toBeUndefined();
			expect(state.errorMessage).toBeUndefined();
		});
	});

	describe("setFailurePayoutState", () => {
		it("sets errorMessage and payoutResponse with status failed", () => {
			const withAmount = payoutReducer(
				undefined,
				setPayout({ amount: 500, currency: "GBP", iban: "FR123" }),
			);
			const state = payoutReducer(
				withAmount,
				setFailurePayoutState({ errorMessage: "Insufficient funds" }),
			);
			expect(state.errorMessage).toBe("Insufficient funds");
			expect(state.payoutResponse).toBeDefined();
			expect(state.payoutResponse?.status).toBe("failed");
			expect(state.payoutResponse?.amount).toBe(500);
			expect(state.payoutResponse?.currency).toBe("GBP");
			expect(state.payoutResponse?.iban).toBe("FR123");
			expect(state.payoutResponse?.id).toBe("");
			expect(state.payoutResponse?.created_at).toBeDefined();
		});

		it("preserves amount, currency and iban from current state", () => {
			const withData = payoutReducer(
				undefined,
				setPayout({
					amount: 12345,
					currency: "EUR",
					iban: "DE89370400440532013000",
				}),
			);
			const state = payoutReducer(
				withData,
				setFailurePayoutState({ errorMessage: "Network error" }),
			);
			expect(state.payoutResponse?.amount).toBe(12345);
			expect(state.payoutResponse?.currency).toBe("EUR");
			expect(state.payoutResponse?.iban).toBe("DE89370400440532013000");
		});
	});

	describe("setPayoutResponse", () => {
		it("sets payoutResponse and keeps rest of state", () => {
			const withAmount = payoutReducer(
				undefined,
				setPayout({ amount: 100, iban: "FR123" }),
			);
			const response = {
				id: "pay-123",
				status: "completed" as const,
				amount: 100,
				currency: "GBP" as const,
				iban: "FR123",
				created_at: "2025-02-07T12:00:00Z",
			};
			const state = payoutReducer(
				withAmount,
				setPayoutResponse({ payoutResponse: response }),
			);
			expect(state.payoutResponse).toEqual(response);
			expect(state.amount).toBe(100);
			expect(state.iban).toBe("FR123");
			expect(state.formattedAmount).toBe("1.00");
		});

		it("replaces existing payoutResponse", () => {
			const withResponse = payoutReducer(
				undefined,
				setPayoutResponse({
					payoutResponse: {
						id: "old",
						status: "pending",
						amount: 0,
						currency: "GBP",
						iban: "",
						created_at: "",
					},
				}),
			);
			const newResponse = {
				id: "new",
				status: "completed" as const,
				amount: 500,
				currency: "EUR" as const,
				iban: "DE123",
				created_at: "2025-02-07T13:00:00Z",
			};
			const state = payoutReducer(
				withResponse,
				setPayoutResponse({ payoutResponse: newResponse }),
			);
			expect(state.payoutResponse).toEqual(newResponse);
		});
	});

	describe("setDeviceId", () => {
		it("sets device_id and keeps rest of state", () => {
			const withAmount = payoutReducer(undefined, setPayout({ amount: 100 }));
			const state = payoutReducer(
				withAmount,
				setDeviceId({ device_id: "123" }),
			);
			expect(state.device_id).toBe("123");
			expect(state.amount).toBe(100);
			expect(state.iban).toBe("");
			expect(state.formattedAmount).toBe("1.00");
			expect(state.payoutResponse).toBeUndefined();
			expect(state.errorMessage).toBeUndefined();
		});
	});
});
