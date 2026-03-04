import balanceReducer, { type BalanceState, setBalance } from "./balanceSlice";

describe("balanceSlice", () => {
	describe("setBalance", () => {
		it("sets state from full payload", () => {
			const payload: BalanceState = {
				availableBalance: 10000,
				pendingBalance: 500,
				currency: "GBP" as const,
				loading: "idle",
			};

			const state = balanceReducer(undefined, setBalance(payload));

			expect(state.availableBalance).toBe(10000);
			expect(state.pendingBalance).toBe(500);
			expect(state.currency).toBe("GBP");
		});

		it("sets currency to EUR", () => {
			const payload: BalanceState = {
				availableBalance: 0,
				pendingBalance: 0,
				currency: "EUR" as const,
				loading: "succeeded",
			};

			const state = balanceReducer(undefined, setBalance(payload));

			expect(state.currency).toBe("EUR");
			expect(state.availableBalance).toBe(0);
			expect(state.pendingBalance).toBe(0);
		});

		it("replaces existing state with new payload", () => {
			const givenState: BalanceState = {
				availableBalance: 1000,
				pendingBalance: 200,
				currency: "GBP" as const,
				loading: "succeeded",
			};
			const previousState = balanceReducer(undefined, setBalance(givenState));
			const newPayload: BalanceState = {
				availableBalance: 5000,
				pendingBalance: 1000,
				currency: "EUR" as const,
				loading: "succeeded",
			};

			const state = balanceReducer(previousState, setBalance(newPayload));

			expect(state.availableBalance).toBe(5000);
			expect(state.pendingBalance).toBe(1000);
			expect(state.currency).toBe("EUR");
		});

		it("returns initial state for unknown action", () => {
			const unrelatedAction = { type: "other/action" as const };

			const state = balanceReducer(undefined, unrelatedAction);

			expect(state.availableBalance).toBe(0);
			expect(state.pendingBalance).toBe(0);
			expect(state.currency).toBe("GBP");
		});
	});
});
