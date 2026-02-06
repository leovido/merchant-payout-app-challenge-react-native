import { createContext, useContext, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Modal,
	Pressable,
	StyleSheet,
	TextInput,
	type ViewStyle,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { useCreatePayoutMutation } from "@/api/apiSlice";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BACKGROUND_COLOR_LIGHT } from "@/constants/theme";
import { setPayout } from "@/features/payout/payoutSlice";
import type { RootState } from "@/store/store";
import type { Currency } from "@/types/api";
import { formatCurrency } from "@/utils/formatter";
import { PayoutModalContent } from "./PayoutModal";

/** IBAN: 2 letters (country) + 2 digits (check) + 4–30 alphanumeric (no spaces) */
const IBAN_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/;

interface PayoutItem {
	amount?: number;
	formattedAmount: string;
	setAmount: (amount: number | undefined) => void;
	currency: Currency;
	setCurrency: (currency: Currency) => void;
	iban: string;
	setIban: (iban: string) => void;
}

const PayoutContext = createContext<PayoutItem>({
	amount: undefined,
	setAmount: () => {},
	formattedAmount: "",
	currency: "GBP",
	setCurrency: () => {},
	iban: "",
	setIban: () => {},
});

function usePayoutContext() {
	const context = useContext(PayoutContext);
	if (!context) {
		throw new Error("usePayoutContext must be used within a PayoutScreen");
	}
	return context;
}

interface PayoutScreenProps {
	children: React.ReactNode;
	customStyle?: ViewStyle | ViewStyle[];
}

export const PayoutScreen = ({ children, customStyle }: PayoutScreenProps) => {
	const payout = useSelector((state: RootState) => state.payout);
	const dispatch = useDispatch();

	return (
		<PayoutContext.Provider
			value={{
				amount: payout.amount || undefined,
				formattedAmount: payout.formattedAmount || "",
				currency: payout.currency || "GBP",
				iban: payout.iban || "",
				setAmount: (amount: number | undefined) => {
					dispatch(setPayout({ ...payout, amount }));
				},
				setCurrency: (currency: Currency) => {
					dispatch(setPayout({ ...payout, currency }));
				},
				setIban: (iban: string) => {
					dispatch(setPayout({ ...payout, iban }));
				},
			}}
		>
			<ThemedView style={[styles.container, customStyle]}>
				{children}
			</ThemedView>
		</PayoutContext.Provider>
	);
};

PayoutScreen.Title = function Title() {
	return (
		<ThemedView>
			<ThemedText style={styles.title} type="title">
				Send Payout
			</ThemedText>
		</ThemedView>
	);
};

PayoutScreen.AmountTextField = function AmountTextField() {
	const { setAmount } = usePayoutContext();
	const payout = useSelector((state: RootState) => state.payout);
	const [digitString, setDigitString] = useState("");
	const [isFocused, setIsFocused] = useState(false);

	const cents = digitString === "" ? 0 : Number.parseInt(digitString, 10);
	const displayValue = digitString === "" ? "" : (cents / 100).toFixed(2);

	useEffect(() => {
		if (!isFocused) {
			setDigitString(
				payout.amount != null &&
					payout.amount !== undefined &&
					payout.amount > 0
					? String(payout.amount)
					: "",
			);
		}
	}, [isFocused, payout.amount]);

	const onChangeText = (text: string) => {
		const digits = text.replace(/\D/g, "");
		const normalized = digits.replace(/^0+/, "") || "";
		setDigitString(normalized);
		const nextCents =
			normalized === "" ? undefined : Number.parseInt(normalized, 10);
		setAmount(nextCents);
	};

	const onFocus = () => {
		setIsFocused(true);
	};

	const onBlur = () => {
		setIsFocused(false);
	};

	return (
		<ThemedView style={styles.amountTextFieldSection}>
			<ThemedText style={styles.amountTextFieldTitle} type="defaultSemiBold">
				Amount
			</ThemedText>

			<TextInput
				accessibilityLabel="amount-input"
				accessibilityRole="text"
				accessibilityHint="Enter the amount to send"
				accessibilityValue={{ text: displayValue || "0.00" }}
				style={styles.input}
				placeholder="0.00"
				keyboardType="number-pad"
				value={displayValue}
				onChangeText={onChangeText}
				onFocus={onFocus}
				onBlur={onBlur}
			/>
		</ThemedView>
	);
};

