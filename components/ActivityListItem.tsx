import { StyleSheet, View } from "react-native";
import type { ActivityItem } from "@/types/api";
import { formatCurrency } from "@/utils/formatter";
import { ThemedText } from "./themed-text";
import { createContext, useContext } from "react";
import { dateFormatter } from "@/utils/dateFormatter";
import { ThemedView } from "./themed-view";

interface ActivityListItemProps {
	activity: ActivityItem;
	children: React.ReactNode;
}

const activityContext = createContext<ActivityItem | null>(null);

function useActivityContext() {
	const context = useContext(activityContext);
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
}: ActivityListItemProps) {
	return (
		<activityContext.Provider value={activity}>
			<View style={styles.container}>{children}</View>
			<ThemedView style={styles.separator}></ThemedView>
		</activityContext.Provider>
	);
}

ActivityListItem.ActivityType = function ActivityType() {
	const { type } = useActivityContext();
	const formattedType = type.charAt(0).toUpperCase() + type.slice(1);

	return (
		<ThemedText
			accessibilityLabel="Activity type"
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
			accessibilityLabel="Activity description"
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
			accessibilityLabel="Activity amount"
			accessibilityRole="text"
			accessibilityValue={{ text: formattedAmount }}
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
		<ThemedText type="defaultSemiBold" style={styles.status}>
			{formattedStatus}
		</ThemedText>
	);
};

ActivityListItem.Date = function ActivityDate() {
	const activity = useActivityContext();
	const formattedDate = dateFormatter(activity.date);

	return (
		<ThemedText type="default" style={styles.date}>
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
	separator: {
		borderBottomColor: "gray",
		borderBottomWidth: StyleSheet.hairlineWidth,
	},
});
