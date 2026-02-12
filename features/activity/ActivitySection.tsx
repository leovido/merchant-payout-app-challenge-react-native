import { createContext, useCallback, useContext, useState } from "react";
import {
	FlatList,
	type ListRenderItemInfo,
	Pressable,
	StyleSheet,
	View,
} from "react-native";
import Skeleton from "react-native-reanimated-skeleton";
import { useGetPaginatedActivityQuery } from "@/api/apiSlice";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BorderRadius, colors, Spacing } from "@/constants/theme";
import type { ActivityItem } from "@/types/api";
import { ActivityListItem } from "./ActivityListItem";
import { ActivityModal } from "./ActivityModal";
import { ACTIVITY_SKELETON_LAYOUT } from "./ActivitySkeletonLayout";

const ActivitySectionContext = createContext<{
	activity?: ActivityItem[];
	isLoading: boolean;
	isModalOpen: boolean;
	setIsModalOpen: (isModalOpen: boolean) => void;
}>({
	activity: undefined,
	isLoading: false,
	isModalOpen: false,
	setIsModalOpen: () => {},
});

const useActivitySectionContext = () => {
	const context = useContext(ActivitySectionContext);
	if (!context) {
		throw new Error(
			"useActivitySectionContext must be used within an ActivitySection",
		);
	}
	return context;
};

export function ActivitySection({ children }: { children: React.ReactNode }) {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const { data: activityData, isLoading } = useGetPaginatedActivityQuery({
		limit: 3,
		cursor: "",
	});

	return (
		<ActivitySectionContext.Provider
			value={{
				activity: activityData?.items,
				isLoading,
				isModalOpen,
				setIsModalOpen,
			}}
		>
			<ThemedView
				accessibilityLabel="Recent activity section"
				accessibilityRole="summary"
				style={styles.section}
			>
				<View
					style={isLoading ? styles.contentVisuallyHidden : undefined}
					pointerEvents={isLoading ? "none" : "auto"}
				>
					{children}
				</View>
				{isLoading && (
					<View style={styles.skeletonOverlay} pointerEvents="none">
						<Skeleton
							isLoading
							layout={ACTIVITY_SKELETON_LAYOUT}
							containerStyle={styles.skeletonContainer}
							boneColor={colors.border}
							highlightColor={colors.backgroundSecondary}
							animationType="shiver"
							animationDirection="horizontalLeft"
						/>
					</View>
				)}
			</ThemedView>
		</ActivitySectionContext.Provider>
	);
}

ActivitySection.Title = function Title() {
	return (
		<ThemedText
			accessibilityLabel="Recent activity"
			accessibilityRole="text"
			type="subtitle"
		>
			Recent Activity
		</ThemedText>
	);
};

ActivitySection.List = function List() {
	const { activity } = useActivitySectionContext();

	const renderItem = useCallback((item: ListRenderItemInfo<ActivityItem>) => {
		return (
			<ActivityListItem
				activity={item.item}
				customStyle={styles.activityListItem}
			>
				<ActivityListItem.Description />
				<ActivityListItem.Amount />
			</ActivityListItem>
		);
	}, []);

	return (
		<FlatList
			accessibilityLabel="Recent activity list"
			accessibilityRole="list"
			data={activity}
			renderItem={renderItem}
			keyExtractor={(item) => item.id}
		/>
	);
};

ActivitySection.Button = function Button() {
	const { setIsModalOpen } = useActivitySectionContext();

	return (
		<Pressable
			accessibilityLabel="Show more activity"
			accessibilityRole="button"
			accessibilityValue={{ text: "Show more" }}
			onPress={() => setIsModalOpen(true)}
			style={styles.showMoreButton}
		>
			<ThemedText type="link" style={styles.showMoreButtonText}>
				Show more
			</ThemedText>
		</Pressable>
	);
};

ActivitySection.Modal = function Modal() {
	const { isModalOpen, setIsModalOpen } = useActivitySectionContext();

	return (
		<ActivityModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
	);
};

const styles = StyleSheet.create({
	contentVisuallyHidden: {
		opacity: 0,
	},
	section: {
		marginBottom: Spacing.sectionGap,
		backgroundColor: colors.backgroundPrimary,
		position: "relative",
	},
	skeletonOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1,
	},
	skeletonContainer: {},
	showMoreButton: {
		backgroundColor: colors.showMoreButtonBackground,
		paddingTop: Spacing.fieldGap,
		paddingBottom: Spacing.listItemPaddingVertical,
		paddingHorizontal: Spacing.sectionPaddingVertical,
		borderRadius: BorderRadius.button,
		alignItems: "center",
		justifyContent: "center",
		marginTop: Spacing.lg,
	},
	showMoreButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.showMoreButtonText,
	},
	activityListItem: {
		backgroundColor: colors.backgroundPrimary,
	},
});
