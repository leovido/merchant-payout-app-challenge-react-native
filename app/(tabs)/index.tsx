import { useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	Pressable,
	StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityListItem } from "@/components/ActivityListItem";
import { ActivityModal } from "@/components/ActivityModal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BACKGROUND_COLOR_LIGHT } from "@/constants/theme";
import { formatCurrency } from "@/utils/formatter";
import {
	useGetBalanceQuery,
	useGetPaginatedActivityQuery,
} from "../features/api/apiSlice";

export default function HomeScreen() {
	const { data: balance, isLoading: isBalanceLoading } = useGetBalanceQuery();
	const { data: activity, isLoading: isActivityLoading } =
		useGetPaginatedActivityQuery({ limit: 3, cursor: "" });

	const [isModalOpen, setIsModalOpen] = useState(false);

	if (isBalanceLoading || isActivityLoading) {
		return <ActivityIndicator size="large" color="blue" />;
	}

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

				<ThemedView style={styles.accountBalanceSection}>
					<ThemedText
						accessibilityLabel="Account balance"
						accessibilityRole="text"
						type="subtitle"
					>
						Account Balance
					</ThemedText>
					<ThemedView style={styles.balanceContainer}>
						<ThemedView style={styles.balances}>
							<ThemedText
								accessibilityLabel="Available balance"
								accessibilityRole="text"
								style={styles.balanceLabel}
							>
								Available
							</ThemedText>
							<ThemedText
								accessibilityLabel="Available balance amount"
								accessibilityRole="text"
								type="subtitle"
								style={styles.balanceAmount}
							>
								{formatCurrency(
									balance?.available_balance ?? 0,
									balance?.currency ?? "GBP",
								)}
							</ThemedText>
						</ThemedView>

						<ThemedView style={styles.balances}>
							<ThemedText
								accessibilityLabel="Pending balance"
								accessibilityRole="text"
								style={styles.balanceLabel}
							>
								Pending
							</ThemedText>
							<ThemedText
								accessibilityLabel="Pending balance amount"
								accessibilityRole="text"
								type="subtitle"
								style={styles.balanceAmount}
							>
								{formatCurrency(
									balance?.pending_balance ?? 0,
									balance?.currency ?? "GBP",
								)}
							</ThemedText>
						</ThemedView>
					</ThemedView>
				</ThemedView>

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
	balanceContainer: {
		flexDirection: "row",
		width: "100%",
		gap: 16,
		paddingVertical: 16,
		backgroundColor: BACKGROUND_COLOR_LIGHT,
		marginBottom: 24,
	},
	accountBalanceSection: {
		backgroundColor: BACKGROUND_COLOR_LIGHT,
		paddingLeft: 16,
	},
	balanceLabel: {
		color: "gray",
	},
	balanceAmount: {
		fontWeight: "700",
		color: "black",
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
	balances: {
		backgroundColor: BACKGROUND_COLOR_LIGHT,
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
