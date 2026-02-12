/**
 * Formats a date string (DD/MM/YYYY or ISO) to numeric "DD MM YYYY" (e.g. "12 02 2026").
 */
export const dateFormatter = (value: string): string => {
	// Accept DD/MM/YYYY
	const slashParts = value.split("/");
	if (slashParts.length === 3) {
		const [dayPart, monthPart, yearPart] = slashParts;
		if (dayPart && monthPart && yearPart) {
			const date = new Date(
				Number.parseInt(yearPart, 10),
				Number.parseInt(monthPart, 10) - 1,
				Number.parseInt(dayPart, 10),
			);
			if (!Number.isNaN(date.getTime())) {
				const day = dayPart.padStart(2, "0");
				const month = monthPart.padStart(2, "0");
				return `${day} ${month} ${yearPart}`;
			}
		}
	}
	// Accept ISO (YYYY-MM-DD)
	const isoMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (isoMatch) {
		const [, y, m, d] = isoMatch;
		return `${d} ${m} ${y}`;
	}
	return value;
};
