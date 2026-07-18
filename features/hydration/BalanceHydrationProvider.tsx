import {
	applyPatch,
	configureNativeHydrator,
	type HydrationResult,
	HydratorProvider,
} from "prism-nexus";
import { type ReactNode, useEffect, useRef } from "react";
import { setBalance } from "@/features/balances/balanceSlice";
import { store, useAppDispatch } from "@/store/store";
import type { BalanceResponse } from "@/types/api";
import {
	BALANCE_HYDRATION_VERSION,
	balanceHydrationSchema,
} from "./balanceHydrationSchema";
import { createBalanceHydrationSource } from "./hydrationSource";
import { sealBalance } from "./sealBalance";

function isMeaningfulBalance(balance: BalanceResponse): boolean {
	return (
		balance.available_balance !== 0 ||
		balance.pending_balance !== 0 ||
		balance.currency !== "GBP"
	);
}

export function BalanceHydrationProvider({
	children,
}: {
	children: ReactNode;
}) {
	const dispatch = useAppDispatch();
	const lastSealedRef = useRef<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		configureNativeHydrator({ testMode: __DEV__ }).catch((error: unknown) => {
			if (!cancelled) {
				console.warn("[BalanceHydration] native configure failed", error);
			}
		});

		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		const unsubscribe = store.subscribe(() => {
			const balance = store.getState().balance;
			const fingerprint = JSON.stringify(balance);

			if (fingerprint === lastSealedRef.current) {
				return;
			}

			if (!isMeaningfulBalance(balance)) {
				return;
			}

			lastSealedRef.current = fingerprint;
			void sealBalance(balance).catch((error: unknown) => {
				console.warn("[BalanceHydration] seal failed", error);
			});
		});

		return unsubscribe;
	}, []);

	const handleHydrate = (result: HydrationResult<BalanceResponse>) => {
		if (!result.ok) {
			return;
		}

		const next = applyPatch(store.getState().balance, result.patch);
		dispatch(setBalance(next));
	};

	return (
		<HydratorProvider<BalanceResponse>
			source={createBalanceHydrationSource()}
			schema={balanceHydrationSchema}
			minVersion={BALANCE_HYDRATION_VERSION}
			maxVersion={BALANCE_HYDRATION_VERSION}
			getBaseState={() => store.getState().balance}
			onHydrate={handleHydrate}
			onWarn={(message) => console.warn("[BalanceHydration]", message)}
			onError={(error) =>
				console.error("[BalanceHydration]", error.code, error.message)
			}
			testMode={__DEV__}
		>
			{children}
		</HydratorProvider>
	);
}
