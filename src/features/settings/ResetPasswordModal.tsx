/** @format */

import Modal from '../../shared/components/Modal';
import type { User as UserType } from '../../shared/types';
import { displayUsername } from './_private/userAccess';

type ResetPasswordModalProps = {
    error: string;
    onClose: () => void;
    onPasswordChange: (password: string) => void;
    onSubmit: () => void;
    open: boolean;
    password: string;
    saving: boolean;
    user: UserType | null;
};

const ResetPasswordModal = ({
    error,
    onClose,
    onPasswordChange,
    onSubmit,
    open,
    password,
    saving,
    user,
}: ResetPasswordModalProps) => (
    <Modal open={open} onClose={onClose} title="Change Password" size="sm">
        <div className="space-y-4">
            <p className="text-sm text-[var(--text-tertiary)]">
                Set a new password for {user ? displayUsername(user.email) : 'this user'}.
            </p>
            <input
                type="password"
                value={password}
                onChange={(event) => onPasswordChange(event.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
                placeholder="New password, min 6 characters"
            />
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">
                    {error}
                </div>
            )}
            <div className="flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-[var(--text-secondary)] bg-[var(--btn-ghost-bg)] hover:bg-[var(--btn-ghost-hover)]"
                >
                    Cancel
                </button>
                <button
                    onClick={onSubmit}
                    disabled={saving}
                    className="px-4 py-2 rounded-xl text-sm font-medium bg-[var(--accent-bg)] hover:bg-[var(--accent-bg-hover)] text-white disabled:opacity-50"
                >
                    {saving ? 'Saving...' : 'Change Password'}
                </button>
            </div>
        </div>
    </Modal>
);

export default ResetPasswordModal;
