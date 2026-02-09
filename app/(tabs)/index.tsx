import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BACKGROUND_COLOR_LIGHT } from "@/constants/theme";
import { ActivitySection } from "@/features/activity/ActivitySection";
import { BalanceSection } from "@/features/balances/BalanceSection";

export default function HomeScreen() {
	return (
		<SafeAreaView style={styles.safeArea}>
			<ThemedView style={styles.container}>
				<ThemedView style={styles.header}>
					<ThemedText
						accessibilityLabel="Business account"
						accessibilityRole="text"
						accessibilityValue={{ text: "Business Account" }}
						type="title"
						style={styles.headerTitle}
					>
						Business Account
					</ThemedText>
				</ThemedView>

				<BalanceSection>
					<BalanceSection.Title />
					<BalanceSection.BalanceTypeContainer>
						<BalanceSection.BalanceType type="Available" />
						<BalanceSection.BalanceType type="Pending" />
					</BalanceSection.BalanceTypeContainer>
				</BalanceSection>

				<ActivitySection>
					<ActivitySection.Title />
					<ActivitySection.List />
					<ActivitySection.Button />
					<ActivitySection.Modal />
				</ActivitySection>
			</ThemedView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	activityListItem: {
		backgroundColor: BACKGROUND_COLOR_LIGHT,
	},
	headerTitle: {
		backgroundColor: BACKGROUND_COLOR_LIGHT,
	},
	separator: {
		backgroundColor: "black",
	},
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: BACKGROUND_COLOR_LIGHT,
	},
	header: {
		marginBottom: 24,
	},
});
