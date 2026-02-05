import { dateFormatter } from "./dateFormatter";

describe("dateFormatter", () => {
	it("formats DD/MM/YYYY to 'DD Mon YYYY'", () => {
		expect(dateFormatter("31/01/2003")).toBe("31 Jan 2003");
	});

	it("formats single-digit day and month with leading zero", () => {
		expect(dateFormatter("05/03/2000")).toBe("05 Mar 2000");
	});

	it("formats different months correctly", () => {
		expect(dateFormatter("15/12/2024")).toBe("15 Dec 2024");
		expect(dateFormatter("01/07/1999")).toBe("01 Jul 1999");
	});

	it("returns the original string when input has no slashes", () => {
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
