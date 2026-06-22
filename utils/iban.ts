/**
 * IBAN parsing following the "parse, don't validate" principle.
 *
 * Rather than answering a yes/no question about a raw string, `parseIban` turns
 * untrusted input into a branded `Iban` value (plus its structural parts). Once
 * you hold an `Iban`, the type system guarantees it already passed ISO 13616
 * structure, the per-country length table, and the ISO 7064 mod-97-10 checksum —
 * so downstream code never has to re-check it.
 */

const IBAN_COUNTRY_LENGTHS = {
	AD: 24,
	AE: 23,
	AL: 28,
	AT: 20,
	AZ: 28,
	BA: 20,
	BE: 16,
	BG: 22,
	BH: 22,
	BR: 29,
	BY: 28,
	CH: 21,
	CR: 22,
	CY: 28,
	CZ: 24,
	DE: 22,
	DK: 18,
	DO: 28,
	EE: 20,
	EG: 29,
	ES: 24,
	FI: 18,
	FO: 18,
	FR: 27,
	GB: 22,
	GE: 22,
	GI: 23,
	GL: 18,
	GR: 27,
	GT: 28,
	HR: 21,
	HU: 28,
	IE: 22,
	IL: 23,
	IQ: 23,
	IS: 26,
	IT: 27,
	JO: 30,
	KW: 30,
	KZ: 20,
	LB: 28,
	LC: 32,
	LI: 21,
	LT: 20,
	LU: 20,
	LV: 21,
	LY: 25,
	MC: 27,
	MD: 24,
	ME: 22,
	MK: 19,
	MR: 27,
	MT: 31,
	MU: 30,
	NL: 18,
	NO: 15,
	PK: 24,
	PL: 28,
	PS: 29,
	PT: 25,
	QA: 29,
	RO: 24,
	RS: 22,
	SA: 24,
	SC: 31,
	SD: 18,
	SE: 24,
	SI: 19,
	SK: 24,
	SM: 27,
	ST: 25,
	SV: 28,
	TL: 23,
	TN: 24,
	TR: 26,
	UA: 29,
	VA: 22,
	VG: 24,
	XK: 20,
} as const;

type IbanCountryCode = keyof typeof IBAN_COUNTRY_LENGTHS;

/** Structural pattern: 2-letter country, 2 check digits, then alphanumeric BBAN. */
const IBAN_STRUCTURE = /^[A-Z]{2}\d{2}[A-Z0-9]{1,30}$/;

declare const ibanBrand: unique symbol;

/**
 * A string proven to be a normalized, valid IBAN.
 *
 * The brand makes this type unconstructable outside this module: the only way
 * to obtain an `Iban` is through `parseIban`, so holding one is proof of validity.
 */
export type Iban = string & { readonly [ibanBrand]: true };

export const IbanParseError = {
	Empty: "empty",
	InvalidStructure: "invalid-structure",
	UnknownCountry: "unknown-country",
	InvalidLength: "invalid-length",
	InvalidChecksum: "invalid-checksum",
} as const;

export type IbanParseError =
	(typeof IbanParseError)[keyof typeof IbanParseError];

export const IBAN_ERROR_MESSAGES: Record<IbanParseError, string> = {
	[IbanParseError.Empty]: "Enter the destination IBAN.",
	[IbanParseError.InvalidStructure]:
		"This doesn't look like an IBAN. Check for typos or missing characters.",
	[IbanParseError.UnknownCountry]:
		"The country code at the start isn't a recognised IBAN country.",
	[IbanParseError.InvalidLength]:
		"This IBAN has the wrong number of characters for its country.",
	[IbanParseError.InvalidChecksum]:
		"The check digits don't match. Double-check the IBAN for a typo.",
};

export interface ParsedIban {
	/** Normalized (spaces removed, upper-cased), branded IBAN. */
	readonly value: Iban;
	readonly countryCode: IbanCountryCode;
	readonly checkDigits: string;
	/** Basic Bank Account Number — the country-specific remainder. */
	readonly bban: string;
	/** Display form grouped in blocks of four, e.g. "GB82 WEST 1234 5698 7654 32". */
	readonly formatted: string;
}

export type IbanParseResult =
	| { readonly ok: true; readonly iban: ParsedIban }
	| { readonly ok: false; readonly error: IbanParseError };

/**
 * Removes spaces and upper-cases the input so user-friendly formats
 * (e.g. "GB82 WEST 1234 5698 7654 32") can be parsed.
 */
export const normalizeIban = (input: string): string =>
	input.replace(/\s/g, "").toUpperCase();

/** Groups a normalized IBAN into blocks of four for display. */
const formatIban = (normalized: string): string =>
	normalized.replace(/(.{4})/g, "$1 ").trim();

/**
 * Computes the ISO 7064 mod-97-10 remainder for a normalized IBAN.
 * Moves the first four characters to the end, converts letters to digits
 * (A=10 … Z=35), then takes mod 97 in chunks to avoid BigInt/overflow.
 */
const mod97 = (iban: string): number => {
	const rearranged = iban.slice(4) + iban.slice(0, 4);

	const numeric = [...rearranged]
		.map((char) => {
			const code = char.codePointAt(0);
			if (code === undefined) {
				return undefined;
			}
			return code >= 65 && code <= 90 ? String(code - 55) : char;
		})
		.join("");

	return [...numeric].reduce(
		(remainder, digit) => (remainder * 10 + Number(digit)) % 97,
		0,
	);
};

/**
 * Parses untrusted input into a `ParsedIban`, or reports why it could not.
 *
 * This is the single entry point for turning a string into an `Iban`. Prefer
 * passing the parsed result around over re-checking the raw string.
 */
export const parseIban = (input: string): IbanParseResult => {
	const normalized = normalizeIban(input);

	if (normalized.length === 0) {
		return { ok: false, error: IbanParseError.Empty };
	}
	if (!IBAN_STRUCTURE.test(normalized)) {
		return { ok: false, error: IbanParseError.InvalidStructure };
	}

	const countryCode = normalized.slice(0, 2) as IbanCountryCode;
	const expectedLength = IBAN_COUNTRY_LENGTHS[countryCode];
	if (expectedLength === undefined) {
		return { ok: false, error: IbanParseError.UnknownCountry };
	}
	if (normalized.length !== expectedLength) {
		return { ok: false, error: IbanParseError.InvalidLength };
	}
	if (mod97(normalized) !== 1) {
		return { ok: false, error: IbanParseError.InvalidChecksum };
	}

	return {
		ok: true,
		iban: {
			value: normalized as Iban,
			countryCode,
			checkDigits: normalized.slice(2, 4),
			bban: normalized.slice(4),
			formatted: formatIban(normalized),
		},
	};
};
