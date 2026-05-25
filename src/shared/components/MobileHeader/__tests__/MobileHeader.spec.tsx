/** @format */

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import MobileHeader from '../../MobileHeader';

describe('MobileHeader', () => {
	it('renders brand and current page breadcrumb', () => {
		render(<MobileHeader currentPage="reports" />);
		expect(screen.getByText('Hire')).toBeInTheDocument();
		expect(screen.getByText('Wise')).toBeInTheDocument();
		expect(screen.getByText('Reports')).toBeInTheDocument();
	});
});
