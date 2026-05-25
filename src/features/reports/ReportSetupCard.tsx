/** @format */

import { Save } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';

type ReportSetupCardProps = {
	canSave: boolean;
	name: string;
	onNameChange: (name: string) => void;
	onSave: () => void;
	saved: boolean;
};

const ReportSetupCard = ({ canSave, name, onNameChange, onSave, saved }: ReportSetupCardProps) => (
	<FrostedCard className="p-4 md:p-5" hover={false}>
		<div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
			<div>
				<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider">
					Report Name
				</label>
				<input
					value={name}
					onChange={(event) => onNameChange(event.target.value)}
					className="mt-2 w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
				/>
			</div>
			<div className="flex items-end">
				<button
					onClick={onSave}
					disabled={!canSave}
					className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] text-sm font-medium transition-all disabled:opacity-50"
				>
					<Save size={16} /> {saved ? 'Saved' : 'Save Report'}
				</button>
			</div>
		</div>
		<p className="mt-3 text-xs text-[var(--text-quaternary)]">
			Saves selected candidates, or the visible filtered table when none are checked.
		</p>
	</FrostedCard>
);

export default ReportSetupCard;
