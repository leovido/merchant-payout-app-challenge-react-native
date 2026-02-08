import { useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetPaginatedActivityQuery } from "@/api/apiSlice";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BACKGROUND_COLOR_LIGHT } from "@/constants/theme";
import { ActivityListItem } from "@/features/activity/ActivityListItem";
import { ActivityModal } from "@/features/activity/ActivityModal";
import { BalanceSection } from "@/features/balances/BalanceSection";

export default function HomeScreen() {
	const { data: activity } = useGetPaginatedActivityQuery({
		limit: 3,
		cursor: "",
	});

	const [isModalOpen, setIsModalOpen] = useState(false);

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

				<ThemedView style={styles.section}>
					<ThemedText
						accessibilityLabel="Recent activity"
						accessibilityRole="text"
						type="subtitle"
					>
						Recent Activity
					</ThemedText>
					<FlatList
						data={activity?.items}
						renderItem={(item) => (
							<ActivityListItem
								activity={item.item}
								customStyle={styles.activityListItem}
							>
								<ActivityListItem.Description />
								<ActivityListItem.Amount />
							</ActivityListItem>
						)}
						keyExtractor={(item) => item.id}
					/>
				</ThemedView>

				<Pressable
					accessibilityLabel="Show more activity"
					accessibilityRole="button"
					accessibilityValue={{ text: "Show more" }}
					onPress={() => setIsModalOpen(true)}
					style={styles.showMoreButton}
				>
					<ThemedText type="link">Show more</ThemedText>
				</Pressable>

				<ActivityModal
					isModalOpen={isModalOpen}
					setIsModalOpen={setIsModalOpen}
				/>
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
	showMoreButton: {
		backgroundColor: "lightblue",
		padding: 12,
		borderRadius: 8,
		fontSize: 18,
		fontWeight: "600",
		alignItems: "center",
		justifyContent: "center",
	},
	container: {
		flex: 1,
		padding: 16,
		backgroundColor: BACKGROUND_COLOR_LIGHT,
	},
	header: {
		marginBottom: 24,
	},
	section: {
		marginBottom: 24,
		backgroundColor: BACKGROUND_COLOR_LIGHT,
	},
});
