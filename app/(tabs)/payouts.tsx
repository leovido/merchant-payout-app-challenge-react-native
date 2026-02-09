import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { isBiometricAuthenticated } from "screen-security";
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
import type { RootState } from "@/store/store";

export default function PayoutsScreen() {
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [createPayoutResponse, { isLoading }] = useCreatePayoutMutation();

	const payout = useSelector((state: RootState) => state.payout);

	const dispatch = useDispatch();

	const onCloseModal = () => {
		setIsModalVisible(false);
	};

	const validateBiometricAuthentication = async (amount: number) => {
		const requiresBiometricAuthentication = amount >= 1000;

		if (requiresBiometricAuthentication) {
			const isAuthenticated = await isBiometricAuthenticated();

			console.log("isAuthenticated", isAuthenticated);
			return isAuthenticated;
		} else {
			return true;
		}
	};

	const requestPayout = async () => {
		try {
			const response = await createPayoutResponse({
				amount: payout?.amount || 0,
				currency: payout?.currency || "GBP",
				iban: payout?.iban || "",
				...(payout?.device_id && { device_id: payout.device_id }),
			});

			console.log("response payout", response);
			if (response.error) {
				if ("data" in response.error) {
					const errorMessage = (response.error.data as { error: string }).error;
					if (errorMessage) {
						dispatch(
							setFailurePayoutState({
								errorMessage,
							}),
						);
					}
				}
			} else {
				dispatch(
					setPayoutResponse({
						payoutResponse: response.data,
					}),
				);
			}
		} catch {
			dispatch(
				setFailurePayoutState({
					errorMessage:
						"Service temporarily unavailable. Please try again later.",
				}),
			);
		} finally {
			setIsModalVisible(false);
		}
	};

	const onPressCreatePayout = async () => {
		try {
			const isValidBiometricAuthentication =
				await validateBiometricAuthentication(payout?.amount || 0);

			if (isValidBiometricAuthentication) {
				await requestPayout();
			}
		} catch {
			dispatch(
				setFailurePayoutState({
					errorMessage:
						"Service temporarily unavailable. Please try again later.",
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
					errorMessage={
						payout.errorMessage ??
						"Service temporarily unavailable. Please try again later."
					}
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
