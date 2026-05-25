/** @format */

import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import LoadMoreButton from '../../LoadMoreButton';

class MockIntersectionObserver {
	static instances: MockIntersectionObserver[] = [];
	callback: IntersectionObserverCallback;
	constructor(callback: IntersectionObserverCallback) {
		this.callback = callback;
		MockIntersectionObserver.instances.push(this);
	}
	observe = vi.fn();
	disconnect = vi.fn();
	unobserve = vi.fn();
	takeRecords = vi.fn(() => []);
	trigger(isIntersecting: boolean) {
		this.callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver);
	}
}

describe('LoadMoreButton', () => {
	afterEach(() => {
		MockIntersectionObserver.instances = [];
		vi.unstubAllGlobals();
	});

	it('loads more when the sentinel reaches the viewport', () => {
		vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
		const onClick = vi.fn();
		render(<LoadMoreButton remainingCount={4} onClick={onClick} />);
		MockIntersectionObserver.instances[0].trigger(true);
		expect(onClick).toHaveBeenCalledOnce();
	});
});
