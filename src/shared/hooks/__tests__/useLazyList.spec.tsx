/** @format */

import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import useLazyList from '../useLazyList';

describe('useLazyList', () => {
    it('shows the initial page and loads more on demand', () => {
        const { result } = renderHook(() =>
            useLazyList([1, 2, 3, 4, 5], { initialCount: 2, increment: 2 }),
        );
        expect(result.current.visibleItems).toEqual([1, 2]);
        expect(result.current.remainingCount).toBe(3);

        act(() => result.current.loadMore());
        expect(result.current.visibleItems).toEqual([1, 2, 3, 4]);
    });

    it('resets visible rows when resetKey changes', async () => {
        const { result, rerender } = renderHook(
            ({ resetKey }) =>
                useLazyList([1, 2, 3, 4], { initialCount: 2, increment: 2, resetKey }),
            { initialProps: { resetKey: 'a' } },
        );
        act(() => result.current.loadMore());
        expect(result.current.visibleItems).toEqual([1, 2, 3, 4]);

        rerender({ resetKey: 'b' });
        await act(async () => Promise.resolve());
        expect(result.current.visibleItems).toEqual([1, 2]);
    });
});
