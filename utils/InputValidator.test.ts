import { IBAN_REGEX } from "@/constants";
import { IBANInputValidator } from "./InputValidator";

describe("IBANInputValidator", () => {
	const validator = new IBANInputValidator();

	describe("validateInput", () => {
		it.each([
			{ label: "no regex", text: "", regex: undefined },
			{ label: "with regex", text: "", regex: IBAN_REGEX },
		])("returns false for empty string ($label)", ({ text, regex }) => {
			expect(validator.validateInput(text, regex)).toBe(false);
		});

		it("returns true for non-empty string when no regex is provided", () => {
			expect(validator.validateInput("GB82WEST12345698765432")).toBe(true);
		});

		it("returns false when regex is provided and matches the text", () => {
			expect(
				validator.validateInput("GB82WEST12345698765432", IBAN_REGEX),
			).toBe(false);
		});

		it("returns true when regex is provided and does not match the text", () => {
			expect(validator.validateInput("invalid", IBAN_REGEX)).toBe(true);
		});
	});
});
