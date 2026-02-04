import { StyleSheet, FlatList, Button, ActivityIndicator } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { ActivityListItem } from "@/components/ActivityListItem";
import {
	useGetPaginatedActivityQuery,
	useGetBalanceQuery,
} from "../features/api/apiSlice";
import { useState } from "react";
import { ActivityModal } from "@/components/ActivityModal";

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
					<ThemedText type="title">Business Account</ThemedText>
				</ThemedView>

				<ThemedView style={styles.section}>
					<ThemedText type="subtitle">Account Balance</ThemedText>
				</ThemedView>

				<ThemedView style={styles.balanceContainer}>
					<ThemedView style={styles.balances}>
						<ThemedText>Available</ThemedText>
						<ThemedText type="subtitle">
							{balance?.currency}
							{balance?.available_balance}
						</ThemedText>
					</ThemedView>

					<ThemedView style={styles.balances}>
						<ThemedText>Pending</ThemedText>
						<ThemedText type="subtitle">
							{balance?.currency}
							{balance?.pending_balance}
						</ThemedText>
					</ThemedView>
				</ThemedView>

				<ThemedView style={styles.section}>
					<ThemedText type="subtitle">Recent Activity</ThemedText>
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
					title="Show more"
					color={"blue"}
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
	balances: {},
	safeArea: {
		flex: 1,
	},
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
