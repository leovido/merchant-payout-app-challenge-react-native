import { useEffect, useState } from "react";
import type { DataFetchingStrategy } from "@/api/strategies/DataFetchingStrategy";
import type { FetchState } from "@/app/types/types";
import { transition } from "@/app/types/types";
import type { BalanceState } from "@/features/balances/data/balanceSlice";
import { convertData } from "@/features/balances/helpers/convertData";

export function useBalance<S extends DataFetchingStrategy>(strategy: S) {
	const [state, setState] = useState<FetchState<BalanceState>>({
		status: "idle",
	});

	useEffect(() => {
		async function run() {
			setState((prev) => transition(prev, { type: "FETCH" }));
			try {
				const data = await strategy.fetchBalance();
				const convertedData = convertData(data);

				setState({ status: "success", data: convertedData });
			} catch (e) {
				setState({
					status: "error",
					error: e instanceof Error ? e : new Error(String(e)),
				});
			}
		}
		run();
	}, [strategy]);

	return {
		state,
	};
}
