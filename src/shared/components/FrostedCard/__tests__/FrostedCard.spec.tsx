/** @format */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FrostedCard from '../../FrostedCard';

describe('FrostedCard', () => {
	it('renders children', () => {
		render(<FrostedCard>Card content</FrostedCard>);
		expect(screen.getByText('Card content')).toBeInTheDocument();
	});

	it('applies custom className', () => {
		const { container } = render(<FrostedCard className="custom-class">Content</FrostedCard>);
		const card = container.firstChild as HTMLElement;
		expect(card.classList.contains('custom-class')).toBe(true);
	});

	it('calls onClick when clicked', async () => {
		const handleClick = vi.fn();
		const { container } = render(<FrostedCard onClick={handleClick}>Clickable</FrostedCard>);
		const card = container.firstChild as HTMLElement;
		card.click();
		expect(handleClick).toHaveBeenCalledOnce();
	});
});
