import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { useGetBalanceQuery } from "@/api/apiSlice";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { colors, Spacing, Typography } from "@/constants/theme";
import { useAppDispatch, useAppSelector } from "@/store/store";
import type { BalanceResponse } from "@/types/api";
import { formatCurrency } from "@/utils/formatter";
import { BALANCE_SKELETON_LAYOUT } from "./BalanceSkeletonLayout";
import { setBalance } from "./balanceSlice";

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

function hasHydratedBalance(balance: BalanceResponse): boolean {
	return (
		balance.available_balance !== 0 ||
		balance.pending_balance !== 0 ||
		balance.currency !== "GBP"
	);
}

export function BalanceSection({ children }: { children: ReactNode }) {
	const dispatch = useAppDispatch();
	const hydratedBalance = useAppSelector((state) => state.balance);
	const { data: queryBalance, isLoading, isError } = useGetBalanceQuery();

	useEffect(() => {
		if (queryBalance) {
			dispatch(setBalance(queryBalance));
		}
	}, [dispatch, queryBalance]);

	const balance =
		queryBalance ??
		(hasHydratedBalance(hydratedBalance) ? hydratedBalance : undefined);
	const showSkeleton = isLoading && !balance;

	const balanceContext = useMemo(
		() => ({ balance, isLoading: showSkeleton, isError }),
		[balance, showSkeleton, isError],
	);

	return (
		<BalanceSectionContext.Provider value={balanceContext}>
			<ThemedView
				accessibilityLabel="Account balance"
				accessibilityRole="summary"
				style={styles.accountBalanceSection}
			>
				<View
					style={showSkeleton ? styles.contentVisuallyHidden : undefined}
					pointerEvents={showSkeleton ? "none" : "auto"}
				>
					{children}
				</View>
				{showSkeleton && (
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
