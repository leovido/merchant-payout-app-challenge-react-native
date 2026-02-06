import { StyleSheet } from "react-native";
import { ThemedView } from "./themed-view";

export function Divider() {
	return <ThemedView style={styles.divider} />;
}

const styles = StyleSheet.create({
	divider: {
		borderBottomColor: "lightgray",
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
});
