/** @format */

/** JobEditorLoading - Centered spinner while an existing JD loads. */
const JobEditorLoading = () => (
    <div className="max-w-4xl mx-auto flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-[var(--accent-bg)] border-t-transparent rounded-full animate-spin" />
    </div>
);

export default JobEditorLoading;
