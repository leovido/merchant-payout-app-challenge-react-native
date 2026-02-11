import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { colors } from "@/constants/theme";

export function Divider() {
	return <ThemedView style={styles.divider} />;
}

const styles = StyleSheet.create({
	divider: {
		borderBottomColor: colors.border,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
});
