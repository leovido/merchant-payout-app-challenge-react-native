import { z } from "zod";

export const BALANCE_HYDRATION_VERSION = 1;

export const balanceHydrationSchema = z.object({
	available_balance: z.number(),
	pending_balance: z.number(),
	currency: z.enum(["GBP", "EUR"]),
});

export type BalanceHydrationState = z.infer<typeof balanceHydrationSchema>;