PayoutScreen.CurrencyDropdown = function CurrencyDropdown() {
	const { currency, setCurrency } = usePayoutContext();

	return (
		<ThemedView style={styles.currencyDropdownSection}>
			<ThemedText style={styles.currencyDropdownTitle} type="defaultSemiBold">
				Currency
			</ThemedText>

			<Dropdown
				style={styles.input}
				placeholder="GBP"
				data={[
					{ label: "GBP", value: "GBP" },
					{ label: "EUR", value: "EUR" },
				]}
				labelField="label"
				valueField="value"
				value={currency}
				onChange={(item: { label: string; value: Currency }) => {
					setCurrency(item.value);
				}}
			/>
		</ThemedView>
	);
};

PayoutScreen.IBANTextField = function IBANTextField() {
	const { iban, setIban } = usePayoutContext();

	const handleIbanChange = (text: string) => {
		const cleaned = text
			.replace(/\s/g, "")
			.toUpperCase()
			.replace(/[^A-Z0-9]/g, "")
			.slice(0, 34);
		setIban(cleaned);
	};

	const showIbanError = iban.length > 0 && !IBAN_REGEX.test(iban);

	return (
		<ThemedView style={styles.ibanTextFieldSection}>
			<ThemedText style={styles.ibanTextFieldTitle} type="defaultSemiBold">
				IBAN
			</ThemedText>

			<TextInput
				style={[styles.input, showIbanError && styles.inputError]}
				placeholder="FR1212345123451234567A12310131231231231"
				placeholderTextColor="gray"
				autoCapitalize="characters"
				autoCorrect={false}
				value={iban}
				onChangeText={handleIbanChange}
			/>
			<ThemedText style={styles.ibanTextFieldHint} type="subtitle">
				Enter the destination bank account IBAN.
			</ThemedText>
			{showIbanError && (
				<ThemedText style={styles.ibanErrorText} type="subtitle">
					Enter a valid IBAN (e.g. GB82WEST12345698765432).
				</ThemedText>
			)}
		</ThemedView>
	);
};

interface ConfirmButtonProps {
	setIsModalVisible: (isModalVisible: boolean) => void;
}

PayoutScreen.ConfirmButton = function ConfirmButton({
	setIsModalVisible,
}: ConfirmButtonProps) {
	const { amount } = usePayoutContext();

	const isDisabled = amount == null || amount <= 0;

	const onPressConfirm = async () => {
		setIsModalVisible(true);
	};

	return (
		<ThemedView style={styles.confirmButtonSection}>
			<Pressable
				style={[
					styles.confirmButton,
					isDisabled && styles.confirmButtonDisabled,
				]}
				onPress={onPressConfirm}
				disabled={isDisabled}
			>
				<ThemedText style={styles.confirmButtonText} type="default">
					Confirm
				</ThemedText>
			</Pressable>
		</ThemedView>
	);
};

interface PayoutModalProps {
	isModalVisible: boolean;
	onCloseModal: () => void;
	onConfirmModal: () => void;
}

