/** @format */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatusBadge from '../../StatusBadge';

describe('StatusBadge', () => {
  it('renders the status label', () => {
    render(<StatusBadge status="draft" />);
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('renders custom status labels like "In Progress"', () => {
    render(<StatusBadge status="in-progress" />);
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders a dot indicator', () => {
    const { container } = render(<StatusBadge status="published" />);
    const dot = container.querySelector('.rounded-full.w-1\\.5');
    expect(dot).toBeInTheDocument();
  });

  it('applies size classes correctly', () => {
    const { container } = render(<StatusBadge status="draft" size="md" />);
    const badge = container.querySelector('.text-sm');
    expect(badge).toBeInTheDocument();
  });

  it('falls back to capitalized status for unknown statuses', () => {
    render(<StatusBadge status="custom-status" />);
    expect(screen.getByText('Custom-status')).toBeInTheDocument();
  });
});
