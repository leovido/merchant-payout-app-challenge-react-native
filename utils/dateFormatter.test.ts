import { dateFormatter } from "./dateFormatter";

describe("dateFormatter", () => {
	it("formats DD/MM/YYYY to numeric 'DD MM YYYY'", () => {
		expect(dateFormatter("31/01/2003")).toBe("31 01 2003");
	});

	it("formats single-digit day and month with leading zero", () => {
		expect(dateFormatter("05/03/2000")).toBe("05 03 2000");
	});

	it("formats different months correctly", () => {
		expect(dateFormatter("15/12/2024")).toBe("15 12 2024");
		expect(dateFormatter("01/07/1999")).toBe("01 07 1999");
	});

	it("formats ISO date (YYYY-MM-DD) to 'DD MM YYYY'", () => {
		expect(dateFormatter("2026-02-12")).toBe("12 02 2026");
	});

	it("returns the original string when input has no slashes or ISO pattern", () => {
		expect(dateFormatter("31012003")).toBe("31012003");
	});

	it("returns the original string when input has too few segments", () => {
		expect(dateFormatter("31/01")).toBe("31/01");
		expect(dateFormatter("31")).toBe("31");
	});

	it("returns the original string when input is empty", () => {
		expect(dateFormatter("")).toBe("");
	});

	it("returns the original string when segments are non-numeric", () => {
		expect(dateFormatter("ab/cd/efgh")).toBe("ab/cd/efgh");
	});
});
