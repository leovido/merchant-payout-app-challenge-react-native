import {
	ActivityIndicator,
	Button,
	FlatList,
	Modal,
	StyleSheet,
} from "react-native";
import { useGetPaginatedActivityQuery } from "@/app/features/api/apiSlice";
import { ActivityListItem } from "./ActivityListItem";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

export const ActivityModal = ({
	isModalOpen,
	setIsModalOpen,
}: {
	isModalOpen: boolean;
	setIsModalOpen: (isModalOpen: boolean) => void;
}) => {
	const { data: activityData, isLoading: isActivityLoading } =
		useGetPaginatedActivityQuery({ limit: 100, cursor: "" });

	if (isActivityLoading) {
		return <ActivityIndicator size="large" color="blue" />;
	}

	return (
		<Modal
			presentationStyle="formSheet"
			visible={isModalOpen}
			animationType="slide"
			onRequestClose={() => setIsModalOpen(false)}
		>
			<ThemedView style={styles.modalContainer}>
				<ThemedView>
					<ThemedView style={styles.header}>
						<ThemedText type="title">Recent Activity</ThemedText>

						<Button title="Done" onPress={() => setIsModalOpen(false)} />
					</ThemedView>
					<ThemedView style={styles.separator}></ThemedView>
				</ThemedView>
				<FlatList
					data={activityData?.items}
					renderItem={(item) => (
						<ActivityListItem activity={item.item}>
							<ThemedView style={styles.activityContainer}>
								<ThemedView style={styles.descriptionContainer}>
									<ActivityListItem.ActivityType />
									<ActivityListItem.Description />
									<ActivityListItem.Date />
								</ThemedView>
								<ThemedView style={styles.amountContainer}>
									<ActivityListItem.Amount />
									<ActivityListItem.Status />
								</ThemedView>
							</ThemedView>
						</ActivityListItem>
					)}
					keyExtractor={(item) => item.id}
				></FlatList>
			</ThemedView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		padding: 16,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 16,
		paddingVertical: 16,
	},
	separator: {
		borderBottomColor: "gray",
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
	activityContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		alignItems: "center",
	},
	amountContainer: {
		flexDirection: "column",
		alignItems: "flex-end",
	},
	descriptionContainer: {
		flexDirection: "column",
	},
});
