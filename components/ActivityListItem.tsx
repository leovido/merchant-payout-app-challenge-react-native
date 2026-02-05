import { StyleSheet, View } from "react-native";
import type { Currency } from "@/types/api";
import { currencyFormatter } from "@/utils/formatter";
import { ThemedText } from "./themed-text";

interface ActivityListItemProps {
	description: string;
	currency: Currency;
	amount: number;
}

const formatCurrency = (amount: number, currency: Currency): string => {
	return new Intl.NumberFormat("en-GB", {
		style: "currency",
		currency: currency,
	}).format(amount);
};

export function ActivityListItem({
	description,
	currency,
	amount,
}: ActivityListItemProps) {
	const formattedCurrency = currencyFormatter(currency);
	const formattedAmount = formatCurrency(amount, currency);

	return (
		<View style={styles.container}>
			<ThemedText
				accessibilityLabel="Activity description"
				accessibilityRole="text"
				accessibilityValue={{ text: description }}
			>
				{description}
			</ThemedText>
			<ThemedText
				type="defaultSemiBold"
				style={[
					styles.amount,
					amount > 0 ? styles.positiveAmount : styles.negativeAmount,
				]}
				accessibilityLabel="Activity amount"
				accessibilityRole="text"
				accessibilityValue={{ text: formattedAmount }}
			>
				{formattedCurrency}
				{formattedAmount}
			</ThemedText>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 16,
	},
	amount: {
		color: "black",
	},
	positiveAmount: {
		color: "green",
	},
	negativeAmount: {
		color: "red",
	},
});
