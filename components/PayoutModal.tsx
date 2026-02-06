import { createContext, useContext } from "react";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	type TextStyle,
	type ViewStyle,
} from "react-native";
import type { Currency } from "@/types/api";
import { Divider } from "./Divider";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

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
			<ThemedView style={styles.container}>{children}</ThemedView>;
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

PayoutModalContent.Content = function Content({
	title,
	value,
}: {
	title: string;
	value: string;
}) {
	return (
		<>
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
		</>
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
					color="white"
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
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		paddingBottom: 20,
	},
	content: {
		color: "gray",
		fontSize: 14,
	},
	contentValue: {
		color: "black",
	},
	contentContainer: {
		gap: 8,
		paddingBottom: 18,
	},
	contentRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	confirmButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
});
