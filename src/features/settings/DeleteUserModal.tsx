/** @format */

import Modal from '../../shared/components/Modal';

type DeleteUserModalProps = {
	onClose: () => void;
	onConfirm: () => void;
	open: boolean;
};

const DeleteUserModal = ({ onClose, onConfirm, open }: DeleteUserModalProps) => (
	<Modal open={open} onClose={onClose} title="Delete User" size="sm">
		<p className="text-sm text-[var(--text-secondary)] mb-6">
			Are you sure you want to delete this user? This action cannot be undone.
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

export default DeleteUserModal;
