import { useEffect, useState } from "react";
import {
	Alert,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { addScreenshotListener } from "screen-security";
import { useCreatePayoutMutation } from "@/api/payoutApi";
import { PayoutScreen } from "@/features/payout/components/PayoutScreen";
import { PayoutStatusCompletedScreen } from "@/features/payout/components/payoutStatus/PayoutStatusCompletedScreen";
import { PayoutStatusFailedScreen } from "@/features/payout/components/payoutStatus/PayoutStatusFailedScreen";
import {
	resetPayoutState,
	setFailurePayoutState,
	setPayout,
	setPayoutResponse,
} from "@/features/payout/data/payoutSlice";
import { useBiometrics } from "@/hooks/useBiometrics";
import { useAppDispatch, useAppSelector } from "@/store/store";
import extractErrorMessage from "@/utils/errorHandler";

export default function PayoutsScreen() {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [createPayoutResponse, { isLoading }] = useCreatePayoutMutation();
	const { validateBiometricAuthentication, handleBiometricsNotEnrolledError } =
		useBiometrics();

	const payout = useAppSelector((state) => state.payout);

	const dispatch = useAppDispatch();

	const onCloseModal = () => {
		setIsModalVisible(false);
	};

	const requestPayout = async () => {
		const data = await createPayoutResponse({
			amount: payout.amount ?? 0,
			currency: payout.currency ?? "GBP",
			iban: payout.iban ?? "",
			...(payout.device_id && { device_id: payout.device_id }),
		}).unwrap();

		dispatch(setPayoutResponse({ payoutResponse: data }));
	};

	const onPressCreatePayout = async () => {
		try {
			const isValidBiometricAuthentication =
				await validateBiometricAuthentication(payout?.amount ?? 0);

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
		dispatch(resetPayoutState());
	};

	const onPressTryAgain = async () => {
		dispatch(setPayout({ payoutResponse: undefined }));
	};

	useEffect(() => {
		if (payout.payoutResponse !== undefined) return;
		const subscription = addScreenshotListener(() => {
			Alert.alert(
				"Screenshot detected",
				"Please keep your financial data private. Avoid sharing screenshots of this screen.",
				[{ text: "OK" }],
			);
		});
		return () => subscription.remove();
	}, [payout.payoutResponse]);

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
							<PayoutScreen.HeaderContainer>
								<PayoutScreen.AmountTextField />
								<PayoutScreen.CurrencyDropdown />
							</PayoutScreen.HeaderContainer>
							<PayoutScreen.HeaderContainer>
								<PayoutScreen.IBANTextField />
							</PayoutScreen.HeaderContainer>
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
	keyboardAvoidingView: {
		flex: 1,
	},
});
