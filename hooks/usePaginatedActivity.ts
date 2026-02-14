import { useEffect, useRef, useState } from "react";
import { useGetPaginatedActivityQuery } from "@/api/apiSlice";

export interface UsePaginatedActivityProps {
	limit: number;
}

export type UsePaginatedActivityReturn = ReturnType<
	typeof usePaginatedActivity
>;

export const usePaginatedActivity = ({
	limit = 15,
}: UsePaginatedActivityProps) => {
	const [cursor, setCursor] = useState<string>("");
	const lastFetchedCursorRef = useRef<string>("");

	const {
		data: activityData,
		isLoading: isActivityLoading,
		isFetching: isActivityFetching,
		refetch,
	} = useGetPaginatedActivityQuery(
		{ limit, cursor: cursor ?? undefined },
		{ refetchOnMountOrArgChange: true },
	);

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

	return {
		activityData,
		isActivityLoading,
		isActivityFetching,
		refetch,
		cursor,
		setCursor,
	};
};
