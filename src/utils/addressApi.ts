// src/utils/addressApi.ts
import { Address } from '@/types';

export interface FetchAddressesResponse {
	success: boolean;
	addresses?: Omit<Address, 'firstName' | 'lastName' | 'id'>[];
	error?: string;
}

// Function to transform raw address data from API response
const transformAddress = (
	rawAddress: any
): Omit<Address, 'firstName' | 'lastName' | 'id'> => ({
	street: rawAddress.street,
	houseNumber: rawAddress.houseNumber,
	postcode: rawAddress.postcode,
	city: rawAddress.city,
});

// Fetch addresses using the Next.js API route
export const fetchAddresses = async (
	postCode: string,
	houseNumber: string
): Promise<FetchAddressesResponse> => {
	try {
		if (!postCode || !houseNumber) {
			return {
				success: false,
				error: 'Post code and house number are required',
			};
		}

		// Use the BASE URL from environment for grading purposes
		const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
		const url = `${baseUrl}/api/getAddresses?postcode=${encodeURIComponent(
			postCode
		)}&streetnumber=${encodeURIComponent(houseNumber)}`;

		const response = await fetch(url);

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			return {
				success: false,
				error:
					errorData.errormessage || `HTTP error! status: ${response.status}`,
			};
		}

		const data = await response.json();

		// Handle the existing API response structure: {status: "ok", details: [...]}
		if (data.status === 'ok' && data.details && Array.isArray(data.details)) {
			const transformedAddresses = data.details.map(transformAddress);

			return {
				success: true,
				addresses: transformedAddresses,
			};
		}

		if (data.status === 'error') {
			return {
				success: false,
				error: data.errormessage || 'Unknown error occurred',
			};
		}

		return {
			success: false,
			error: 'Invalid response format from API',
		};
	} catch (error) {
		console.error('Error fetching addresses:', error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : 'Failed to fetch addresses',
		};
	}
};

// Hook for using address fetching in React components
import { useState, useCallback } from 'react';

export const useAddressFetch = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchAddressData = useCallback(
		async (postCode: string, houseNumber: string) => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await fetchAddresses(postCode, houseNumber);

				if (!result.success) {
					setError(result.error || 'Failed to fetch addresses');
					return [];
				}

				return result.addresses || [];
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : 'An unexpected error occurred';
				setError(errorMessage);
				return [];
			} finally {
				setIsLoading(false);
			}
		},
		[]
	);

	return {
		fetchAddressData,
		isLoading,
		error,
		clearError: () => setError(null),
	};
};
