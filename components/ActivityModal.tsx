import { StyleSheet, FlatList, Modal, ActivityIndicator } from "react-native";
import { ThemedView } from "./themed-view";
import { ThemedText } from "./themed-text";
import { ActivityListItem } from "./ActivityListItem";
import { useGetPaginatedActivityQuery } from "@/app/features/api/apiSlice";

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
			visible={isModalOpen}
			animationType="slide"
			onRequestClose={() => setIsModalOpen(false)}
		>
			<ThemedView style={styles.modalContainer}>
				<ThemedText type="title">Activity</ThemedText>
				<FlatList
					data={activityData?.items}
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
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		padding: 16,
	},
});
