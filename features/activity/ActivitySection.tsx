import type React from "react";
import { createContext, useContext, useState } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";
import { useGetPaginatedActivityQuery } from "@/api/apiSlice";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BACKGROUND_COLOR_LIGHT } from "@/constants/theme";
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
			<ThemedView style={styles.section}>{children}</ThemedView>
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
			<ThemedText type="link">Show more</ThemedText>
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
	showMoreButton: {
		backgroundColor: "lightblue",
		padding: 12,
		borderRadius: 8,
		fontSize: 18,
		fontWeight: "600",
		alignItems: "center",
		justifyContent: "center",
	},
	section: {
		marginBottom: 24,
		backgroundColor: BACKGROUND_COLOR_LIGHT,
	},
	activityListItem: {
		backgroundColor: BACKGROUND_COLOR_LIGHT,
	},
});
