/** @format */

import { Download, SlidersHorizontal, Star } from 'lucide-react';
import type { SavedReport } from './_private/types';

type ReportHeaderProps = {
    canExport: boolean;
    defaultReportId: string;
    onConfigure: () => void;
    onExport: () => void;
    onLoadReport: (report: SavedReport) => void;
    onSetDefaultReport: (reportId: string) => void;
    reports: SavedReport[];
};

const ReportHeader = ({
    canExport,
    defaultReportId,
    onConfigure,
    onExport,
    onLoadReport,
    onSetDefaultReport,
    reports,
}: ReportHeaderProps) => {
    const selectedReport = reports.find((report) => report.id === defaultReportId) ?? reports[0];
    return (
        <div className="mb-6 md:mb-8 rounded-3xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5 md:p-6 shadow-2xl shadow-black/5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <p className="hidden sm:block text-xs font-semibold uppercase tracking-[0.22em] text-[var(--accent-text)] mb-2">
                        Export Center
                    </p>
                    <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                        Reports
                    </h1>
                    <p className="hidden sm:block text-[var(--text-tertiary)] mt-2 text-sm md:text-base max-w-xl">
                        Review filtered candidates, choose columns, and export a clean CSV for
                        Excel.
                    </p>
                </div>
                <div className="flex flex-col gap-2 sm:items-stretch lg:items-end">
                    {reports.length > 0 && (
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 w-full sm:w-auto sm:min-w-[22rem]">
                            <div className="select-wrap">
                                <select
                                    value={selectedReport?.id ?? ''}
                                    onChange={(event) => {
                                        const report = reports.find(
                                            (item) => item.id === event.target.value,
                                        );
                                        if (report) onLoadReport(report);
                                    }}
                                    className="app-select min-w-0 w-full pr-10"
                                >
                                    {reports.map((report) => (
                                        <option key={report.id} value={report.id}>
                                            {report.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={() =>
                                    selectedReport && onSetDefaultReport(selectedReport.id)
                                }
                                className="hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--btn-ghost-bg)] hover:bg-[var(--btn-ghost-hover)] text-[var(--text-secondary)] font-semibold text-sm transition-all"
                                title="Set selected report as default"
                            >
                                <Star
                                    size={16}
                                    className={
                                        selectedReport?.id === defaultReportId
                                            ? 'fill-current text-yellow-400'
                                            : ''
                                    }
                                />
                            </button>
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full sm:w-auto">
                        <button
                            onClick={onConfigure}
                            className="hidden sm:flex h-10 items-center justify-center gap-2 px-4 rounded-xl bg-[var(--btn-ghost-bg)] hover:bg-[var(--btn-ghost-hover)] text-[var(--text-secondary)] font-semibold text-sm transition-all"
                        >
                            <SlidersHorizontal size={16} /> Configure
                        </button>
                        <button
                            onClick={onExport}
                            disabled={!canExport}
                            className="flex h-10 items-center justify-center gap-2 px-4 rounded-xl bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white font-medium text-sm transition-all shadow-lg shadow-[var(--accent-shadow)] disabled:opacity-50"
                        >
                            <Download size={16} /> Export CSV
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportHeader;
