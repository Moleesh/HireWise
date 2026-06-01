/** @format */

import { ArrowRight, Sparkles, FileText } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import ProgressBar from '../../shared/components/ProgressBar';
import { sampleJD } from './_private/sampleJD';

type JobPasteStepProps = {
    rawText: string;
    onRawTextChange: (text: string) => void;
    onParse: () => void;
    onEnhance: () => void;
    parsing: boolean;
    enhancing: boolean;
};

/** JobPasteStep - Step 1 of job editor: paste raw JD text, enhance via AI, parse. */
const JobPasteStep = ({
    rawText,
    onRawTextChange,
    onParse,
    onEnhance,
    parsing,
    enhancing,
}: JobPasteStepProps) => {
    return (
        <FrostedCard className="p-6" hover={false}>
            <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                        Paste the Job Description
                    </h2>
                    <p className="text-sm text-[var(--text-tertiary)] mt-1">
                        Paste raw text or load the sample. AI will clean it up before parsing.
                    </p>
                </div>
                <button
                    onClick={() => onRawTextChange(sampleJD)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all shrink-0"
                    type="button"
                >
                    <FileText size={14} /> Load sample
                </button>
            </div>
            <textarea
                value={rawText}
                onChange={(e) => onRawTextChange(e.target.value)}
                placeholder="Paste the full job description here..."
                className="w-full h-80 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-quaternary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] resize-none transition-all font-mono leading-relaxed"
            />
            <div className="flex items-center justify-between gap-4 mt-4">
                <div className="flex-1">
                    {(parsing || enhancing) && (
                        <ProgressBar
                            label={
                                enhancing ? 'Enhancing with AI...' : 'Parsing job description...'
                            }
                            value={60}
                        />
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onEnhance}
                        disabled={!rawText.trim() || parsing || enhancing}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-[var(--btn-ghost-bg)] text-[var(--text-secondary)] hover:bg-[var(--btn-ghost-hover)] transition-all disabled:opacity-50"
                        type="button"
                    >
                        <Sparkles size={14} /> Enhance
                    </button>
                    <button
                        onClick={onParse}
                        disabled={!rawText.trim() || parsing || enhancing}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white transition-all shadow-lg shadow-[var(--accent-shadow)] disabled:opacity-50"
                        type="button"
                    >
                        {parsing ? (
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Next <ArrowRight size={16} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </FrostedCard>
    );
};

export default JobPasteStep;
