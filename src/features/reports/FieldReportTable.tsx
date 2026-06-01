/** @format */

import { GripVertical } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import type { ReportField } from './_private/types';

type FieldReportTableProps = {
    fields: ReportField[];
    selectedFieldKeys: string[];
    onReorderField: (fromKey: string, toKey: string) => void;
    onToggleField: (fieldKey: string) => void;
};

/** FieldReportTable - Column report showing available export fields. */
const FieldReportTable = ({
    fields,
    selectedFieldKeys,
    onReorderField,
    onToggleField,
}: FieldReportTableProps) => (
    <FrostedCard className="p-4 md:p-5" hover={false}>
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
            Field Column Report
        </h2>
        <p className="text-xs text-[var(--text-tertiary)] mb-4">
            Choose export columns and drag rows to set their order.
        </p>
        <div className="max-h-[24rem] overflow-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--input-bg)] shadow-inner shadow-black/10">
            <table className="min-w-full text-left text-sm">
                <thead className="sticky top-0 z-10 bg-[var(--card-bg)] text-[var(--text-quaternary)]">
                    <tr>
                        <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
                            Move
                        </th>
                        <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
                            Use
                        </th>
                        <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
                            Column
                        </th>
                        <th className="px-3 py-2.5 text-xs font-semibold uppercase tracking-wider">
                            Key
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                    {fields.map((field) => {
                        const selected = selectedFieldKeys.includes(field.key);
                        return (
                            <tr
                                key={field.key}
                                draggable
                                onDragStart={(event) =>
                                    event.dataTransfer.setData('fieldKey', field.key)
                                }
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={(event) => {
                                    event.preventDefault();
                                    onReorderField(
                                        event.dataTransfer.getData('fieldKey'),
                                        field.key,
                                    );
                                }}
                                className={`cursor-grab active:cursor-grabbing transition-colors ${
                                    selected
                                        ? 'bg-[var(--accent-bg-subtle)]/60 text-[var(--text-primary)]'
                                        : 'text-[var(--text-secondary)] hover:bg-white/[0.03]'
                                }`}
                            >
                                <td className="px-3 py-2.5">
                                    <div className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[var(--btn-ghost-bg)] text-[var(--text-quaternary)]">
                                        <GripVertical
                                            size={14}
                                            aria-label={`Move ${field.label}`}
                                        />
                                    </div>
                                </td>
                                <td className="px-3 py-2.5">
                                    <input
                                        type="checkbox"
                                        checked={selected}
                                        onChange={() => onToggleField(field.key)}
                                        className="accent-[var(--accent-bg)]"
                                    />
                                </td>
                                <td className="px-3 py-2.5 font-medium">{field.label}</td>
                                <td className="px-3 py-2.5">
                                    <span className="inline-flex items-center rounded-md bg-[var(--btn-ghost-bg)] px-2 py-1 text-xs font-medium text-[var(--text-quaternary)]">
                                        {field.key}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    </FrostedCard>
);

export default FieldReportTable;
