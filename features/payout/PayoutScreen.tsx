import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import {
	Modal,
	Pressable,
	StyleSheet,
	TextInput,
	type ViewStyle,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import ScreenSecurityModule from "screen-security/src/ScreenSecurityModule";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BorderRadius, colors, Shadows, Spacing } from "@/constants/theme";
import {
	setAmount as setPayoutAmountAction,
	setCurrency as setPayoutCurrencyAction,
	setDeviceId as setPayoutDeviceIdAction,
	setIban as setPayoutIbanAction,
} from "@/features/payout/payoutSlice";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useAppDispatch, useAppSelector } from "@/store/store";
import type { Currency } from "@/types/api";
import { formatCurrency } from "@/utils/formatter";
import { PayoutModalContent } from "./PayoutModal";

/** IBAN REGEX: 2 letters (country) + 2 digits (check) + 4–30 alphanumeric (no spaces) */
const IBAN_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z0-9]{4,30}$/;

interface PayoutItem {
	amount?: number;
	formattedAmount: string;
	setAmount: (amount: number | undefined) => void;
	currency: Currency;
	setCurrency: (currency: Currency) => void;
	iban: string;
	setIban: (iban: string) => void;
	deviceId: string;
	ibanInputRef: React.RefObject<TextInput | null>;
}

