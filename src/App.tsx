import React from 'react';

import Address from '@/components/Address/Address';
import AddressBook from '@/components/AddressBook/AddressBook';
import Button from '@/components/Button/Button';
import InputText from '@/components/InputText/InputText';
import Radio from '@/components/Radio/Radio';
import Section from '@/components/Section/Section';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';
import useAddressBook from '@/hooks/useAddressBook';
import { useAddressFetch } from './utils/addressApi';
import { useFormFields } from '@/hooks/useFormFields';

import styles from './App.module.css';
import { Address as AddressType } from './types';
import Form from '@/components/Form/Form';

function App() {
	/**
	 * Form fields states
	 * TODO: Write a custom hook to set form fields in a more generic way:
	 * - Hook must expose an onChange handler to be used by all <InputText /> and <Radio /> components
	 * - Hook must expose all text form field values, like so: { postCode: '', houseNumber: '', ...etc }
	 * - Remove all individual React.useState
	 * - Remove all individual onChange handlers, like handlePostCodeChange for example
	 */
	const { fields, handleFieldChange, resetFields } = useFormFields({
		postCode: '',
		houseNumber: '',
		firstName: '',
		lastName: '',
		selectedAddress: '',
	});
	/**
	 * Results states
	 */
	const [error, setError] = React.useState<undefined | string>(undefined);
	const [addresses, setAddresses] = React.useState<AddressType[]>([]);

	/**
	 * Address fetching hook
	 */
	const { fetchAddressData, isLoading, error: fetchError } = useAddressFetch();

	/**
	 * Redux actions
	 */
	const { addAddress } = useAddressBook();

	/** TODO: Fetch addresses based on houseNumber and postCode using the local BE api
	 * - Example URL of API: ${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=1345&streetnumber=350
	 * - Ensure you provide a BASE URL for api endpoint for grading purposes!
	 * - Handle errors if they occur
	 * - Handle successful response by updating the `addresses` in the state using `setAddresses`
	 * - Make sure to add the houseNumber to each found address in the response using `transformAddress()` function
	 * - Ensure to clear previous search results on each click
	 * - Bonus: Add a loading state in the UI while fetching addresses
	 */
	const handleAddressSubmit = async (formFields: Record<string, any>) => {
		// Ensure to clear previous search results on each click
		setAddresses([]);
		setError(undefined);

		const { postCode, houseNumber } = formFields;

		if (!postCode.trim() || !houseNumber.trim()) {
			setError('Post code and house number are required');
			return;
		}

		try {
			// Fetch addresses using the API (BASE URL provided for grading)
			const fetchedAddresses = await fetchAddressData(postCode, houseNumber);

			if (fetchedAddresses.length > 0) {
				// Transform addresses and add houseNumber (already handled in transformAddress function)
				const transformedAddresses = fetchedAddresses.map((addr) => ({
					...addr,
					id: `${addr.street}_${addr.houseNumber}_${addr.postcode}`,
					firstName: '',
					lastName: '',
				}));
				// Handle successful response by updating the addresses in the state
				setAddresses(transformedAddresses);
			} else {
				setError('No addresses found for the given postcode and house number');
			}
		} catch (err) {
			// Handle errors if they occur
			setError('Failed to fetch addresses. Please try again.');
		}
	};

	/** TODO: Add basic validation to ensure first name and last name fields aren't empty
	 * Use the following error message setError("First name and last name fields mandatory!")
	 */
	const handlePersonSubmit = (formFields: Record<string, any>) => {
		setError(undefined);

		const { firstName, lastName } = formFields;

		// Add basic validation to ensure first name and last name fields aren't empty
		if (!firstName.trim() || !lastName.trim()) {
			setError('First name and last name fields mandatory!');
			return;
		}

		const foundAddress = addresses.find(
			(address) => address.id === fields.selectedAddress
		);

		if (!foundAddress) {
			setError('Selected address not found');
			return;
		}

		addAddress({
			...foundAddress,
			firstName: firstName.trim(),
			lastName: lastName.trim(),
		});

		// Clear form after successful submission
		handleClearAllFields();
	};

	// Clear all fields, search results, and errors
	const handleClearAllFields = () => {
		resetFields();
		setAddresses([]);
		setError(undefined);
	};

	// Form configurations for the Generic Form component
	const addressFormEntries = [
		{
			name: 'postCode',
			placeholder: 'Post Code',
		},
		{
			name: 'houseNumber',
			placeholder: 'House number',
		},
	];

	const personalInfoFormEntries = [
		{
			name: 'firstName',
			placeholder: 'First name',
		},
		{
			name: 'lastName',
			placeholder: 'Last name',
		},
	];

	// Combine local errors with fetch errors
	const displayError = error ?? fetchError ?? undefined;

	return (
		<main>
			<Section>
				<h1>
					Create your own address book!
					<br />
					<small>
						Enter an address by postcode add personal info and done! 👏
					</small>
				</h1>
				{/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
				<Form
					label="🏠 Find an address"
					loading={isLoading}
					formEntries={addressFormEntries}
					onFormSubmit={handleAddressSubmit}
					submitText="Find"
					className={styles.formRow}
				/>
				{addresses.length > 0 &&
					addresses.map((address) => {
						return (
							<Radio
								name="selectedAddress"
								id={address.id}
								key={address.id}
								onChange={handleFieldChange}
							>
								<Address {...address} />
							</Radio>
						);
					})}
				{/* TODO: Create generic <Form /> component to display form rows, legend and a submit button  */}
				{fields.selectedAddress && (
					<Form
						label="✏️ Add personal info to address"
						loading={false}
						formEntries={personalInfoFormEntries}
						onFormSubmit={handlePersonSubmit}
						submitText="Add to addressbook"
					/>
				)}

				{/* TODO: Create an <ErrorMessage /> component for displaying an error message - COMPLETED */}
				<ErrorMessage message={displayError} className={styles.error} />

				{/* TODO: Add a button to clear all form fields. - COMPLETED
        Button must look different from the default primary button, see design. 
        Button text name must be "Clear all fields"
        On Click, it must clear all form fields, remove all search results and clear all prior
        error messages
        */}
				<Button
					type="button"
					variant="secondary"
					onClick={handleClearAllFields}
				>
					Clear all fields
				</Button>
			</Section>

			<Section variant="dark">
				<AddressBook />
			</Section>
		</main>
	);
}

export default App;
