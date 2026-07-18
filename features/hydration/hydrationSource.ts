import {
	createNativeHydrationSource,
	isNativeHydratorAvailable,
} from "prism-nexus";
import {
	createMockHydrationSource,
	TestHydrationStore,
} from "prism-nexus/testing";
import { Platform } from "react-native";

/** Shared mock store for Jest/web/dev clients without the native module. */
export const mockHydrationStore = new TestHydrationStore();

/** True when the Expo hydrator bridge is linked into this binary. */
export function usesNativeHydrator(): boolean {
	return Platform.OS !== "web" && isNativeHydratorAvailable();
}

/** Platform-aware hydration source for balance state. */
export function createBalanceHydrationSource() {
	if (usesNativeHydrator()) {
		return createNativeHydrationSource();
	}
	return createMockHydrationSource(mockHydrationStore);
}
