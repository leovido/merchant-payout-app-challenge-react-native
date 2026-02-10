import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/themed-view";
import { SemanticColors } from "@/constants/theme";

export function Divider() {
	return <ThemedView style={styles.divider} />;
}

const styles = StyleSheet.create({
	divider: {
		borderBottomColor: SemanticColors.light.border,
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
});
