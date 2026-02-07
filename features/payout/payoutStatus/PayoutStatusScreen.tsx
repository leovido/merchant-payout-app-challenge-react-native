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
import { BACKGROUND_COLOR_LIGHT } from "@/constants/theme";
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
			color={payout.status === "completed" ? "green" : "red"}
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: BACKGROUND_COLOR_LIGHT,
		paddingHorizontal: 24,
	},
	icon: {
		marginBottom: 8,
	},
	title: {
		paddingVertical: 8,
	},
	description: {
		paddingVertical: 8,
		textAlign: "center",
		fontWeight: "300",
	},
	button: {
		marginTop: 30,
		paddingVertical: 8,
		paddingHorizontal: 16,
		borderRadius: 8,
		height: 50,
		backgroundColor: "#0a7ea4",
		width: "80%",
		alignItems: "center",
		justifyContent: "center",
	},
	buttonText: {
		color: "white",
	},
});
