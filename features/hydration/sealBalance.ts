import { sealAndStoreHydrationPayload } from "prism-nexus";
import { createMockEnvelope, mockHydratorExtractor } from "prism-nexus/testing";
import type { BalanceResponse } from "@/types/api";
import { mockHydrationStore, usesNativeHydrator } from "./hydrationSource";

/**
 * Persist the current balance so the next launch/foreground can hydrate it.
 * Uses native sealing in testMode when the module is linked; otherwise seeds
 * the shared mock store.
 */
export async function sealBalance(state: BalanceResponse): Promise<void> {
	const { reqId } = mockHydratorExtractor();

	if (usesNativeHydrator()) {
		await sealAndStoreHydrationPayload({
			reqId,
			state,
			ctx: "session",
		});
		return;
	}

	mockHydrationStore.put(
		createMockEnvelope({
			reqId,
			state,
			context: "session",
		}),
	);
}
