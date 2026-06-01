/** @format */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressBar from '../../ProgressBar';

describe('ProgressBar', () => {
    it('renders the label', () => {
        render(<ProgressBar label="Progress" value={50} />);
        expect(screen.getByText('Progress')).toBeInTheDocument();
    });

    it('renders the percentage', () => {
        render(<ProgressBar label="Test" value={75} />);
        expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('hides percentage when showPercent is false', () => {
        render(<ProgressBar label="Test" value={75} showPercent={false} />);
        expect(screen.queryByText('75%')).not.toBeInTheDocument();
    });

    it('clamps value to 0-100', () => {
        const { container } = render(<ProgressBar label="Test" value={150} />);
        const fill = container.querySelector('[style*="width"]');
        expect(fill).toHaveStyle({ width: '100%' });
    });
});
