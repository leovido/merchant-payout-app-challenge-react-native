import { useState } from "react";
import { ActivityIndicator, Button, FlatList, StyleSheet } from "react-native";
import { ActivityListItem } from "@/components/ActivityListItem";
import { ActivityModal } from "@/components/ActivityModal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import {
	useGetBalanceQuery,
	useGetPaginatedActivityQuery,
} from "../features/api/apiSlice";
import { SafeAreaView } from "react-native-safe-area-context";

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
					>
						Business Account
					</ThemedText>
				</ThemedView>

				<ThemedView style={styles.section}>
					<ThemedText
						accessibilityLabel="Account balance"
						accessibilityRole="text"
						type="subtitle"
					>
						Account Balance
					</ThemedText>
				</ThemedView>

				<ThemedView style={styles.balanceContainer}>
					<ThemedView style={styles.balances}>
						<ThemedText
							accessibilityLabel="Available balance"
							accessibilityRole="text"
						>
							Available
						</ThemedText>
						<ThemedText
							accessibilityLabel="Available balance amount"
							accessibilityRole="text"
							type="subtitle"
						>
							{balance?.currency}
							{balance?.available_balance}
						</ThemedText>
					</ThemedView>

					<ThemedView style={styles.balances}>
						<ThemedText
							accessibilityLabel="Pending balance"
							accessibilityRole="text"
						>
							Pending
						</ThemedText>
						<ThemedText
							accessibilityLabel="Pending balance amount"
							accessibilityRole="text"
							type="subtitle"
						>
							{balance?.currency}
							{balance?.pending_balance}
						</ThemedText>
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
								description={item.item.description}
								currency={item.item.currency}
								amount={item.item.amount}
							/>
						)}
						keyExtractor={(item) => item.id}
					></FlatList>
				</ThemedView>

				<Button
					accessibilityLabel="Show more"
					title="Show more"
					onPress={() => setIsModalOpen(true)}
				></Button>

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
	separator: {
		backgroundColor: "black",
	},
	balanceContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		width: "100%",
		gap: 8,
		padding: 16,
	},
	button: {
		backgroundColor: "blue",
		padding: 16,
		borderRadius: 8,
		margin: 16,
	},
	balances: {},
	container: {
		flex: 1,
		padding: 16,
	},
	header: {
		marginBottom: 24,
	},
	section: {
		marginBottom: 24,
	},
});
