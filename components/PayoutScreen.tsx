import { createContext, useContext, useEffect, useState } from "react";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	TextInput,
	type ViewStyle,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { useCreatePayoutMutation } from "@/app/features/api/apiSlice";
import { setPayout } from "@/app/features/payout/payoutSlice";
import type { RootState } from "@/app/store";
import { BACKGROUND_COLOR_LIGHT } from "@/constants/theme";
import type { Currency } from "@/types/api";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

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
	const [iban, setIban] = useState("");

	const handleIbanChange = (text: string) => {
		setIban(text);
	};

	return (
		<ThemedView style={styles.ibanTextFieldSection}>
			<ThemedText style={styles.ibanTextFieldTitle} type="defaultSemiBold">
				IBAN
			</ThemedText>

			<TextInput
				style={styles.input}
				placeholder="FR1212345123451234567A12310131231231231"
				keyboardType="numeric"
				value={iban}
				onChangeText={handleIbanChange}
			/>
			<ThemedText style={styles.ibanTextFieldHint} type="subtitle">
				Enter the destination bank account IBAN.
			</ThemedText>
		</ThemedView>
	);
};

PayoutScreen.ConfirmButton = function ConfirmButton() {
	const { amount, currency, iban } = usePayoutContext();
	const [createPayout, { isLoading }] = useCreatePayoutMutation();

	const isDisabled = amount == null || amount <= 0;

	const onPressConfirm = async () => {
		if (amount == null || amount <= 0) {
			return;
		}
		const response = await createPayout({ amount, currency, iban });

		if (response.error) {
			console.error("Create payout error", response.error);
		} else {
			console.log("Create payout response", response.data);
		}
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
				{isLoading ? (
					<ActivityIndicator size="small" color="white" />
				) : (
					<ThemedText style={styles.confirmButtonText} type="default">
						Confirm
					</ThemedText>
				)}
			</Pressable>
		</ThemedView>
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
