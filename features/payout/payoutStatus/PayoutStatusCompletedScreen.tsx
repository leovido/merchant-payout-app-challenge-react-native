import { StyleSheet, type ViewStyle } from "react-native";
import { SemanticColors, Typography } from "@/constants/theme";
import type { PayoutResponse } from "@/types/api";
import { formatCurrency } from "@/utils/formatter";
import { PayoutStatusScreen } from "./PayoutStatusScreen";

interface PayoutStatusCompletedScreenProps {
	payoutResponse: PayoutResponse;
	customStyle?: ViewStyle | ViewStyle[];
	onPress: () => void;
}

export const PayoutStatusCompletedScreen = ({
	payoutResponse,
	onPress,
	customStyle,
}: PayoutStatusCompletedScreenProps) => {
	const formattedAmount = formatCurrency(
		payoutResponse?.amount,
		payoutResponse?.currency,
	);
	const description = `Your payout of ${formattedAmount} has been processed successfully.`;

	return (
		<PayoutStatusScreen
			payoutResponse={payoutResponse}
			customStyle={customStyle}
		>
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
		color: SemanticColors.light.textSecondary,
		fontSize: Typography.hint.fontSize,
	},
	icon: {
		color: SemanticColors.light.success,
	},
});
