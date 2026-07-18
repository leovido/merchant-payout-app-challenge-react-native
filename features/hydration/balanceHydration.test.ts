import { configureStore } from "@reduxjs/toolkit";
import { applyPatch, runHydration } from "prism-nexus";
import { createTestHydratorHarness } from "prism-nexus/testing";
import balanceReducer, { setBalance } from "@/features/balances/balanceSlice";
import type { BalanceResponse } from "@/types/api";
import {
	BALANCE_HYDRATION_VERSION,
	balanceHydrationSchema,
} from "./balanceHydrationSchema";

const initialBalance: BalanceResponse = {
	available_balance: 0,
	pending_balance: 0,
	currency: "GBP",
};

const hydratedBalance: BalanceResponse = {
	available_balance: 12500,
	pending_balance: 500,
	currency: "GBP",
};

function createBalanceStore(preloaded?: BalanceResponse) {
	return configureStore({
		reducer: { balance: balanceReducer },
		preloadedState: preloaded ? { balance: preloaded } : undefined,
	});
}

describe("balance hydration", () => {
	it("hydrates a valid sealed balance into the store with expected patch ops", () => {
		const harness = createTestHydratorHarness();
		const store = createBalanceStore();
		const envelope = harness.seed({
			state: hydratedBalance,
			version: BALANCE_HYDRATION_VERSION,
			context: "session",
		});

		const result = runHydration(envelope, store.getState().balance, {
			schema: balanceHydrationSchema,
			minVersion: BALANCE_HYDRATION_VERSION,
			maxVersion: BALANCE_HYDRATION_VERSION,
			onHydrate: () => undefined,
		});

		expect(result.ok).toBe(true);
		if (!result.ok) {
			return;
		}

		expect(result.patch).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					op: "replace",
					path: "/available_balance",
					value: 12500,
				}),
				expect.objectContaining({
					op: "replace",
					path: "/pending_balance",
					value: 500,
				}),
			]),
		);

		const next = applyPatch(store.getState().balance, result.patch);
		store.dispatch(setBalance(next));

		expect(store.getState().balance).toEqual(hydratedBalance);
	});

	it("rejects an invalid payload with SCHEMA_VALIDATION_FAILED and leaves state unchanged", () => {
		const harness = createTestHydratorHarness();
		const store = createBalanceStore(initialBalance);
		const envelope = harness.seed({
			state: {
				available_balance: "not-a-number",
				pending_balance: 0,
				currency: "GBP",
			},
			version: BALANCE_HYDRATION_VERSION,
		});

		const result = runHydration(envelope, store.getState().balance, {
			schema: balanceHydrationSchema,
			minVersion: BALANCE_HYDRATION_VERSION,
			maxVersion: BALANCE_HYDRATION_VERSION,
			onHydrate: () => undefined,
		});

		expect(result.ok).toBe(false);
		if (result.ok) {
			return;
		}

		expect(result.error.code).toBe("SCHEMA_VALIDATION_FAILED");
		expect(store.getState().balance).toEqual(initialBalance);
	});

	it("rejects a version mismatch with SCHEMA_VERSION_MISMATCH", () => {
		const harness = createTestHydratorHarness();
		const store = createBalanceStore(initialBalance);
		const envelope = harness.seed({
			state: hydratedBalance,
			version: 2,
		});

		const result = runHydration(envelope, store.getState().balance, {
			schema: balanceHydrationSchema,
			minVersion: BALANCE_HYDRATION_VERSION,
			maxVersion: BALANCE_HYDRATION_VERSION,
			onHydrate: () => undefined,
		});

		expect(result.ok).toBe(false);
		if (result.ok) {
			return;
		}

		expect(result.error.code).toBe("SCHEMA_VERSION_MISMATCH");
		expect(store.getState().balance).toEqual(initialBalance);
	});
});
