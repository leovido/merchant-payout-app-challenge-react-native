import type { ISkeletonProps } from "react-native-reanimated-skeleton";
import { BorderRadius, Spacing } from "@/constants/theme";

/**
 * Skeleton layout matching ActivitySection structure.
 * Uses percentage widths/heights for responsive layout.
 */
export const ACTIVITY_SKELETON_LAYOUT = [
	{
		key: "title",
		width: "50%",
		height: "2%",
		minHeight: 20,
		marginBottom: Spacing.md,
		borderRadius: 4,
	},
	{
		key: "activity-row-1",
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "center" as const,
		width: "100%",
		height: "4%",
		minHeight: 36,
		marginBottom: Spacing.sm,
		children: [
			{
				key: "desc-1",
				width: "55%",
				height: "70%",
				borderRadius: BorderRadius.input,
			},
			{
				key: "amount-1",
				width: "25%",
				height: "70%",
				borderRadius: BorderRadius.input,
			},
		],
	},
	{
		key: "activity-row-2",
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "center" as const,
		width: "100%",
		height: "4%",
		minHeight: 36,
		marginBottom: Spacing.sm,
		children: [
			{
				key: "desc-2",
				width: "55%",
				height: "70%",
				borderRadius: BorderRadius.input,
			},
			{
				key: "amount-2",
				width: "25%",
				height: "70%",
				borderRadius: BorderRadius.input,
			},
		],
	},
	{
		key: "activity-row-3",
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "center" as const,
		width: "100%",
		height: "4%",
		minHeight: 36,
		marginBottom: Spacing.md,
		children: [
			{
				key: "desc-3",
				width: "55%",
				height: "70%",
				borderRadius: BorderRadius.input,
			},
			{
				key: "amount-3",
				width: "25%",
				height: "70%",
				borderRadius: BorderRadius.input,
			},
		],
	},
	{
		key: "show-more-button",
		width: "100%",
		height: "4%",
		minHeight: 44,
		marginTop: Spacing.md,
		borderRadius: BorderRadius.button,
	},
] as ISkeletonProps["layout"];
