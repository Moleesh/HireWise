/** @format */

import { Download } from 'lucide-react';
import type { Candidate, CandidateStatus } from '../../shared/types';

const statuses: CandidateStatus[] = ['available', 'in-progress', 'offered', 'hired', 'rejected'];

type CandidateProfileActionsProps = {
	candidate: Candidate;
	onClose: () => void;
	onStatusUpdate: (id: string, status: CandidateStatus) => void;
	onDownload: (candidate: Candidate) => void;
};

/** CandidateProfileActions - Status update and footer actions. */
const CandidateProfileActions = ({
	candidate,
	onClose,
	onStatusUpdate,
	onDownload,
}: CandidateProfileActionsProps) => (
	<>
		<div className="pt-4 border-t border-[var(--border-subtle)]">
			<label className="text-xs font-medium text-[var(--text-quaternary)] uppercase tracking-wider mb-2 block">
				Update Status
			</label>
			<div className="flex gap-2 flex-wrap">
				{statuses.map((status) => (
					<button
						key={status}
						onClick={() => onStatusUpdate(candidate.id, status)}
						className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
							candidate.status === status
								? 'bg-[var(--accent-bg)] text-white'
								: 'bg-[var(--btn-ghost-bg)] text-[var(--text-tertiary)] hover:bg-[var(--btn-ghost-hover)]'
						}`}
					>
						{status === 'in-progress'
							? 'In Progress'
							: status.charAt(0).toUpperCase() + status.slice(1)}
					</button>
				))}
			</div>
		</div>
		<div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
			<button
				onClick={() => onDownload(candidate)}
				className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all"
			>
				<Download size={14} /> Download
			</button>
			<button
				onClick={onClose}
				className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white transition-all"
			>
				Close
			</button>
		</div>
	</>
);

export default CandidateProfileActions;
