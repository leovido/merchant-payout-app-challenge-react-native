import { useState } from "react";
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
	const [cursor, setCursor] = useState<string | null>(null);
	const {
		data: activityData,
		isLoading: isActivityLoading,
		isFetching: isActivityFetching,
		refetch,
	} = useGetPaginatedActivityQuery({ cursor: cursor ?? undefined });

	if (!activityData && isActivityLoading) {
		return <ActivityIndicator size="large" color="blue" />;
	}

	const _isLoadingMore = activityData?.has_more && isActivityLoading;

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
					keyExtractor={(item, index) => `${item.id}-${index}`}
					initialNumToRender={10}
					onEndReached={() => {
						if (activityData?.has_more) {
							setCursor(activityData.next_cursor);
							refetch();
						}
					}}
				></FlatList>
				{isActivityFetching && (
					<ThemedView style={styles.loadingContainer}>
						<ActivityIndicator size="small" />
						<ThemedText style={styles.loadingText}>
							{"Loading more..."}
						</ThemedText>
					</ThemedView>
				)}
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
	loadingText: {
		color: "gray",
		fontSize: 14,
		fontWeight: "400",
	},
	loadingContainer: {
		flexDirection: "column",
		justifyContent: "center",
		gap: 8,
		alignItems: "center",
		marginTop: 16,
	},
	amountContainer: {
		flexDirection: "column",
		alignItems: "flex-end",
	},
	descriptionContainer: {
		flexDirection: "column",
	},
});
