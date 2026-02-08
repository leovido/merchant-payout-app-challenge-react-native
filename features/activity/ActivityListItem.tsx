import { createContext, useContext } from "react";
import { StyleSheet, type ViewStyle } from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Divider } from "@/components/ui/Divider";
import type { ActivityItem } from "@/types/api";
import { dateFormatter } from "@/utils/dateFormatter";
import { formatCurrency } from "@/utils/formatter";

interface ActivityListItemProps {
	activity: ActivityItem;
	children: React.ReactNode;
	customStyle?: ViewStyle | ViewStyle[];
}

const ActivityContext = createContext<ActivityItem | null>(null);

function useActivityContext() {
	const context = useContext(ActivityContext);
	if (!context) {
		throw new Error(
			"useActivityContext must be used within an ActivityListItem",
		);
	}
	return context;
}

export function ActivityListItem({
	activity,
	children,
	customStyle,
}: ActivityListItemProps) {
	return (
		<ActivityContext.Provider value={activity}>
			<ThemedView style={[styles.container, customStyle]}>
				{children}
			</ThemedView>
			<Divider />
		</ActivityContext.Provider>
	);
}

ActivityListItem.ActivityType = function ActivityType() {
	const { type } = useActivityContext();
	const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

	return (
		<ThemedText
			accessibilityLabel={`Activity type: ${formattedType}`}
			accessibilityRole="text"
			accessibilityValue={{ text: formattedType }}
			style={styles.activityType}
		>
			{formattedType}
		</ThemedText>
	);
};

ActivityListItem.Description = function Description() {
	const activity = useActivityContext();

	return (
		<ThemedText
			accessibilityLabel={activity.description}
			accessibilityRole="text"
			accessibilityValue={{ text: activity.description }}
		>
			{activity.description}
		</ThemedText>
	);
};

ActivityListItem.Amount = function Amount() {
	const activity = useActivityContext();
	const formattedAmount = formatCurrency(activity.amount, activity.currency);

	return (
		<ThemedText
			type="defaultSemiBold"
			style={[
				styles.amount,
				activity.amount > 0 ? styles.positiveAmount : styles.negativeAmount,
			]}
			accessibilityLabel={`Amount, ${formattedAmount}`}
			accessibilityRole="text"
		>
			{formattedAmount}
		</ThemedText>
	);
};

ActivityListItem.Status = function Status() {
	const activity = useActivityContext();
	const formattedStatus =
		activity.status.charAt(0).toUpperCase() + activity.status.slice(1);

	return (
		<ThemedText
			accessibilityLabel={formattedStatus}
			accessibilityRole="text"
			accessibilityValue={{ text: formattedStatus }}
			type="defaultSemiBold"
			style={styles.status}
		>
			{formattedStatus}
		</ThemedText>
	);
};

ActivityListItem.Date = function ActivityDate() {
	const activity = useActivityContext();
	const formattedDate = dateFormatter(activity.date);

	return (
		<ThemedText
			accessibilityLabel={formattedDate}
			accessibilityRole="text"
			type="default"
			style={styles.date}
		>
			{formattedDate}
		</ThemedText>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 16,
	},
	amount: {
		color: "black",
	},
	positiveAmount: {
		color: "green",
	},
	negativeAmount: {
		color: "red",
	},
	status: {
		color: "gray",
		fontSize: 12,
		fontWeight: "400",
	},
	date: {
		color: "gray",
		fontSize: 12,
		fontWeight: "400",
	},
	activityType: {
		color: "black",
		fontSize: 18,
		fontWeight: "600",
		paddingBottom: 4,
	},
});
