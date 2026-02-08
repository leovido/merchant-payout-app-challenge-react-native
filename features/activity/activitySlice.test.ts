import type { ActivityItem } from "@/types/api";
import activityReducer, { setActivity } from "./activitySlice";

const createActivityItem = (
	overrides?: Partial<ActivityItem>,
): ActivityItem => ({
	id: "1",
	type: "deposit",
	amount: 100,
	currency: "GBP",
	date: "2021-01-01",
	description: "Deposit",
	status: "completed",
	...overrides,
});

describe("activitySlice", () => {
	describe("setActivity", () => {
		it("sets state from full payload", () => {
			const payload = [
				createActivityItem({ id: "a1", description: "Payout" }),
				createActivityItem({ id: "a2", description: "Refund" }),
			];

			const state = activityReducer(undefined, setActivity(payload));

			expect(state.items).toHaveLength(2);
			expect(state.items[0].id).toBe("a1");
			expect(state.items[0].description).toBe("Payout");
			expect(state.items[1].id).toBe("a2");
			expect(state.items[1].description).toBe("Refund");
		});

		it("replaces existing state with new payload", () => {
			const previousItems = [createActivityItem({ id: "old" })];
			const previousState = activityReducer(
				undefined,
				setActivity(previousItems),
			);
			const newPayload = [
				createActivityItem({ id: "new1" }),
				createActivityItem({ id: "new2" }),
			];

			const state = activityReducer(previousState, setActivity(newPayload));

			expect(state.items).toHaveLength(2);
			expect(state.items[0].id).toBe("new1");
			expect(state.items[1].id).toBe("new2");
		});

		it("sets empty array", () => {
			const state = activityReducer(undefined, setActivity([]));

			expect(state.items).toEqual([]);
		});

		it("returns initial state for unknown action", () => {
			const unrelatedAction = { type: "other/action" as const };

			const state = activityReducer(undefined, unrelatedAction);

			expect(state.items).toHaveLength(1);
			expect(state.items[0].id).toBe("1");
			expect(state.items[0].type).toBe("deposit");
		});
	});
});
