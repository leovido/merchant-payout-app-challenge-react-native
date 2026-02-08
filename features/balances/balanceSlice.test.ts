import balanceReducer, { setBalance } from "./balanceSlice";

describe("balanceSlice", () => {
	describe("setBalance", () => {
		it("sets state from full payload", () => {
			const payload = {
				available_balance: 10000,
				pending_balance: 500,
				currency: "GBP" as const,
			};

			const state = balanceReducer(undefined, setBalance(payload));

			expect(state.available_balance).toBe(10000);
			expect(state.pending_balance).toBe(500);
			expect(state.currency).toBe("GBP");
		});

		it("sets currency to EUR", () => {
			const payload = {
				available_balance: 0,
				pending_balance: 0,
				currency: "EUR" as const,
			};

			const state = balanceReducer(undefined, setBalance(payload));

			expect(state.currency).toBe("EUR");
			expect(state.available_balance).toBe(0);
			expect(state.pending_balance).toBe(0);
		});

		it("replaces existing state with new payload", () => {
			const givenState = {
				available_balance: 1000,
				pending_balance: 200,
				currency: "GBP" as const,
			};
			const previousState = balanceReducer(undefined, setBalance(givenState));
			const newPayload = {
				available_balance: 5000,
				pending_balance: 1000,
				currency: "EUR" as const,
			};

			const state = balanceReducer(previousState, setBalance(newPayload));

			expect(state.available_balance).toBe(5000);
			expect(state.pending_balance).toBe(1000);
			expect(state.currency).toBe("EUR");
		});

		it("returns initial state for unknown action", () => {
			const unrelatedAction = { type: "other/action" as const };

			const state = balanceReducer(undefined, unrelatedAction);

			expect(state.available_balance).toBe(0);
			expect(state.pending_balance).toBe(0);
			expect(state.currency).toBe("GBP");
		});
	});
});
