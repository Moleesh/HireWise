/** @format */

import Modal from '../../shared/components/Modal';

type DeleteCandidateModalProps = {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
};

/** DeleteCandidateModal - Confirmation dialog for destructive candidate removal. */
const DeleteCandidateModal = ({ open, onClose, onConfirm }: DeleteCandidateModalProps) => (
    <Modal open={open} onClose={onClose} title="Delete Candidate" size="sm">
        <p className="text-sm text-[var(--text-secondary)] mb-6">
            Are you sure you want to remove this candidate? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
            <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--btn-ghost-bg)] hover:bg-[var(--btn-ghost-hover)] transition-all"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-all"
            >
                Delete
            </button>
        </div>
    </Modal>
);

export default DeleteCandidateModal;
