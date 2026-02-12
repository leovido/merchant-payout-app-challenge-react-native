import { useCallback, useEffect, useRef, useState } from "react";
import {
	ActivityIndicator,
	FlatList,
	type ListRenderItemInfo,
	Modal,
	Pressable,
	StyleSheet,
	View,
} from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { useGetPaginatedActivityQuery } from "@/api/apiSlice";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Divider } from "@/components/ui/Divider";
import { colors, Spacing, Typography } from "@/constants/theme";
import { ActivityListItem } from "@/features/activity/ActivityListItem";
import { ACTIVITY_MODAL_SKELETON_LAYOUT } from "@/features/activity/ActivitySkeletonLayout";
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
	} = useGetPaginatedActivityQuery(
		{ limit: 15, cursor: cursor ?? undefined },
		{ refetchOnMountOrArgChange: true },
	);

	const lastFetchedCursorRef = useRef<string | null>(null);

	useEffect(() => {
		if (!isModalOpen) {
			setCursor(null);
			lastFetchedCursorRef.current = null;
		}
	}, [isModalOpen]);

	useEffect(() => {
		if (
			cursor != null &&
			cursor !== lastFetchedCursorRef.current &&
			!isActivityFetching
		) {
			lastFetchedCursorRef.current = cursor;
			refetch();
		}
	}, [cursor, isActivityFetching, refetch]);

	const renderItem = useCallback(
		(item: ListRenderItemInfo<ActivityItem>) => (
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
		),
		[],
	);

	const onEndReached = useCallback(() => {
		if (
			activityData?.has_more &&
			activityData?.next_cursor &&
			!isActivityFetching
		) {
			setCursor(activityData.next_cursor);
		}
	}, [activityData?.has_more, activityData?.next_cursor, isActivityFetching]);

	const isInitialLoading = !activityData && isActivityLoading;

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
				<View
					style={[
						styles.contentWrapper,
						isInitialLoading && styles.contentVisuallyHidden,
					]}
					pointerEvents={isInitialLoading ? "none" : "auto"}
				>
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
								<ThemedText
									type="defaultSemiBold"
									style={styles.doneButtonText}
								>
									Done
								</ThemedText>
							</Pressable>
						</ThemedView>
						<Divider />
					</ThemedView>
					<FlatList
						style={styles.list}
						contentContainerStyle={styles.listContent}
						accessibilityLabel="Activity list"
						accessibilityRole="list"
						data={activityData?.items ?? []}
						renderItem={renderItem}
						keyExtractor={(item, index) => `${item.id}-${index}`}
						initialNumToRender={10}
						onEndReached={onEndReached}
						onEndReachedThreshold={0.2}
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
				</View>
				{isInitialLoading && (
					<View
						style={styles.skeletonOverlay}
						pointerEvents="none"
						testID="activity-modal-skeleton-overlay"
					>
						<Skeleton
							isLoading
							layout={ACTIVITY_MODAL_SKELETON_LAYOUT}
							containerStyle={styles.skeletonContainer}
							boneColor={colors.border}
							highlightColor={colors.backgroundSecondary}
							animationType="shiver"
							animationDirection="horizontalLeft"
						/>
					</View>
				)}
			</ThemedView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		padding: Spacing.screenPaddingHorizontal,
		position: "relative",
	},
	contentWrapper: {
		flex: 1,
	},
	contentVisuallyHidden: {
		opacity: 0,
	},
	list: {
		flex: 1,
	},
	listContent: {
		flexGrow: 1,
		paddingBottom: Spacing.sectionPaddingVertical,
	},
	skeletonOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1,
	},
	skeletonContainer: {
		padding: Spacing.sm,
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
