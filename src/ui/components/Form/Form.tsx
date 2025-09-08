import React, { FunctionComponent } from 'react';
import {
	InputHTMLAttributes,
	TextareaHTMLAttributes,
	SelectHTMLAttributes,
} from 'react';
import Button from '../Button/Button';
import InputText from '../InputText/InputText';
import { useFormFields } from '@/hooks/useFormFields';
import $ from './Form.module.css';

type InputExtraProps = Omit<
	InputHTMLAttributes<HTMLInputElement>,
	'name' | 'placeholder'
>;
type TextareaExtraProps = Omit<
	TextareaHTMLAttributes<HTMLTextAreaElement>,
	'name' | 'placeholder'
>;
type SelectExtraProps = Omit<
	SelectHTMLAttributes<HTMLSelectElement>,
	'name' | 'placeholder'
>;

// Union type to cover all possible form field extra properties
export type FormFieldExtraProps =
	| InputExtraProps
	| TextareaExtraProps
	| SelectExtraProps;

interface FormEntry {
	name: string;
	placeholder: string;
	// TODO: Defined a suitable type for extra props - COMPLETED
	// This type should cover all different of attribute types
	extraProps?: FormFieldExtraProps;
}

interface FormProps {
	label: string;
	loading: boolean;
	formEntries: FormEntry[];
	onFormSubmit: (fields: Record<string, any>) => void;
	submitText: string;
	className?: string;
}

const Form: FunctionComponent<FormProps> = ({
	label,
	loading,
	formEntries,
	onFormSubmit,
	submitText,
	className,
}) => {
	// Build initial values from formEntries
	const initialValues = formEntries.reduce((acc, entry) => {
		acc[entry.name] = entry.extraProps?.defaultValue ?? '';
		return acc;
	}, {} as Record<string, any>);

	const { fields, handleFieldChange } = useFormFields(initialValues);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onFormSubmit(fields);
	};

	return (
		<form onSubmit={handleSubmit}>
			<fieldset>
				<legend>{label}</legend>
				{formEntries.map(({ name, placeholder, extraProps }, index) => (
					<div key={`${name}-${index}`} className={className}>
						<InputText
							key={`${name}-${index}`}
							name={name}
							placeholder={placeholder}
							value={fields[name]}
							onChange={handleFieldChange}
							{...extraProps}
						/>
					</div>
				))}

				<Button loading={loading} type="submit">
					{submitText}
				</Button>
				{/* Example clear button, style as needed */}
				{/* <Button type="button" variant="secondary" onClick={resetFields}>
					Clear
				</Button> */}
			</fieldset>
		</form>
	);
};

export default Form;
