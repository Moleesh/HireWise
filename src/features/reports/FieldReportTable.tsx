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
		<div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)]">
			<table className="min-w-full text-left text-sm">
				<thead className="bg-[var(--input-bg)] text-[var(--text-quaternary)]">
					<tr>
						<th className="px-3 py-2 font-medium">Move</th>
						<th className="px-3 py-2 font-medium">Use</th>
						<th className="px-3 py-2 font-medium">Column</th>
						<th className="px-3 py-2 font-medium">Key</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-[var(--border-subtle)]">
					{fields.map((field) => (
						<tr
							key={field.key}
							draggable
							onDragStart={(event) =>
								event.dataTransfer.setData('fieldKey', field.key)
							}
							onDragOver={(event) => event.preventDefault()}
							onDrop={(event) => {
								event.preventDefault();
								onReorderField(event.dataTransfer.getData('fieldKey'), field.key);
							}}
							className="text-[var(--text-secondary)] cursor-grab active:cursor-grabbing"
						>
							<td className="px-3 py-2 text-[var(--text-quaternary)]">
								<GripVertical size={16} aria-label={`Move ${field.label}`} />
							</td>
							<td className="px-3 py-2">
								<input
									type="checkbox"
									checked={selectedFieldKeys.includes(field.key)}
									onChange={() => onToggleField(field.key)}
									className="accent-[var(--accent-bg)]"
								/>
							</td>
							<td className="px-3 py-2 font-medium">{field.label}</td>
							<td className="px-3 py-2 text-[var(--text-quaternary)]">{field.key}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</FrostedCard>
);

export default FieldReportTable;
