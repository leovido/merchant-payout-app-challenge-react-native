import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { RTKFetchingStrategy } from "@/api/strategies/RTKFetchingStrategy";
import { type FetchState, FetchStatus } from "@/app/types/types";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { colors, Spacing, Typography } from "@/constants/theme";
import { useBalance } from "@/hooks/useBalance";
import type { BalanceType, FormattedAmountWithCurrency } from "@/types/domain";
import { formatCurrency } from "@/utils/formatter";
import { BALANCE_SKELETON_LAYOUT } from "../constants/BalanceSkeletonLayout";
import type { BalanceState } from "../data/balanceSlice";

const BalanceSectionContext = createContext<{
	balanceState?: FetchState<BalanceState>;
}>({});

const useBalanceSectionContext = () => {
	const context = useContext(BalanceSectionContext);
	if (!context) {
		throw new Error(
			"useBalanceSectionContext must be used within BalanceSection",
		);
	}
	return context;
};

function render<T>(state: FetchState<T>, children: ReactNode) {
	switch (state.status) {
		case "idle":
			return null;
		case "loading":
			return (
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
			);
		case "success":
			return <>{children}</>;
		case "error":
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
}

export function BalanceSection({ children }: { children: ReactNode }) {
	const strategy = useMemo(() => new RTKFetchingStrategy(), []);
	const { state } = useBalance(strategy);

	return (
		<BalanceSectionContext.Provider value={{ balanceState: state }}>
			<ThemedView
				accessibilityLabel="Account balance"
				accessibilityRole="summary"
				style={styles.accountBalanceSection}
			>
				{render(state, children)}
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
	return (
		<ThemedView accessibilityRole="none" style={styles.balanceTypeContainer}>
			{children}
		</ThemedView>
	);
};

/**
 * Parses the balance display for a given balance type and state.
 * Only for the BalanceSection.BalanceType subcomponent.
 * @param type - The balance type.
 * @param state - The state of the balance.
 * @returns The formatted amount and accessible label.
 */

type ParseBalanceDisplayResult = {
	formattedAmount: FormattedAmountWithCurrency | "-";
	accessibleLabel:
		| `Error loading balance`
		| `No balance`
		| `${BalanceType} balance, loading`
		| `${BalanceType} balance, ${FormattedAmountWithCurrency}`;
};

function parseBalanceDisplay(
	type: BalanceType,
	state: FetchState<BalanceState> | undefined,
): ParseBalanceDisplayResult {
	const currentState = state ?? { status: FetchStatus.IDLE };

	switch (currentState.status) {
		case FetchStatus.LOADING:
			return {
				formattedAmount: "-",
				accessibleLabel: `${type} balance, loading`,
			};
		case FetchStatus.ERROR:
			return {
				formattedAmount: "-",
				accessibleLabel: "Error loading balance",
			};
		case FetchStatus.IDLE:
			return {
				formattedAmount: "-",
				accessibleLabel: "No balance",
			};
		case FetchStatus.SUCCESS: {
			const currentFormattedAmount = formatCurrency(
				type === "Available"
					? currentState.data.availableBalance
					: currentState.data.pendingBalance,
				currentState.data.currency,
			);
			return {
				formattedAmount: currentFormattedAmount,
				accessibleLabel: `${type} balance, ${currentFormattedAmount}`,
			};
		}
	}
}

interface BalanceTypeProps {
	type: BalanceType;
}

BalanceSection.BalanceType = function BalanceType({ type }: BalanceTypeProps) {
	const { balanceState } = useBalanceSectionContext();

	const { formattedAmount, accessibleLabel } = parseBalanceDisplay(
		type,
		balanceState,
	);

	return (
		<ThemedView style={styles.balanceType}>
			<ThemedText accessibilityLabel={accessibleLabel} accessibilityRole="text">
				<ThemedText style={styles.balanceLabel}>{type}</ThemedText>
				{"\n"}
				<ThemedText type="subtitle" style={styles.balanceAmount}>
					{formattedAmount}
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
