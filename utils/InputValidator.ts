export interface InputValidator {
	validateInput: (text: string, regex?: RegExp) => boolean;
}

export class IBANInputValidator implements InputValidator {
	validateInput(text: string, regex?: RegExp) {
		const isValidText = text.length > 0 && !regex?.test(text);

		return isValidText;
	}
}
