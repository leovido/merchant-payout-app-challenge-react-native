import { useCallback, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	type ListRenderItemInfo,
	Modal,
	Pressable,
	StyleSheet,
} from "react-native";
import { useGetPaginatedActivityQuery } from "@/api/apiSlice";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Divider } from "@/components/ui/Divider";
import { colors, Spacing, Typography } from "@/constants/theme";
import { ActivityListItem } from "@/features/activity/ActivityListItem";
import type { ActivityItem } from "@/types/api";

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

	const renderItem = (item: ListRenderItemInfo<ActivityItem>) => (
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
	);

	const onEndReached = useCallback(() => {
		if (activityData?.has_more && activityData?.next_cursor) {
			setCursor(activityData.next_cursor);
			refetch();
		}
	}, [activityData?.has_more, activityData?.next_cursor, refetch]);

	if (!activityData && isActivityLoading) {
		return <ActivityIndicator size="large" color="blue" />;
	}

	return (
		<Modal
			accessibilityLabel="Recent activity modal"
			accessibilityRole="none"
			presentationStyle="formSheet"
			visible={isModalOpen}
			animationType="slide"
			onRequestClose={() => setIsModalOpen(false)}
		>
			<ThemedView style={styles.modalContainer}>
				<ThemedView>
					<ThemedView
						accessibilityLabel="Recent activity modal header"
						accessibilityRole="header"
						style={styles.header}
					>
						<ThemedText
							accessibilityLabel="Recent activity"
							accessibilityRole="text"
							type="title"
						>
							Recent Activity
						</ThemedText>

						<Pressable
							accessibilityLabel="Done"
							accessibilityRole="button"
							style={styles.doneButton}
							onPress={() => setIsModalOpen(false)}
						>
							<ThemedText type="defaultSemiBold" style={styles.doneButtonText}>
								Done
							</ThemedText>
						</Pressable>
					</ThemedView>
					<Divider />
				</ThemedView>
				<FlatList
					accessibilityLabel="Activity list"
					accessibilityRole="list"
					data={activityData?.items}
					renderItem={renderItem}
					keyExtractor={(item, index) => `${item.id}-${index}`}
					initialNumToRender={10}
					onEndReached={onEndReached}
				/>
				{isActivityFetching && (
					<ThemedView style={styles.loadingContainer}>
						<ActivityIndicator size="small" />
						<ThemedText
							accessibilityLabel="Loading more"
							accessibilityRole="text"
							style={styles.loadingText}
						>
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
		padding: Spacing.screenPaddingHorizontal,
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: Spacing.sectionPaddingVertical,
		paddingVertical: Spacing.sectionPaddingVertical,
	},
	activityContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		alignItems: "center",
	},
	loadingText: {
		color: colors.textSecondary,
		fontSize: Typography.hint.fontSize,
		fontWeight: Typography.hint.fontWeight,
	},
	loadingContainer: {
		flexDirection: "column",
		justifyContent: "center",
		gap: Spacing.labelInputGap,
		alignItems: "center",
		marginTop: Spacing.sectionPaddingVertical,
	},
	amountContainer: {
		flexDirection: "column",
		alignItems: "flex-end",
	},
	descriptionContainer: {
		flexDirection: "column",
	},
	doneButton: {
		backgroundColor: colors.backgroundSecondary,
		padding: Spacing.labelInputGap,
	},
	doneButtonText: {
		color: colors.showMoreButtonText,
	},
});
