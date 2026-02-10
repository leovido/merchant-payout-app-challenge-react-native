import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useCreatePayoutMutation } from "@/api/apiSlice";
import { ThemedView } from "@/components/themed-view";
import { BACKGROUND_COLOR_LIGHT } from "@/constants/theme";
import { PayoutScreen } from "@/features/payout/PayoutScreen";
import {
	resetPayoutState,
	setFailurePayoutState,
	setPayout,
	setPayoutResponse,
} from "@/features/payout/payoutSlice";
import { PayoutStatusCompletedScreen } from "@/features/payout/payoutStatus/PayouStatusCompletedScreen";
import { PayoutStatusFailedScreen } from "@/features/payout/payoutStatus/PayoutStatusFailedScreen";
import { useBiometrics } from "@/hooks/useBiometrics";
import type { RootState } from "@/store/store";
import extractErrorMessage from "@/utils/errorHandler";

export default function PayoutsScreen() {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [createPayoutResponse, { isLoading }] = useCreatePayoutMutation();
	const { validateBiometricAuthentication, handleBiometricsNotEnrolledError } =
		useBiometrics();

	const payout = useSelector((state: RootState) => state.payout);

	const dispatch = useDispatch();

	const onCloseModal = () => {
		setIsModalVisible(false);
	};

	const requestPayout = async () => {
		const data = await createPayoutResponse({
			amount: payout?.amount || 0,
			currency: payout?.currency || "GBP",
			iban: payout?.iban || "",
			...(payout?.device_id && { device_id: payout.device_id }),
		}).unwrap();

		dispatch(setPayoutResponse({ payoutResponse: data }));
	};

	const onPressCreatePayout = async () => {
		try {
			const isValidBiometricAuthentication =
				await validateBiometricAuthentication(payout?.amount || 0);

			if (isValidBiometricAuthentication) {
				await requestPayout();
			}
		} catch (error) {
			await handleBiometricsNotEnrolledError(error);

			dispatch(
				setFailurePayoutState({
					errorMessage: extractErrorMessage(error),
				}),
			);
		} finally {
			setIsModalVisible(false);
		}
	};

	const onPressCreateAnotherPayout = async () => {
		dispatch(setPayout({ ...payout, payoutResponse: undefined }));
		dispatch(resetPayoutState());
	};

	const onPressTryAgain = async () => {
		dispatch(setPayout({ ...payout, payoutResponse: undefined }));
	};

	return (
		<SafeAreaView style={styles.safeArea}>
			{payout.payoutResponse === undefined && (
				<KeyboardAvoidingView
					style={styles.keyboardAvoidingView}
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					<ScrollView keyboardShouldPersistTaps="handled">
						<PayoutScreen>
							<PayoutScreen.Title />
							<ThemedView style={styles.headerContainer}>
								<PayoutScreen.AmountTextField />
								<PayoutScreen.CurrencyDropdown />
							</ThemedView>
							<ThemedView style={styles.headerContainer}>
								<PayoutScreen.IBANTextField />
							</ThemedView>
							<PayoutScreen.ConfirmButton
								setIsModalVisible={setIsModalVisible}
							/>
							<PayoutScreen.PayoutModal
								isModalVisible={isModalVisible}
								onCloseModal={onCloseModal}
								onConfirmModal={onPressCreatePayout}
								isLoading={isLoading}
							/>
						</PayoutScreen>
					</ScrollView>
				</KeyboardAvoidingView>
			)}
			{payout.payoutResponse?.status === "completed" &&
				payout.payoutResponse && (
					<PayoutStatusCompletedScreen
						payoutResponse={payout.payoutResponse}
						onPress={onPressCreateAnotherPayout}
					/>
				)}
			{payout.payoutResponse?.status === "failed" && payout.payoutResponse && (
				<PayoutStatusFailedScreen
					payoutResponse={payout.payoutResponse}
					errorMessage={payout.errorMessage}
					onPress={onPressTryAgain}
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
	keyboardAvoidingView: {
		flex: 1,
	},
});
