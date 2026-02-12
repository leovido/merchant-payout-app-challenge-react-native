const React = require("react");
const { View } = require("react-native");

/**
 * Mock for react-native-reanimated-skeleton so tests don't need Reanimated native module.
 * Renders children when isLoading is false; when true, renders a simple placeholder View.
 */
function Skeleton({ children, isLoading }) {
	if (isLoading) {
		return <View testID="skeleton-placeholder" />;
	}
	return <>{children}</>;
}

module.exports = Skeleton;
