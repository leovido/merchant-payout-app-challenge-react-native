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
import { colors, Spacing, Typography } from "@/constants/theme";
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
					color={colors.backgroundSecondary}
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
		color: colors.textSecondary,
		fontSize: Typography.hint.fontSize,
	},
	contentValue: {
		color: colors.textPrimary,
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
		color: colors.backgroundSecondary,
		fontSize: Typography.label.fontSize,
		fontWeight: Typography.label.fontWeight,
	},
});
