import type React from "react";
import { createContext, useContext, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { useGetPaginatedActivityQuery } from "@/api/apiSlice";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BorderRadius, SemanticColors, Spacing } from "@/constants/theme";
import type { ActivityItem } from "@/types/api";
import { ActivityListItem } from "./ActivityListItem";
import { ActivityModal } from "./ActivityModal";

const ActivitySectionContext = createContext<{
	activity?: ActivityItem[];
	isModalOpen: boolean;
	setIsModalOpen: (isModalOpen: boolean) => void;
}>({
	activity: undefined,
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
	const { data: activityData } = useGetPaginatedActivityQuery({
		limit: 3,
		cursor: "",
	});

	return (
		<ActivitySectionContext.Provider
			value={{ activity: activityData?.items, isModalOpen, setIsModalOpen }}
		>
			<ThemedView
				accessibilityLabel="Recent activity section"
				accessibilityRole="summary"
				style={styles.section}
			>
				{children}
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

	return (
		<FlatList
			accessibilityLabel="Recent activity list"
			accessibilityRole="list"
			data={activity}
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

const c = SemanticColors.light;

const styles = StyleSheet.create({
	showMoreButton: {
		backgroundColor: c.showMoreButtonBackground,
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
		color: c.showMoreButtonText,
	},
	section: {
		marginBottom: Spacing.sectionGap,
		backgroundColor: c.backgroundPrimary,
	},
	activityListItem: {
		backgroundColor: c.backgroundPrimary,
	},
});
