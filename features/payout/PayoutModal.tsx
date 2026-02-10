import { createContext, useContext } from "react";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	type TextStyle,
	type ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Divider } from "@/components/ui/Divider";
import { SemanticColors, Spacing, Typography } from "@/constants/theme";
import type { Currency } from "@/types/api";

interface PayoutModalProps {
	amount: number;
	currency: Currency;
	iban: string;
}

const PayoutModalContext = createContext<PayoutModalProps>({
	amount: 0,
	currency: "GBP",
	iban: "",
});

function usePayoutModalContext() {
	const context = useContext(PayoutModalContext);
	if (!context) {
		throw new Error("usePayoutModalContext must be used within a PayoutModal");
	}
	return context;
}

interface PayoutModalContentProps {
	payout: PayoutModalProps;
	children: React.ReactNode;
}

export const PayoutModalContent = ({
	payout,
	children,
}: PayoutModalContentProps) => {
	return (
		<PayoutModalContext.Provider value={payout}>
			<ThemedView style={styles.container}>{children}</ThemedView>
		</PayoutModalContext.Provider>
	);
};

PayoutModalContent.Title = function Title() {
	return (
		<ThemedText style={styles.title} type="title">
			Confirm Payout
		</ThemedText>
	);
};

interface PayoutModalContentContentProps {
	title: string;
	value: string;
}

PayoutModalContent.Content = function Content({
	title,
	value,
}: PayoutModalContentContentProps) {
	return (
		<ThemedView style={styles.contentContainer}>
			<ThemedView style={styles.contentRow}>
				<ThemedText style={styles.content} type="default">
					{title}
				</ThemedText>
				<ThemedText style={styles.contentValue} type="defaultSemiBold">
					{value}
				</ThemedText>
			</ThemedView>
			<Divider />
		</ThemedView>
	);
};

interface PayoutModalConfirmButtonProps {
	buttonTitle: string;
	customStyle?: ViewStyle | ViewStyle[];
	textStyle?: TextStyle | TextStyle[];
	isLoading?: boolean;
	onPressConfirm: () => void;
}

PayoutModalContent.Button = function Button({
	buttonTitle,
	onPressConfirm,
	customStyle,
	textStyle,
	isLoading,
}: PayoutModalConfirmButtonProps) {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={`${buttonTitle} button`}
			accessibilityValue={{ text: buttonTitle }}
			style={customStyle}
			onPress={onPressConfirm}
			disabled={isLoading}
		>
			{isLoading ? (
				<ActivityIndicator
					size="small"
					color={SemanticColors.light.backgroundSecondary}
					accessibilityLabel="Loading indicator"
				/>
			) : (
				<ThemedText
					accessibilityLabel={`${buttonTitle} button`}
					accessibilityValue={{ text: buttonTitle }}
					type="defaultSemiBold"
					style={[styles.confirmButtonText, textStyle]}
				>
					{buttonTitle}
				</ThemedText>
			)}
		</Pressable>
	);
};

const c = SemanticColors.light;

const styles = StyleSheet.create({
	container: {
		padding: Spacing.sectionPaddingVertical,
	},
	title: {
		fontSize: Typography.sectionTitle.fontSize,
		fontWeight: Typography.sectionTitle.fontWeight,
		textAlign: "center",
		paddingBottom: Spacing.sectionGap,
	},
	content: {
		color: c.textSecondary,
		fontSize: Typography.hint.fontSize,
	},
	contentValue: {
		color: c.textPrimary,
	},
	contentContainer: {
		gap: Spacing.labelInputGap,
		paddingBottom: 18,
	},
	contentRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	confirmButtonText: {
		color: c.backgroundSecondary,
		fontSize: Typography.label.fontSize,
		fontWeight: Typography.label.fontWeight,
	},
});
