import { StyleSheet, View } from "react-native";
import type { Currency } from "@/types/api";
import { formatCurrency } from "@/utils/formatter";
import { ThemedText } from "./themed-text";

interface ActivityListItemProps {
	description: string;
	currency: Currency;
	amount: number;
}

export function ActivityListItem({
	description,
	currency,
	amount,
}: ActivityListItemProps) {
	const formattedAmount = formatCurrency(amount, currency);

	return (
		<View style={styles.container}>
			<ActivityListItem.Description description={description} />
			<ActivityListItem.Amount amount={formattedAmount} />
		</View>
	);
}

ActivityListItem.Description = function Description({
	description,
}: {
	description: string;
}) {
	return (
		<ThemedText
			accessibilityLabel="Activity description"
			accessibilityRole="text"
			accessibilityValue={{ text: description }}
		>
			{description}
		</ThemedText>
	);
};

ActivityListItem.Amount = function Amount({ amount }: { amount: string }) {
	return (
		<ThemedText
			type="defaultSemiBold"
			style={[
				styles.amount,
				Number(amount) > 0 ? styles.positiveAmount : styles.negativeAmount,
			]}
			accessibilityLabel="Activity amount"
			accessibilityRole="text"
			accessibilityValue={{ text: amount }}
		>
			{amount}
		</ThemedText>
	);
};

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
