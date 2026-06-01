/** @format */

import type { ChangeEvent, RefObject } from 'react';
import { Upload } from 'lucide-react';
import PageHero from '../../shared/components/PageHero';

type CandidateListHeaderProps = {
	fileInputRef: RefObject<HTMLInputElement | null>;
	uploading: boolean;
	onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** CandidateListHeader - Page title and resume upload entry point. */
const CandidateListHeader = ({ fileInputRef, uploading, onUpload }: CandidateListHeaderProps) => (
	<>
		<input
			ref={fileInputRef}
			type="file"
			accept=".pdf,.doc,.docx,.txt"
			multiple
			onChange={onUpload}
			className="hidden"
		/>
		<PageHero
			eyebrow="Talent Pipeline"
			title="Candidates"
			description="Manage your candidate pipeline and keep the funnel moving."
			action={
				<button
					onClick={() => fileInputRef.current?.click()}
					disabled={uploading}
					className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white font-medium text-xs md:text-sm whitespace-nowrap transition-all shadow-md shadow-[var(--accent-shadow)] disabled:opacity-50"
				>
					{uploading ? (
						<div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
					) : (
						<Upload size={14} />
					)}
					<span className="sm:hidden">Upload</span>
					<span className="hidden sm:inline">Upload Resumes</span>
				</button>
			}
		/>
	</>
);

export default CandidateListHeader;
