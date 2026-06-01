/** @format */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Modal from '../../Modal';

describe('Modal', () => {
    it('renders when open', () => {
        render(
            <Modal open={true} onClose={() => {}} title="Test Modal">
                Modal content
            </Modal>,
        );
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(
            <Modal open={false} onClose={() => {}} title="Test Modal">
                Hidden content
            </Modal>,
        );
        expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', async () => {
        const onClose = vi.fn();
        render(
            <Modal open={true} onClose={onClose} title="Test Modal">
                Content
            </Modal>,
        );
        const closeBtn = screen.getByLabelText('Close');
        await userEvent.click(closeBtn);
        expect(onClose).toHaveBeenCalledOnce();
    });
});
