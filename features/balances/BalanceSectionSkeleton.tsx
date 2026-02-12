import { Skeleton } from "moti/skeleton";
import { View } from "react-native";

// These are just some nice defaults
const SkeletonCommonProps = {
	colorMode: "dark",
	transition: {
		type: "timing",
		duration: 1000,
	},
} as const;

export function BalanceSectionSkeleton() {
	return (
		<View style={styles.container}>
			<Skeleton.Group show={true}>
				<Skeleton
					radius={"round"}
					height={50}
					width={50}
					{...SkeletonCommonProps}
				/>
				<View style={styles.content}>
					<Skeleton height={20} width={180} {...SkeletonCommonProps} />
					<View style={styles.spacer} />
					<Skeleton height={15} width={160} {...SkeletonCommonProps} />
				</View>
			</Skeleton.Group>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
});
