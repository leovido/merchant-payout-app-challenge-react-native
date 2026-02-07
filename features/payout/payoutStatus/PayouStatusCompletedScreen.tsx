import { StyleSheet } from "react-native";
import type { PayoutResponse } from "@/types/api";
import { formatCurrency } from "@/utils/formatter";
import { PayoutStatusScreen } from "./PayoutStatusScreen";

interface PayoutStatusCompletedScreenProps {
	payoutResponse: PayoutResponse;
	onPress: () => void;
}

export const PayoutStatusCompletedScreen = ({
	payoutResponse,
	onPress,
}: PayoutStatusCompletedScreenProps) => {
	const formattedAmount = formatCurrency(
		payoutResponse?.amount,
		payoutResponse?.currency,
	);
	const description = `Your payout of ${formattedAmount} has been processed successfully.`;

	return (
		<PayoutStatusScreen payoutResponse={payoutResponse}>
			<PayoutStatusScreen.IconStatus customStyle={styles.icon} />
			<PayoutStatusScreen.Title title="Payout Completed" />
			<PayoutStatusScreen.Description
				description={description}
				customStyle={styles.description}
			/>
			<PayoutStatusScreen.Button
				title="Create Another Payout"
				onPress={onPress}
			/>
		</PayoutStatusScreen>
	);
};

const styles = StyleSheet.create({
	description: {
		color: "gray",
		fontSize: 14,
	},
	icon: {
		color: "lightgreen",
	},
});
