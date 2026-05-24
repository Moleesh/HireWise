/** @format */

import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import CountUp from '../../CountUp';

describe('CountUp', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('starts at 0 and animates toward the target value', () => {
		render(<CountUp value={42} duration={800} />);
		const span = screen.getByText('0');
		expect(span).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(screen.getByText('42')).toBeInTheDocument();
	});

	it('renders suffix after the number', () => {
		render(<CountUp value={10} suffix="k" duration={800} />);
		act(() => {
			vi.advanceTimersByTime(1000);
		});
		expect(screen.getByText('10k')).toBeInTheDocument();
	});

	it('renders zero correctly', () => {
		render(<CountUp value={0} />);
		expect(screen.getByText('0')).toBeInTheDocument();
	});
});
