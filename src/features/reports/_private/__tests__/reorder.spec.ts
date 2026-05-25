/** @format */

import { describe, expect, it } from 'vitest';
import { moveItem } from '../reorder';

describe('moveItem', () => {
	it('moves an item to the requested position', () => {
		expect(moveItem(['name', 'email', 'status'], 0, 2)).toEqual(['email', 'status', 'name']);
	});

	it('keeps the list unchanged for invalid indexes', () => {
		const fields = ['name', 'email'];
		expect(moveItem(fields, -1, 1)).toBe(fields);
		expect(moveItem(fields, 0, 5)).toBe(fields);
	});
});
