/** @format */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ReportSetupCard from '../ReportSetupCard';

const renderCard = (overrides = {}) =>
    render(
        <ReportSetupCard
            canSave={true}
            name="Candidate Report"
            onNameChange={() => {}}
            onSave={() => {}}
            saved={false}
            {...overrides}
        />,
    );

describe('ReportSetupCard', () => {
    it('calls save when enabled', async () => {
        const onSave = vi.fn();
        renderCard({ onSave });
        await userEvent.click(screen.getByRole('button', { name: /Save Report/i }));
        expect(onSave).toHaveBeenCalledOnce();
    });

    it('disables save until the report has rows and fields', () => {
        renderCard({ canSave: false });
        expect(screen.getByRole('button', { name: /Save Report/i })).toBeDisabled();
    });

    it('shows saved feedback after saving', () => {
        renderCard({ saved: true });
        expect(screen.getByRole('button', { name: /Saved/i })).toBeInTheDocument();
    });
});
