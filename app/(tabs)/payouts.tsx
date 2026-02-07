import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { ThemedView } from "@/components/themed-view";
import { BACKGROUND_COLOR_LIGHT } from "@/constants/theme";
import { PayoutScreen } from "@/features/payout/PayoutScreen";
import { PayoutStatusCompletedScreen } from "@/features/payout/payoutStatus/PayouStatusCompletedScreen";
import { PayoutStatusFailedScreen } from "@/features/payout/payoutStatus/PayoutStatusFailedScreen";
import type { PayoutResponse } from "@/types/api";

type PayoutScreenStatus = "default" | "completed" | "failed";

export default function PayoutsScreen() {
	const [payoutScreenStatus, setPayoutScreenStatus] =
		useState<PayoutScreenStatus>("completed");
	const [isModalVisible, setIsModalVisible] = useState(false);
	// const payoutResponse = useSelector((state: RootState) => state.payout.payoutResponse);
	const payoutResponse = {
		id: "123",
		status: "completed",
		amount: 100,
		currency: "GBP",
		iban: "GB12345678901234567890",
		created_at: "2026-01-01",
	} as PayoutResponse;

	const onCloseModal = () => {
		setIsModalVisible(false);
	};
	const onConfirmModal = () => {
		setIsModalVisible(false);
	};
	const onPressCreateAnotherPayout = () => {
		setPayoutScreenStatus("default");
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			{payoutScreenStatus === "default" && (
				<PayoutScreen>
					<PayoutScreen.Title />
					<ThemedView style={styles.headerContainer}>
						<PayoutScreen.AmountTextField />
						<PayoutScreen.CurrencyDropdown />
					</ThemedView>
					<ThemedView style={styles.headerContainer}>
						<PayoutScreen.IBANTextField />
					</ThemedView>
					<PayoutScreen.ConfirmButton setIsModalVisible={setIsModalVisible} />
					<PayoutScreen.PayoutModal
						isModalVisible={isModalVisible}
						onCloseModal={onCloseModal}
						onConfirmModal={onConfirmModal}
					/>
				</PayoutScreen>
			)}
			{payoutScreenStatus === "completed" && (
				<PayoutStatusCompletedScreen
					payoutResponse={payoutResponse}
					onPress={onPressCreateAnotherPayout}
				/>
			)}
			{payoutScreenStatus === "failed" && (
				<PayoutStatusFailedScreen
					payoutResponse={payoutResponse}
					onPress={onPressCreateAnotherPayout}
				/>
			)}
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	container: {
		flex: 1,
		padding: 16,
	},
	header: {
		marginBottom: 24,
	},
	section: {
		marginBottom: 24,
	},
	input: {
		borderWidth: 1,
		borderColor: "gray",
		padding: 8,
		borderRadius: 4,
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: BACKGROUND_COLOR_LIGHT,
		width: "100%",
	},
});
