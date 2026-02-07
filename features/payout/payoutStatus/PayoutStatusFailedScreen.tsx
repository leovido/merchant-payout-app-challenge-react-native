import { StyleSheet } from "react-native";
import type { PayoutResponse } from "@/types/api";
import { PayoutStatusScreen } from "./PayoutStatusScreen";

interface PayoutStatusFailedScreenProps {
	payoutResponse: PayoutResponse;
	onPress: () => void;
}

export const PayoutStatusFailedScreen = ({
	payoutResponse,
	onPress,
}: PayoutStatusFailedScreenProps) => {
	const title = "Unable to Proccess Payout";
	const description =
		"Service temporarily unavailable. Please try again later.";

	return (
		<PayoutStatusScreen
			payoutResponse={payoutResponse}
			customStyle={styles.container}
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
		alignSelf: "center",
		width: "80%",
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
