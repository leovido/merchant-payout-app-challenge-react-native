import { format, parse } from "date-fns";

export const dateFormatter = (value: string): string => {
	let date: Date;
	if (value.includes("/")) {
		date = parse(value, "dd/MM/yyyy", new Date());
	} else {
		date = parse(value, "yyyy-MM-dd", new Date());
	}
	if (Number.isNaN(date.getTime())) return value;
	return format(date, "dd MM yyyy");
};
