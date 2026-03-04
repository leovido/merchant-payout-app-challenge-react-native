export enum FetchStatus {
	IDLE = "idle",
	LOADING = "loading",
	SUCCESS = "success",
	ERROR = "error",
}

export enum FetchEventType {
	FETCH = "FETCH",
	SUCCESS = "SUCCESS",
	ERROR = "ERROR",
}

export type FetchState<T> =
	| { status: FetchStatus.IDLE }
	| { status: FetchStatus.LOADING }
	| { status: FetchStatus.SUCCESS; data: T }
	| { status: FetchStatus.ERROR; error: Error };

export type FetchEvent<T> =
	| { type: FetchEventType.FETCH }
	| { type: FetchEventType.SUCCESS; data: T }
	| { type: FetchEventType.ERROR; error: Error };

export function transition<T>(
	current: FetchState<T>,
	event: FetchEvent<T>,
): FetchState<T> {
	switch (current.status) {
		case FetchStatus.IDLE:
		case FetchStatus.ERROR:
			if (event.type === FetchEventType.FETCH)
				return { status: FetchStatus.LOADING };
			return current;

		case FetchStatus.LOADING:
			if (event.type === FetchEventType.SUCCESS)
				return { status: FetchStatus.SUCCESS, data: event.data };
			if (event.type === FetchEventType.ERROR)
				return { status: FetchStatus.ERROR, error: event.error };
			return current;

		case FetchStatus.SUCCESS:
			if (event.type === FetchEventType.FETCH)
				return { status: FetchStatus.LOADING };
			return current;
	}
}

export type Pence = number;
