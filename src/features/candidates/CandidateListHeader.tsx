/** @format */

import type { ChangeEvent, RefObject } from 'react';
import { Upload } from 'lucide-react';

type CandidateListHeaderProps = {
	fileInputRef: RefObject<HTMLInputElement | null>;
	uploading: boolean;
	onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** CandidateListHeader - Page title and resume upload entry point. */
const CandidateListHeader = ({
	fileInputRef,
	uploading,
	onUpload,
}: CandidateListHeaderProps) => (
	<div className="flex items-center justify-between mb-6 md:mb-8">
		<div>
			<h1 className="text-xl md:text-2xl font-bold text-[var(--text-primary)]">
				Candidates
			</h1>
			<p className="text-[var(--text-tertiary)] mt-1 text-sm">
				Manage your candidate pipeline
			</p>
		</div>
		<div>
			<input
				ref={fileInputRef}
				type="file"
				accept=".pdf,.doc,.docx,.txt"
				multiple
				onChange={onUpload}
				className="hidden"
			/>
			<button
				onClick={() => fileInputRef.current?.click()}
				disabled={uploading}
				className="flex items-center gap-2 px-3 md:px-4 py-2.5 rounded-xl bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white font-medium text-sm transition-all shadow-lg shadow-[var(--accent-shadow)] disabled:opacity-50"
			>
				{uploading ? (
					<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
				) : (
					<Upload size={16} />
				)}
				<span className="hidden sm:inline">Upload Resumes</span>
				<span className="sm:hidden">Upload</span>
			</button>
		</div>
	</div>
);

export default CandidateListHeader;
