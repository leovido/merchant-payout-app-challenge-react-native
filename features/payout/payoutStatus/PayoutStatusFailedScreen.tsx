import { StyleSheet, type ViewStyle } from "react-native";
import type { PayoutResponse } from "@/types/api";
import { PayoutStatusScreen } from "./PayoutStatusScreen";

interface PayoutStatusFailedScreenProps {
	payoutResponse: PayoutResponse;
	customStyle?: ViewStyle | ViewStyle[];
	onPress: () => void;
}

export const PayoutStatusFailedScreen = ({
	payoutResponse,
	onPress,
	customStyle,
}: PayoutStatusFailedScreenProps) => {
	const title = "Unable to Proccess Payout";
	const description =
		"Service temporarily unavailable. Please try again later.";

	return (
		<PayoutStatusScreen
			payoutResponse={payoutResponse}
			customStyle={customStyle}
		>
			<PayoutStatusScreen.IconStatus customStyle={styles.icon} />
			<PayoutStatusScreen.Title
				title={title}
				customStyle={styles.titleContainer}
			/>
			<PayoutStatusScreen.Description
				description={description}
				customStyle={styles.description}
			/>
			<PayoutStatusScreen.Button title="Try again" onPress={onPress} />
		</PayoutStatusScreen>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
	},
	titleContainer: {
		paddingVertical: 8,
		color: "red",
	},
	description: {
		color: "red",
		fontSize: 14,
	},
	icon: {
		color: "red",
	},
});
