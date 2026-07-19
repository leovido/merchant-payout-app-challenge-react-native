import { IbanParseError, normalizeIban, parseIban } from "./iban";

describe("normalizeIban", () => {
	it("removes spaces and upper-cases", () => {
		expect(normalizeIban("gb82 west 1234 5698 7654 32")).toBe(
			"GB82WEST12345698765432",
		);
	});
});

describe("parseIban", () => {
	it("parses valid IBANs into their structural parts", () => {
		const result = parseIban("GB82WEST12345698765432");

		expect(result.ok).toBe(true);
		if (!result.ok) {
			throw new Error("expected parse to succeed");
		}
		expect(result.iban.value).toBe("GB82WEST12345698765432");
		expect(result.iban.countryCode).toBe("GB");
		expect(result.iban.checkDigits).toBe("82");
		expect(result.iban.bban).toBe("WEST12345698765432");
		expect(result.iban.formatted).toBe("GB82 WEST 1234 5698 7654 32");
	});

	it("parses valid IBANs from various countries", () => {
		const ibans = [
			"DE89370400440532013000",
			"FR1420041010050500013M02606",
			"NL91ABNA0417164300",
			"ES9121000418450200051332",
		];
		for (const iban of ibans) {
			expect(parseIban(iban).ok).toBe(true);
		}
	});

	it("parses input entered with spaces and lower case", () => {
		const result = parseIban("gb82 west 1234 5698 7654 32");
		expect(result.ok).toBe(true);
		if (result.ok) {
			expect(result.iban.value).toBe("GB82WEST12345698765432");
		}
	});

	const failureCases: ReadonlyArray<{
		readonly name: string;
		readonly input: string;
		readonly error: IbanParseError;
	}> = [
		{ name: "empty input", input: "   ", error: IbanParseError.Empty },
		{
			name: "malformed structure",
			input: "GBWEST12345698765432",
			error: IbanParseError.InvalidStructure,
		},
		{
			name: "non-alphanumeric",
			input: "GB82WEST1234569876543!",
			error: IbanParseError.InvalidStructure,
		},
		{
			name: "unknown country",
			input: "ZZ8212345698765432123456",
			error: IbanParseError.UnknownCountry,
		},
		{
			name: "too short for country",
			input: "GB82WEST1234569876543",
			error: IbanParseError.InvalidLength,
		},
		{
			name: "too long for country",
			input: "GB82WEST123456987654321",
			error: IbanParseError.InvalidLength,
		},
		{
			name: "bad checksum",
			input: "GB82WEST12345698765433",
			error: IbanParseError.InvalidChecksum,
		},
	];

	it.each(failureCases)("rejects $name with error $error", ({
		input,
		error,
	}) => {
		const result = parseIban(input);
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.error).toBe(error);
		}
	});
});
