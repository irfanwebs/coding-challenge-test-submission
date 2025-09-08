import type { NextApiRequest, NextApiResponse } from "next";

import generateMockAddresses from "../../src/utils/generateMockAddresses";

export default async function handle(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const {
		query: { postcode, streetnumber },
	} = req;

	if (!postcode || !streetnumber) {
		return res.status(400).send({
      status: "error",
			// DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
		});
	}

	if (postcode.length < 4) {
		return res.status(400).send({
      status: "error",
			// DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be at least 4 digits!",
		});
	}

	/** TODO: Implement the validation logic to ensure input value
	 *  is all digits and non negative - COMPLETED
	 */
	const isStrictlyNumeric = (value: string) => {
		// Check if value contains only digits and represents a non-negative number
		const numericRegex = /^\d+$/;
		return numericRegex.test(value) && parseInt(value, 10) >= 0;
	};

	/** TODO: Refactor the code below so there is no duplication of logic for postCode/streetNumber digit checks. - COMPLETED */
	// Helper function to validate and handle numeric field errors
	const validateNumericField = (
		value: string | string[],
		fieldName: string
	) => {
		const stringValue = Array.isArray(value) ? value[0] : value;
		if (!isStrictlyNumeric(stringValue)) {
			return res.status(400).send({
				status: 'error',
				errormessage: `${fieldName} must be all digits and non negative!`,
			});
		}
		return null; // Valid
	};

	// Validate postcode using shared logic
	if (validateNumericField(postcode, 'Postcode')) return;

	// Validate street number using shared logic
	if (validateNumericField(streetnumber, 'Street Number')) return;

	const mockAddresses = generateMockAddresses(
		postcode as string,
		streetnumber as string
	);
	if (mockAddresses) {
		const timeout = (ms: number) => {
			return new Promise((resolve) => setTimeout(resolve, ms));
		};

		// delay the response by 500ms - for loading status check
		await timeout(500);
		return res.status(200).json({
      status: "ok",
			details: mockAddresses,
		});
	}

	return res.status(404).json({
    status: "error",
		// DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
	});
}
