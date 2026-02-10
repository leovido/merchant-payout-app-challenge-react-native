import { createContext, useContext } from "react";
import {
	Pressable,
	StyleSheet,
	type TextStyle,
	type ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { BorderRadius, SemanticColors, Spacing } from "@/constants/theme";
import type { PayoutResponse } from "@/types/api";

const PayoutStatusContext = createContext<PayoutResponse | undefined>(
	undefined,
);

const usePayoutStatusContext = () => {
	const context = useContext(PayoutStatusContext);
	if (!context) {
		throw new Error("usePayoutStatusContext must be used within PayoutStatus");
	}
	return context;
};

interface PayoutStatusScreenProps {
	payoutResponse: PayoutResponse;
	children: React.ReactNode;
	customStyle?: ViewStyle | ViewStyle[];
}

export const PayoutStatusScreen = ({
	payoutResponse,
	children,
	customStyle,
}: PayoutStatusScreenProps) => {
	return (
		<PayoutStatusContext.Provider value={payoutResponse}>
			<ThemedView style={[styles.container, customStyle]}>
				{children}
			</ThemedView>
		</PayoutStatusContext.Provider>
	);
};

PayoutStatusScreen.IconStatus = ({
	customStyle,
}: {
	customStyle?: TextStyle | TextStyle[];
}) => {
	const payout = usePayoutStatusContext();

	return (
		<IconSymbol
			style={[styles.icon, customStyle]}
			name={payout?.status === "completed" ? "checkmark.circle.fill" : "xmark"}
			size={48}
			color={
				payout.status === "completed"
					? SemanticColors.light.success
					: SemanticColors.light.error
			}
		/>
	);
};

interface PayoutStatusTitleProps {
	title: string;
	customStyle?: TextStyle | TextStyle[];
}

PayoutStatusScreen.Title = ({ title, customStyle }: PayoutStatusTitleProps) => {
	return (
		<ThemedText style={[styles.title, customStyle]} type="subtitle">
			{title}
		</ThemedText>
	);
};

interface PayoutStatusDescriptionProps {
	description: string;
	customStyle?: TextStyle | TextStyle[];
}

PayoutStatusScreen.Description = ({
	description,
	customStyle,
}: PayoutStatusDescriptionProps) => {
	return (
		<ThemedText style={[styles.description, customStyle]} type="default">
			{description}
		</ThemedText>
	);
};

interface PayoutStatusButtonProps {
	title: string;
	onPress: () => void;
	customStyle?: ViewStyle | ViewStyle[];
}

PayoutStatusScreen.Button = ({
	title,
	onPress,
	customStyle,
}: PayoutStatusButtonProps) => {
	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={`${title} button`}
			accessibilityValue={{ text: title }}
			style={[styles.button, customStyle]}
			onPress={onPress}
		>
			<ThemedText style={styles.buttonText} type="defaultSemiBold">
				{title}
			</ThemedText>
		</Pressable>
	);
};

const c = SemanticColors.light;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: c.backgroundPrimary,
		paddingHorizontal: Spacing.modalPadding,
		width: "80%",
		alignSelf: "center",
	},
	icon: {
		marginBottom: Spacing.labelInputGap,
	},
	title: {
		paddingVertical: Spacing.labelInputGap,
	},
	description: {
		paddingVertical: Spacing.labelInputGap,
		textAlign: "center",
		fontWeight: "400",
	},
	button: {
		marginTop: 30,
		paddingVertical: Spacing.labelInputGap,
		paddingHorizontal: Spacing.sectionPaddingVertical,
		borderRadius: BorderRadius.button,
		height: 50,
		backgroundColor: c.primary,
		width: "80%",
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		color: c.backgroundSecondary,
	},
});
