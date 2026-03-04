import { Spacing } from "@/constants/theme";

export const BALANCE_SKELETON_LAYOUT = [
	{
		key: "title",
		width: 200,
		height: 22,
		marginBottom: Spacing.sectionPaddingVertical,
		borderRadius: 4,
	},
	{
		key: "balance-row",
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "center" as const,
		width: 320,
		marginBottom: Spacing.sectionGap,
		children: [
			{ key: "available", width: 150, height: 56, borderRadius: 4 },
			{ key: "pending", width: 150, height: 56, borderRadius: 4 },
		],
	},
];
