/** @format */

import JobDetailsStep from './JobDetailsStep';
import JobEditorHeader from './JobEditorHeader';
import JobEditorLoading from './JobEditorLoading';
import JobEditorStepper from './JobEditorStepper';
import JobPasteStep from './JobPasteStep';
import JobPreviewStep from './JobPreviewStep';
import PosterGeneratorModal from './PosterGeneratorModal';
import type { Page } from '../../shared/types';
import { useJobEditorState } from './hooks/useJobEditorState';

type JobEditorProps = {
    onNavigate: (page: Page, data?: Record<string, string>) => void;
    jobId?: string;
    mode?: 'create' | 'edit' | 'view';
};

/** JobEditorPage - Orchestrates JD creation, editing, viewing, and poster generation. */
const JobEditorPage = ({ onNavigate, jobId, mode = 'create' }: JobEditorProps) => {
    const editor = useJobEditorState({ jobId, mode, onNavigate });
    if (editor.loading) return <JobEditorLoading />;

    return (
        <div className="max-w-4xl mx-auto">
            <JobEditorHeader
                job={editor.job}
                jobId={jobId}
                isView={editor.isView}
                step={editor.step}
                saving={editor.saving}
                summarizing={editor.summarizing}
                summaryError={editor.summaryError}
                onNavigate={onNavigate}
                onRegenerateSummary={() => editor.generateSummary(true)}
                onOpenPoster={() => editor.setPosterOpen(true)}
                onSave={editor.handleSave}
            />
            {!editor.isView && (
                <JobEditorStepper
                    jobId={jobId}
                    mode={mode}
                    step={editor.step}
                    onStepChange={editor.setStep}
                />
            )}
            {editor.step === 1 && !editor.isView && (
                <JobPasteStep
                    rawText={editor.rawText}
                    onRawTextChange={editor.setRawText}
                    onParse={editor.parseRawText}
                    onEnhance={editor.enhanceText}
                    parsing={editor.parsing}
                    enhancing={editor.enhancing}
                />
            )}
            {editor.step === 2 && !editor.isView && (
                <JobDetailsStep
                    job={editor.job}
                    newItem={editor.newItem}
                    onUpdateField={editor.updateField}
                    onAddSkill={editor.addSkill}
                    onRemoveSkill={editor.removeSkill}
                    onAddGoodToHave={editor.addGoodToHave}
                    onRemoveGoodToHave={editor.removeGoodToHave}
                    onNewItemChange={(updates) =>
                        editor.setNewItem((prev) => ({ ...prev, ...updates }))
                    }
                    onNext={() => editor.setStep(3)}
                    onBack={() => (mode === 'edit' ? onNavigate('jobs') : editor.setStep(1))}
                />
            )}
            {(editor.step === 3 || editor.isView) && (
                <JobPreviewStep
                    job={editor.job}
                    isView={editor.isView}
                    saving={editor.saving}
                    summarizing={editor.summarizing}
                    summaryError={editor.summaryError}
                    onRegenerateSummary={editor.generateSummary}
                    onOpenPoster={() => editor.setPosterOpen(true)}
                    onSave={editor.handleSave}
                    onBack={() => editor.setStep(2)}
                />
            )}
            <PosterGeneratorModal
                isOpen={editor.posterOpen}
                onClose={() => editor.setPosterOpen(false)}
                job={editor.job}
                onSavePosters={editor.handleSavePosters}
            />
        </div>
    );
};

export default JobEditorPage;
