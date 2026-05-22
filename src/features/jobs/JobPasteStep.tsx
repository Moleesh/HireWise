/** @format */

import { ArrowRight } from 'lucide-react';
import FrostedCard from '../../shared/components/FrostedCard';
import ProgressBar from '../../shared/components/ProgressBar';

type JobPasteStepProps = {
  rawText: string;
  onRawTextChange: (text: string) => void;
  onParse: () => void;
  parsing: boolean;
};

/** JobPasteStep - Step 1 of job editor: paste raw JD text and parse it */
const JobPasteStep = ({ rawText, onRawTextChange, onParse, parsing }: JobPasteStepProps) => {
  return (
    <FrostedCard className="p-6" hover={false}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          Paste the Job Description
        </h2>
        <p className="text-sm text-[var(--text-tertiary)] mt-1">
          Paste the full job description text below. We'll extract the details for you.
        </p>
      </div>
      <textarea
        value={rawText}
        onChange={(e) => onRawTextChange(e.target.value)}
        placeholder="Paste the full job description here...&#10;&#10;Example:&#10;Senior Frontend Developer - San Francisco, CA&#10;We are looking for a Senior Frontend Developer to join our team...&#10;Requirements:&#10;- 5+ years of React experience&#10;- Strong TypeScript skills&#10;..."
        className="w-full h-80 bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl p-4 text-sm text-[var(--text-primary)] placeholder-[var(--text-quaternary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)] resize-none transition-all font-mono leading-relaxed"
      />
      <div className="flex justify-end mt-4">
        {parsing && (
          <div className="flex-1 mr-4">
            <ProgressBar label="Parsing job description..." value={60} />
          </div>
        )}
        <button
          onClick={onParse}
          disabled={!rawText.trim() || parsing}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white transition-all shadow-lg shadow-[var(--accent-shadow)] disabled:opacity-50 disabled:cursor-not-allowed"
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
    </FrostedCard>
  );
};

export default JobPasteStep;
