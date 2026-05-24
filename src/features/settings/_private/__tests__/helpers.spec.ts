/** @format */

import { describe, it, expect } from 'vitest';
import { formatDate } from '../helpers';

describe('formatDate (settings)', () => {
	it('returns "Never" for null input', () => {
		expect(formatDate(null)).toBe('Never');
	});

	it('formats a valid date string', () => {
		const result = formatDate('2025-01-15T00:00:00Z');
		expect(result).toBeTruthy();
		expect(result).not.toBe('Never');
	});
});
