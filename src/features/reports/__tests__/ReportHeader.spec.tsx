/** @format */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ReportHeader from '../ReportHeader';

const reports = [
    {
        id: 'report-1',
        name: 'Default Pipeline',
        fieldKeys: ['name'],
        candidateIds: ['candidate-1'],
        createdAt: 'now',
    },
];

const renderHeader = (overrides = {}) =>
    render(
        <ReportHeader
            canExport={true}
            defaultReportId=""
            onConfigure={() => {}}
            onExport={() => {}}
            onLoadReport={() => {}}
            onSetDefaultReport={() => {}}
            reports={[]}
            {...overrides}
        />,
    );

describe('ReportHeader', () => {
    it('renders export center copy and actions', () => {
        renderHeader();
        expect(screen.getByText('Export Center')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Configure/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Export CSV/i })).toBeInTheDocument();
    });

    it('calls configure and export handlers', async () => {
        const onConfigure = vi.fn();
        const onExport = vi.fn();
        renderHeader({ onConfigure, onExport });
        await userEvent.click(screen.getByRole('button', { name: /Configure/i }));
        await userEvent.click(screen.getByRole('button', { name: /Export CSV/i }));
        expect(onConfigure).toHaveBeenCalledOnce();
        expect(onExport).toHaveBeenCalledOnce();
    });

    it('loads and sets a saved report as default', async () => {
        const onLoadReport = vi.fn();
        const onSetDefaultReport = vi.fn();
        renderHeader({ onLoadReport, onSetDefaultReport, reports });
        await userEvent.selectOptions(screen.getByRole('combobox'), 'report-1');
        await userEvent.click(screen.getByTitle('Set selected report as default'));
        expect(onLoadReport).toHaveBeenCalledWith(reports[0]);
        expect(onSetDefaultReport).toHaveBeenCalledWith('report-1');
    });
});
