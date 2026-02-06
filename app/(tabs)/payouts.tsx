import { useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PayoutScreen } from "@/components/PayoutScreen";
import { ThemedView } from "@/components/themed-view";
import { BACKGROUND_COLOR_LIGHT } from "@/constants/theme";

export default function PayoutsScreen() {
	const [isModalVisible, setIsModalVisible] = useState(false);

	const onCloseModal = () => {
		setIsModalVisible(false);
	};
	const onConfirmModal = () => {
		setIsModalVisible(false);
	};
	return (
		<SafeAreaView style={styles.safeArea}>
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
