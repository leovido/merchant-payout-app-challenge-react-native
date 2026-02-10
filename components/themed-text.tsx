import { StyleSheet, Text, type TextProps } from "react-native";

import { Colors, Typography } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useThemeColor } from "@/hooks/use-theme-color";

export type ThemedTextProps = TextProps & {
	lightColor?: string;
	darkColor?: string;
	type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
};

export function ThemedText({
	style,
	lightColor,
	darkColor,
	type = "default",
	...rest
}: ThemedTextProps) {
	const theme = useColorScheme() ?? "light";
	const defaultColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		"text",
	);
	const linkColor = Colors[theme].tint;

	return (
		<Text
			accessibilityLabel={rest.accessibilityLabel}
			accessibilityRole={rest.accessibilityRole}
			style={[
				{ color: type === "link" ? linkColor : defaultColor },
				type === "default" ? styles.default : undefined,
				type === "title" ? styles.title : undefined,
				type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
				type === "subtitle" ? styles.subtitle : undefined,
				type === "link" ? styles.link : undefined,
				style,
			]}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	default: {
		fontSize: Typography.body.fontSize,
		lineHeight: Typography.body.lineHeight,
		fontWeight: Typography.body.fontWeight,
	},
	defaultSemiBold: {
		fontSize: Typography.label.fontSize,
		lineHeight: Typography.label.lineHeight,
		fontWeight: Typography.label.fontWeight,
	},
	title: {
		fontSize: Typography.title.fontSize,
		lineHeight: Typography.title.lineHeight,
		fontWeight: Typography.title.fontWeight,
	},
	subtitle: {
		fontSize: Typography.sectionTitle.fontSize,
		lineHeight: Typography.sectionTitle.lineHeight,
		fontWeight: Typography.sectionTitle.fontWeight,
	},
	link: {
		fontSize: Typography.link.fontSize,
		lineHeight: Typography.link.lineHeight,
		fontWeight: Typography.link.fontWeight,
	},
});