PayoutScreen.PayoutModal = function PayoutModal({
	isModalVisible,
	onCloseModal,
	onConfirmModal,
}: PayoutModalProps) {
	const payout = useSelector((state: RootState) => state.payout);
	const [createPayout, { isLoading }] = useCreatePayoutMutation();
	const formattedAmountWithCurrency = formatCurrency(
		payout.amount || 0,
		payout.currency || "GBP",
	);

	const onPressConfirmButton = async () => {
		const response = await createPayout({
			amount: payout.amount || 0,
			currency: payout.currency || "GBP",
			iban: payout.iban || "",
		});
		if (response.error) {
			console.error(response.error);
		} else {
			onConfirmModal();
		}
	};

	return (
		<Modal
			visible={isModalVisible}
			onRequestClose={onCloseModal}
			animationType="fade"
			transparent
			statusBarTranslucent
		>
			<Pressable
				style={styles.modalOverlay}
				onPress={onCloseModal}
				accessibilityRole="button"
				accessibilityLabel="Close modal"
			>
				<Pressable style={styles.modalBox} onPress={(e) => e.stopPropagation()}>
					<PayoutModalContent
						payout={{
							amount: payout.amount || 0,
							currency: payout.currency || "GBP",
							iban: payout.iban || "",
						}}
					>
						<PayoutModalContent.Title />
						<PayoutModalContent.Content
							title="Amount"
							value={formattedAmountWithCurrency}
						/>
						<PayoutModalContent.Content
							title="Currency"
							value={payout.currency || "GBP"}
						/>
						<PayoutModalContent.Content
							title="IBAN"
							value={payout.iban || ""}
						/>

						<ThemedView style={styles.modalButtonContainer}>
							<PayoutModalContent.Button
								buttonTitle="Cancel"
								customStyle={styles.modalCancelButton}
								textStyle={styles.modalCancelButtonText}
								onPressConfirm={onCloseModal}
								isLoading={isLoading}
							/>
							<PayoutModalContent.Button
								buttonTitle="Confirm"
								customStyle={styles.modalConfirmButton}
								onPressConfirm={onPressConfirmButton}
								isLoading={isLoading}
							/>
						</ThemedView>
					</PayoutModalContent>
				</Pressable>
			</Pressable>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: BACKGROUND_COLOR_LIGHT,
	},
	title: {
		backgroundColor: BACKGROUND_COLOR_LIGHT,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
		padding: 24,
	},
	modalButtonContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		gap: 8,
	},
	modalCancelButton: {
		width: "50%",
		height: 50,
		backgroundColor: "lightgray",
		padding: 8,
		borderRadius: 4,
		justifyContent: "center",
		alignItems: "center",
	},
	modalCancelButtonText: {
		color: "black",
		fontSize: 16,
		fontWeight: "bold",
	},
	modalConfirmButton: {
		width: "50%",
		height: 50,
		backgroundColor: "#0a7ea4",
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
		padding: 8,
		borderRadius: 4,
		textAlign: "center",
		justifyContent: "center",
		alignItems: "center",
	},
	modalBox: {
		width: "100%",
		maxHeight: "90%",
		backgroundColor: "white",
		borderRadius: 12,
		padding: 8,
	},
	input: {
		height: 50,
		borderWidth: 1,
		borderColor: "lightgray",
		padding: 8,
		borderRadius: 8,
		backgroundColor: "white",
		color: "black",
		fontSize: 18,
	},
	amountTextFieldSection: {
		paddingVertical: 16,
		backgroundColor: BACKGROUND_COLOR_LIGHT,
		minWidth: "70%",
		maxWidth: "90%",
	},
	amountTextFieldTitle: {
		paddingBottom: 8,
	},
	currencyDropdownSection: {
		paddingVertical: 16,
		backgroundColor: BACKGROUND_COLOR_LIGHT,
		minWidth: "10%",
		maxWidth: "40%",
	},
	currencyDropdownTitle: {
		paddingBottom: 8,
	},
	ibanTextFieldSection: {
		paddingVertical: 16,
		backgroundColor: BACKGROUND_COLOR_LIGHT,
		width: "100%",
	},
	ibanTextFieldTitle: {
		paddingBottom: 8,
	},
	ibanTextFieldHint: {
		paddingTop: 8,
		fontSize: 12,
		fontWeight: "300",
		color: "gray",
	},
	inputError: {
		borderColor: "#c53030",
		borderWidth: 1.5,
	},
	ibanErrorText: {
		paddingTop: 6,
		fontSize: 12,
		color: "#c53030",
	},
	confirmButtonSection: {
		paddingVertical: 16,
		backgroundColor: BACKGROUND_COLOR_LIGHT,
		width: "100%",
	},
	confirmButton: {
		backgroundColor: "#0a7ea4",
		color: "white",
		padding: 16,
		borderRadius: 4,
		textAlign: "center",
		fontSize: 16,
		height: 60,
		justifyContent: "center",
		alignItems: "center",
	},
	confirmButtonDisabled: {
		backgroundColor: "gray",
		opacity: 0.5,
	},
	confirmButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
});
