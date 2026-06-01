/** @format */

/**
 * Deep snake_case <-> camelCase key conversion for Supabase rows / payloads.
 *
 * The wrapper in `./supabase.ts` uses this so the entire application can
 * keep camelCase types while the database stores snake_case columns.
 */

const toCamelKey = (key: string): string =>
    key.includes('_') ? key.replace(/_([a-z0-9])/gi, (_, c: string) => c.toUpperCase()) : key;

const toSnakeKey = (key: string): string =>
    /[A-Z]/.test(key) ? key.replace(/[A-Z]/g, (c) => '_' + c.toLowerCase()) : key;

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && v !== null && (v as object).constructor === Object;

const transformKeys = (value: unknown, convert: (k: string) => string): unknown => {
    if (Array.isArray(value)) return value.map((v) => transformKeys(v, convert));
    if (isPlainObject(value)) {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(value)) out[convert(k)] = transformKeys(v, convert);
        return out;
    }
    return value;
};

/** keysToCamel - Deep convert snake_case object keys to camelCase. */
export const keysToCamel = <T = unknown>(value: unknown): T =>
    transformKeys(value, toCamelKey) as T;

/** keysToSnake - Deep convert camelCase object keys to snake_case. */
export const keysToSnake = <T = unknown>(value: unknown): T =>
    transformKeys(value, toSnakeKey) as T;

/** columnToSnake - Convert a single column-name argument (e.g. 'createdAt' -> 'created_at'). */
export const columnToSnake = (col: unknown): unknown =>
    typeof col === 'string' ? toSnakeKey(col) : col;
