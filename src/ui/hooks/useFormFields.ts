import { useState, ChangeEvent } from 'react';

/**
 * Custom hook to manage form fields generically.
 * @param initialValues Object with initial field values
 */
export function useFormFields<T extends Record<string, any>>(initialValues: T) {
	const [fields, setFields] = useState<T>(initialValues);

	// Generic change handler for input fields
	const handleFieldChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target;
		setFields((prev) => ({
			...prev,
			[name]:
				type === 'checkbox' && e.target instanceof HTMLInputElement
					? e.target.checked
					: value,
		}));
	};

	// Reset all fields to initial values
	const resetFields = () => setFields(initialValues);

	return {
		fields,
		setFields,
		handleFieldChange,
		resetFields,
	};
}
