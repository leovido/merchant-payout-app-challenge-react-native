import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { useGetBalanceQuery } from "@/api/apiSlice";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { colors, Spacing, Typography } from "@/constants/theme";
import type { BalanceResponse } from "@/types/api";
import { formatCurrency } from "@/utils/formatter";
import { BALANCE_SKELETON_LAYOUT } from "./BalanceSkeletonLayout";

const BalanceSectionContext = createContext<{
	balance?: BalanceResponse;
	isLoading: boolean;
	isError: boolean;
}>({
	isLoading: false,
	isError: false,
});

const useBalanceSectionContext = () => {
	const context = useContext(BalanceSectionContext);
	if (!context) {
		throw new Error(
			"useBalanceSectionContext must be used within BalanceSection",
		);
	}
	return context;
};

export function BalanceSection({ children }: { children: ReactNode }) {
	const { data: balance, isLoading, isError } = useGetBalanceQuery();

	const balanceContext = useMemo(
		() => ({ balance, isLoading, isError }),
		[balance, isLoading, isError],
	);

	return (
		<BalanceSectionContext.Provider value={balanceContext}>
			<ThemedView
				accessibilityLabel="Account balance"
				accessibilityRole="summary"
				style={styles.accountBalanceSection}
			>
				<View
					style={isLoading ? styles.contentVisuallyHidden : undefined}
					pointerEvents={isLoading ? "none" : "auto"}
				>
					{children}
				</View>
				{isLoading && (
					<View style={styles.skeletonOverlay} pointerEvents="none">
						<Skeleton
							isLoading
							layout={BALANCE_SKELETON_LAYOUT}
							containerStyle={styles.skeletonContainer}
							boneColor={colors.border}
							highlightColor={colors.backgroundSecondary}
							animationType="shiver"
							animationDirection="horizontalLeft"
						/>
					</View>
				)}
			</ThemedView>
		</BalanceSectionContext.Provider>
	);
}

BalanceSection.Title = function Title() {
	const title = "Account Balance";

	return (
		<ThemedText
			accessibilityLabel={title}
			accessibilityRole="text"
			type="subtitle"
		>
			{title}
		</ThemedText>
	);
};

BalanceSection.BalanceTypeContainer = function BalanceTypeContainer({
	children,
}: {
	children: ReactNode;
}) {
	const { isError } = useBalanceSectionContext();

	if (isError) {
		return (
			<ThemedText
				accessibilityLabel="Error loading balance type"
				accessibilityRole="alert"
				type="subtitle"
				style={styles.balanceTypeContainerError}
			>
				Error loading balance type
			</ThemedText>
		);
	}

	return (
		<ThemedView accessibilityRole="none" style={styles.balanceTypeContainer}>
			{children}
		</ThemedView>
	);
};

interface BalanceTypeProps {
	type: "Available" | "Pending";
}

BalanceSection.BalanceType = function BalanceType({ type }: BalanceTypeProps) {
	const { balance, isLoading } = useBalanceSectionContext();

	const balanceAmount = balance
		? type === "Available"
			? balance.available_balance
			: balance.pending_balance
		: 0;

	const balanceCurrency = balance ? balance.currency : "GBP";

	const accessibleLabel = isLoading
		? `${type} balance, loading`
		: `${type} balance, ${formatCurrency(balanceAmount, balanceCurrency)}`;

	const amountText = isLoading
		? "-"
		: formatCurrency(balanceAmount, balanceCurrency);

	return (
		<ThemedView style={styles.balanceType}>
			<ThemedText accessibilityLabel={accessibleLabel} accessibilityRole="text">
				<ThemedText style={styles.balanceLabel}>{type}</ThemedText>
				{"\n"}
				<ThemedText type="subtitle" style={styles.balanceAmount}>
					{amountText}
				</ThemedText>
			</ThemedText>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	accountBalanceSection: {
		backgroundColor: colors.backgroundPrimary,
		paddingLeft: Spacing.lg,
		position: "relative",
	},
	contentVisuallyHidden: {
		opacity: 0,
	},
	skeletonOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1,
	},
	skeletonContainer: {
		padding: Spacing.sm,
	},
	balanceTypeContainer: {
		flexDirection: "row",
		width: "100%",
		paddingVertical: Spacing.sectionPaddingVertical,
		backgroundColor: colors.backgroundPrimary,
		marginBottom: Spacing.sectionGap,
	},
	balanceTypeContainerError: {
		padding: Spacing.screenPaddingHorizontal,
		textAlign: "center",
		fontSize: Typography.label.fontSize,
		fontWeight: Typography.label.fontWeight,
		color: colors.error,
	},
	balanceType: {
		backgroundColor: colors.backgroundPrimary,
		width: "50%",
	},
	balanceLabel: {
		color: colors.textSecondary,
	},
	balanceAmount: {
		fontWeight: Typography.balance.fontWeight,
		color: colors.textPrimary,
	},
});
