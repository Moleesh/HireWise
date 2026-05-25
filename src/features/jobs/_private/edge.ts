/** @format */

import { SUPABASE_ANON_KEY, SUPABASE_URL } from '../../../shared/lib/config';

export const callEdge = async <T>(name: string, body: unknown): Promise<T | null> => {
	try {
		const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
			},
			body: JSON.stringify(body),
		});
		return (await res.json()) as T;
	} catch {
		return null;
	}
};
