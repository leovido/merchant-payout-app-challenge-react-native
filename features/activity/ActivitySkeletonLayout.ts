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

/**
 * Skeleton layout matching ActivityModal structure:
 * Header (title + Done button), divider, then list rows with left (type/description/date) and right (amount/status).
 */
export const ACTIVITY_MODAL_SKELETON_LAYOUT = [
	{
		key: "modal-header",
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "center" as const,
		width: "100%",
		minHeight: 32,
		marginBottom: Spacing.sectionPaddingVertical,
		children: [
			{
				key: "modal-title",
				width: "60%",
				height: "70%",
				minHeight: 24,
				borderRadius: BorderRadius.input,
			},
			{
				key: "modal-done",
				width: "18%",
				height: "60%",
				minHeight: 28,
				borderRadius: BorderRadius.button,
			},
		],
	},
	{
		key: "modal-divider",
		width: "100%",
		height: 1,
		minHeight: 1,
		marginBottom: Spacing.sm,
		borderRadius: 0,
	},
	{
		key: "modal-row-1",
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "center" as const,
		width: "100%",
		minHeight: 56,
		marginBottom: Spacing.sm,
		children: [
			{
				key: "modal-left-1",
				width: "72%",
				height: "70%",
				minHeight: 40,
				borderRadius: BorderRadius.input,
			},
			{
				key: "modal-right-1",
				width: "25%",
				height: "70%",
				minHeight: 40,
				borderRadius: BorderRadius.input,
			},
		],
	},
	{
		key: "modal-row-2",
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "center" as const,
		width: "100%",
		minHeight: 56,
		marginBottom: Spacing.sm,
		children: [
			{
				key: "modal-left-2",
				width: "72%",
				height: "70%",
				minHeight: 40,
				borderRadius: BorderRadius.input,
			},
			{
				key: "modal-right-2",
				width: "25%",
				height: "70%",
				minHeight: 40,
				borderRadius: BorderRadius.input,
			},
		],
	},
	{
		key: "modal-row-3",
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "center" as const,
		width: "100%",
		minHeight: 56,
		marginBottom: Spacing.sm,
		children: [
			{
				key: "modal-left-3",
				width: "72%",
				height: "70%",
				minHeight: 40,
				borderRadius: BorderRadius.input,
			},
			{
				key: "modal-right-3",
				width: "25%",
				height: "70%",
				minHeight: 40,
				borderRadius: BorderRadius.input,
			},
		],
	},
	{
		key: "modal-row-4",
		flexDirection: "row" as const,
		justifyContent: "space-between" as const,
		alignItems: "center" as const,
		width: "100%",
		minHeight: 56,
		marginBottom: Spacing.md,
		children: [
			{
				key: "modal-left-4",
				width: "72%",
				height: "70%",
				minHeight: 40,
				borderRadius: BorderRadius.input,
			},
			{
				key: "modal-right-4",
				width: "25%",
				height: "70%",
				minHeight: 40,
				borderRadius: BorderRadius.input,
			},
		],
	},
] as ISkeletonProps["layout"];