const PayoutContext = createContext<PayoutItem>({
	amount: undefined,
	setAmount: () => {},
	formattedAmount: "",
	currency: "GBP",
	setCurrency: () => {},
	iban: "",
	setIban: () => {},
	deviceId: "",
	ibanInputRef: { current: null },
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
	const payout = useAppSelector((state) => state.payout);
	const [deviceId, setDeviceId] = useState<string | undefined>(undefined);
	const dispatch = useAppDispatch();
	const ibanInputRef = useRef<TextInput | null>(null);

	const setAmount = useCallback(
		(amount: number | undefined) => {
			dispatch(setPayoutAmountAction({ amount }));
		},
		[dispatch],
	);

	const setCurrency = useCallback(
		(currency: Currency) => {
			dispatch(setPayoutCurrencyAction({ currency }));
		},
		[dispatch],
	);

	const setIban = useCallback(
		(iban: string) => {
			dispatch(setPayoutIbanAction({ iban }));
		},
		[dispatch],
	);

	const payoutContext = useMemo(
		() => ({
			amount: payout.amount ?? undefined,
			formattedAmount: payout.formattedAmount ?? "",
			currency: payout.currency ?? "GBP",
			iban: payout.iban ?? "",
			deviceId: payout.device_id ?? "",
			setAmount,
			setCurrency,
			setIban,
			ibanInputRef,
		}),
		[
			payout.amount,
			payout.formattedAmount,
			payout.currency,
			payout.iban,
			payout.device_id,
			setAmount,
			setCurrency,
			setIban,
		],
	);

	useEffect(() => {
		dispatch(setPayoutDeviceIdAction({ device_id: deviceId }));
	}, [deviceId, dispatch]);

	useEffect(() => {
		const fetchDeviceId = () => {
			try {
				const deviceId = ScreenSecurityModule.getDeviceId();
				setDeviceId(deviceId || "");
			} catch (error) {
				console.error(error);
				setDeviceId("");
			}
		};

		fetchDeviceId();
	}, []);

	return (
		<PayoutContext.Provider value={payoutContext}>
			<ThemedView style={[styles.container, customStyle]}>
				{children}
			</ThemedView>
		</PayoutContext.Provider>
	);
};

PayoutScreen.HeaderContainer = function HeaderContainer({
	children,
}: {
	children: React.ReactNode;
}) {
	return <ThemedView style={styles.headerContainer}>{children}</ThemedView>;
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
	const { setAmount, ibanInputRef } = usePayoutContext();
	const payout = useAppSelector((state) => state.payout);
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
				clearButtonMode="while-editing"
				returnKeyType="next"
				returnKeyLabel="Next"
				onSubmitEditing={() => {
					ibanInputRef.current?.focus();
				}}
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
	const { Keyboard } = useKeyboard();
	const { iban, setIban, ibanInputRef } = usePayoutContext();

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
				ref={ibanInputRef}
				style={[styles.input, showIbanError && styles.inputError]}
				placeholder="FR5417445072279J8QHG0NRDK69"
				placeholderTextColor={colors.textPlaceholder}
				autoCapitalize="characters"
				autoCorrect={false}
				value={iban}
				onChangeText={handleIbanChange}
				clearButtonMode="while-editing"
				returnKeyType="done"
				onSubmitEditing={() => {
					Keyboard.dismiss();
				}}
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
	const { amount, iban } = usePayoutContext();

	const isDisabled = iban.length === 0 || amount === undefined || amount <= 0;

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
				<ThemedText
					style={[
						styles.confirmButtonText,
						isDisabled && styles.confirmButtonDisabledText,
					]}
					type="default"
				>
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
	isLoading: boolean;
}

PayoutScreen.PayoutModal = function PayoutModal({
	isModalVisible,
	onCloseModal,
	onConfirmModal,
	isLoading,
}: PayoutModalProps) {
	const payout = useAppSelector((state) => state.payout);
	const formattedAmountWithCurrency = formatCurrency(
		payout.amount ?? 0,
		payout.currency ?? "GBP",
	);

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
							amount: payout.amount ?? 0,
							currency: payout.currency ?? "GBP",
							iban: payout.iban ?? "",
						}}
					>
						<PayoutModalContent.Title />
						<PayoutModalContent.Content
							title="Amount"
							value={formattedAmountWithCurrency}
						/>
						<PayoutModalContent.Content
							title="Currency"
							value={payout.currency ?? "GBP"}
						/>
						<PayoutModalContent.Content
							title="IBAN"
							value={payout.iban ?? ""}
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
								onPressConfirm={onConfirmModal}
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
		padding: Spacing.screenPaddingHorizontal,
		backgroundColor: colors.backgroundPrimary,
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		backgroundColor: colors.backgroundPrimary,
		width: "100%",
	},
	title: {
		backgroundColor: colors.backgroundPrimary,
	},
	modalOverlay: {
		flex: 1,
		backgroundColor: colors.overlay,
		justifyContent: "center",
		alignItems: "center",
		padding: Spacing.modalPadding,
	},
	modalButtonContainer: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		gap: Spacing.labelInputGap,
	},
	modalCancelButton: {
		width: "50%",
		height: 50,
		backgroundColor: colors.buttonSecondaryBackground,
		padding: Spacing.labelInputGap,
		borderRadius: BorderRadius.button,
		justifyContent: "center",
		alignItems: "center",
	},
	modalCancelButtonText: {
		color: colors.textPrimary,
		fontSize: 16,
		fontWeight: "600",
	},
	modalConfirmButton: {
		width: "50%",
		height: 50,
		backgroundColor: colors.primary,
		color: colors.backgroundSecondary,
		fontSize: 16,
		fontWeight: "600",
		padding: Spacing.labelInputGap,
		borderRadius: BorderRadius.button,
		textAlign: "center",
		justifyContent: "center",
		alignItems: "center",
	},
	modalBox: {
		width: "100%",
		maxHeight: "90%",
		backgroundColor: colors.backgroundSecondary,
		borderRadius: BorderRadius.modal,
		padding: Spacing.labelInputGap,
		...Shadows.modal,
	},
	input: {
		height: 50,
		borderWidth: 1,
		borderColor: colors.border,
		padding: Spacing.labelInputGap,
		borderRadius: BorderRadius.input,
		backgroundColor: colors.backgroundSecondary,
		color: colors.textPrimary,
		fontSize: 18,
	},
	amountTextFieldSection: {
		paddingVertical: Spacing.sectionPaddingVertical,
		backgroundColor: colors.backgroundPrimary,
		minWidth: "70%",
		maxWidth: "80%",
	},
	amountTextFieldTitle: {
		paddingBottom: Spacing.labelInputGap,
	},
	currencyDropdownSection: {
		paddingVertical: Spacing.sectionPaddingVertical,
		backgroundColor: colors.backgroundPrimary,
		minWidth: "20%",
		maxWidth: "50%",
	},
	currencyDropdownTitle: {
		paddingBottom: Spacing.labelInputGap,
	},
	ibanTextFieldSection: {
		paddingVertical: Spacing.sectionPaddingVertical,
		backgroundColor: colors.backgroundPrimary,
		width: "100%",
	},
	ibanTextFieldTitle: {
		paddingBottom: Spacing.labelInputGap,
	},
	ibanTextFieldHint: {
		paddingTop: Spacing.labelInputGap,
		fontSize: 12,
		fontWeight: "400",
		color: colors.textSecondary,
	},
	inputError: {
		borderColor: colors.error,
		borderWidth: 1.5,
	},
	ibanErrorText: {
		paddingTop: 6,
		fontSize: 12,
		color: colors.error,
	},
	confirmButtonSection: {
		paddingVertical: Spacing.sectionPaddingVertical,
		backgroundColor: colors.backgroundPrimary,
		width: "100%",
	},
	confirmButton: {
		backgroundColor: colors.primary,
		color: colors.backgroundSecondary,
		padding: Spacing.sectionPaddingVertical,
		borderRadius: BorderRadius.button,
		textAlign: "center",
		fontSize: 16,
		height: 60,
		justifyContent: "center",
		alignItems: "center",
	},
	confirmButtonDisabled: {
		backgroundColor: colors.buttonDisabledBackground,
	},
	confirmButtonText: {
		color: colors.backgroundSecondary,
		fontSize: 16,
		fontWeight: "600",
	},
	confirmButtonDisabledText: {
		color: colors.buttonDisabledText,
		fontWeight: "400",
	},
});
