/** @format */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config';
import { keysToCamel, keysToSnake, columnToSnake } from './caseTransform';

/**
 * Supabase client with automatic snake_case <-> camelCase translation.
 *
 * - Returned rows are deep-converted to camelCase before reaching the app.
 * - Insert/update/upsert payloads are deep-converted to snake_case on the way out.
 * - Column-name string arguments to filter / ordering / select methods are
 *   converted to snake_case so app code can use camelCase throughout
 *   (e.g. `.eq('createdAt', x)`, `.order('updatedAt')`).
 */

const rawClient: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const COLUMN_ARG_FIRST = new Set([
	'eq',
	'neq',
	'gt',
	'gte',
	'lt',
	'lte',
	'like',
	'ilike',
	'is',
	'in',
	'contains',
	'containedBy',
	'rangeGt',
	'rangeGte',
	'rangeLt',
	'rangeLte',
	'rangeAdjacent',
	'overlaps',
	'textSearch',
	'match',
	'order',
	'select',
	'not',
	'filter',
	'csv',
]);

const PAYLOAD_METHODS = new Set(['insert', 'update', 'upsert']);

const isThenable = (v: unknown): v is PromiseLike<unknown> =>
	typeof v === 'object' && v !== null && typeof (v as { then?: unknown }).then === 'function';

const wrapBuilder = (builder: unknown): unknown => {
	if (builder === null || typeof builder !== 'object') return builder;
	return new Proxy(builder as object, {
		get(target, prop, receiver) {
			const val = Reflect.get(target, prop, receiver);
			if (prop === 'then' && typeof val === 'function') {
				// The query builder is thenable; intercept resolution to camelize data.
				return (
					onFulfilled?: (v: unknown) => unknown,
					onRejected?: (e: unknown) => unknown,
				) =>
					(val as (...a: unknown[]) => unknown).call(
						target,
						(result: unknown) => {
							if (
								result &&
								typeof result === 'object' &&
								'data' in (result as object)
							) {
								const r = result as { data: unknown; error: unknown };
								const camelData = r.error ? r.data : keysToCamel(r.data);
								return onFulfilled
									? onFulfilled({ ...(result as object), data: camelData })
									: { ...(result as object), data: camelData };
							}
							return onFulfilled ? onFulfilled(result) : result;
						},
						onRejected,
					);
			}
			if (typeof val !== 'function') return val;
			return (...args: unknown[]) => {
				let nextArgs = args;
				if (typeof prop === 'string') {
					if (PAYLOAD_METHODS.has(prop)) {
						// Map: first arg is row(s) — snake-case keys
						nextArgs = args.map((a, i) => (i === 0 ? keysToSnake(a) : a));
					} else if (prop === 'select') {
						// .select('col1, col2') — split & snake-case each
						nextArgs = args.map((a, i) => {
							if (i === 0 && typeof a === 'string' && a !== '*' && a !== '') {
								return a
									.split(',')
									.map((s) => s.trim())
									.map((s) => (s === '*' ? s : (columnToSnake(s) as string)))
									.join(',');
							}
							return a;
						});
					} else if (COLUMN_ARG_FIRST.has(prop)) {
						nextArgs = args.map((a, i) => (i === 0 ? columnToSnake(a) : a));
					}
				}
				const result = (val as (...a: unknown[]) => unknown).apply(target, nextArgs);
				if (isThenable(result)) return wrapBuilder(result);
				return wrapBuilder(result);
			};
		},
	});
};

/** supabase - case-aware client. Use camelCase column names and row keys. */
export const supabase = new Proxy(rawClient, {
	get(target, prop, receiver) {
		const val = Reflect.get(target, prop, receiver);
		if (prop === 'from' && typeof val === 'function') {
			return (...args: unknown[]) =>
				wrapBuilder((val as (...a: unknown[]) => unknown).apply(target, args));
		}
		if (prop === 'rpc' && typeof val === 'function') {
			return (name: string, params?: Record<string, unknown>) =>
				wrapBuilder(
					(val as (n: string, p?: unknown) => unknown).call(
						target,
						name,
						params ? keysToSnake(params) : undefined,
					),
				);
		}
		return val;
	},
}) as SupabaseClient;

/** rawSupabase - escape hatch when you need the un-transformed client. */
export const rawSupabase = rawClient;
