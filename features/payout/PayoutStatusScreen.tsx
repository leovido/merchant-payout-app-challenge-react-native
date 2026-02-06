import { createContext } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import { ThemedText } from "@/components/themed-text";
import type { RootState } from "@/store/store";
import type { PayoutResponse } from "@/types/api";

const PayoutStatusContext = createContext<PayoutResponse | undefined>(
	undefined,
);

export const PayoutStatusScreen = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const payout = useSelector((state: RootState) => state.payout.payoutResponse);

	return (
		<PayoutStatusContext.Provider value={payout}>
			<View style={styles.container}>{children}</View>
		</PayoutStatusContext.Provider>
	);
};

PayoutStatusScreen.Title = function Title({ title }: { title: string }) {
	return (
		<ThemedText style={styles.title} type="title">
			{title}
		</ThemedText>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		paddingBottom: 20,
	},
});
