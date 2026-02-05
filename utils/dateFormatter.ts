/**
 * Formats a date string in DD/MM/YYYY to "DD Mon YYYY" (e.g. "31/01/2003" → "31 Jan 2003").
 * Date.parse() does not reliably handle DD/MM/YYYY, so we parse it explicitly.
 */
export const dateFormatter = (value: string): string => {
	const [dayPart, monthPart, yearPart] = value.split("/");
	if (!dayPart || !monthPart || !yearPart) {
		return value;
	}
	// new Date(year, monthIndex, day): month is 0-indexed
	const date = new Date(
		Number.parseInt(yearPart, 10),
		Number.parseInt(monthPart, 10) - 1,
		Number.parseInt(dayPart, 10),
	);
	if (Number.isNaN(date.getTime())) {
		return value;
	}
	const day = date.toLocaleString("default", { day: "2-digit" });
	const month = date.toLocaleString("default", { month: "short" });
	const year = date.toLocaleString("default", { year: "numeric" });

	return `${day} ${month} ${year}`;
};
