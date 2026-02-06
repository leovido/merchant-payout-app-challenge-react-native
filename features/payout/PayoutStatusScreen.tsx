import { createContext } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import type { PayoutStatus } from "@/types/api";

const PayoutStatusContext = createContext<PayoutStatus | undefined>(undefined);

export const PayoutStatusScreen = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const status = useSelector((state: RootState) => state.payout.status);

	return (
		<PayoutStatusContext.Provider value={status}>
			<View style={styles.container}>{children}</View>
		</PayoutStatusContext.Provider>
	);
};

PayoutStatusScreen.Title = function Title() {
	return <Text style={styles.title}>{title}</Text>;
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
